// Hackathon sign-up form (hackathon.html). Plain JS, no build step.

// Paste the Google Apps Script web app URL here (see README, "Hackathon sign-ups").
// While this is empty the page says sign-ups aren't open and the button is disabled.
const SHEET_ENDPOINT = '';

(function () {
  const form = document.getElementById('hack-form');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@(imperial\.ac\.uk|ic\.ac\.uk)$/i;
  const CID_RE = /^\d{8}$/;
  const TIMEOUT_MS = 20000;

  const $ = (id) => document.getElementById(id);
  const submit = $('f-submit');
  const summary = $('form-summary');
  const success = $('form-success');
  const failure = $('form-error');
  const teamDetails = $('team-details');
  const dietNone = $('f-diet-none');
  const dietOther = $('f-diet-other');
  const dietOtherWrap = $('diet-other-wrap');
  const dietBoxes = [...form.querySelectorAll('input[name="diet"]')];

  if (!SHEET_ENDPOINT) {
    $('form-closed').hidden = false;
    submit.disabled = true;
    submit.textContent = "Sign-ups aren't open yet";
    return;
  }

  // --- show/hide the extra bits ---
  function syncTeam() {
    const mode = form.querySelector('input[name="team_mode"]:checked');
    teamDetails.hidden = !mode || mode.value !== 'team';
  }

  function syncDiet(changed) {
    // "None" and the specific options can't both be ticked
    if (changed === dietNone && dietNone.checked) {
      dietBoxes.forEach((b) => { if (b !== dietNone) b.checked = false; });
    } else if (changed && changed !== dietNone && changed.checked) {
      dietNone.checked = false;
    }
    dietOtherWrap.hidden = !dietOther.checked;
  }

  form.addEventListener('change', (e) => {
    if (e.target.name === 'team_mode') syncTeam();
    if (e.target.name === 'diet') syncDiet(e.target);
  });
  syncTeam();
  syncDiet();

  // --- validation ---
  const val = (id) => $(id).value.trim();

  function checks() {
    const errors = [];
    const add = (fieldId, errId, msg) => errors.push({ fieldId, errId, msg });
    const mode = form.querySelector('input[name="team_mode"]:checked');

    if (!val('f-name')) add('f-name', 'f-name-err', 'Enter your full name.');

    const email = val('f-email');
    if (!email) add('f-email', 'f-email-err', 'Enter your Imperial email.');
    else if (!EMAIL_RE.test(email)) add('f-email', 'f-email-err', 'Use your Imperial email, ending in @imperial.ac.uk or @ic.ac.uk.');

    const cid = val('f-cid');
    if (cid && !CID_RE.test(cid)) add('f-cid', 'f-cid-err', 'A CID is 8 digits. Leave it blank if you were not asked for it.');

    if (!val('f-year')) add('f-year', 'f-year-err', 'Choose your year of study.');
    if (!val('f-dept')) add('f-dept', 'f-dept-err', 'Enter your department.');

    if (!mode) {
      add('f-team', 'f-team-err', 'Choose whether you have a team or want to be matched with one.');
    } else if (mode.value === 'team') {
      if (!val('f-team-name')) add('f-team-name', 'f-team-name-err', 'Enter your team name.');
      if (!val('f-mates')) add('f-mates', 'f-mates-err', "Add your teammates' names and emails.");
    }

    if (!dietBoxes.some((b) => b.checked)) add('f-diet', 'f-diet-err', 'Tick at least one dietary option, or None.');
    else if (dietOther.checked && !val('f-diet-other-text')) add('f-diet-other-text', 'f-diet-other-err', 'Tell us your other dietary needs.');

    if (!$('f-consent-data').checked) add('f-consent-data', 'f-consent-data-err', "We need your OK to store your details, or we can't sign you up.");

    return errors;
  }

  function clearErrors() {
    form.querySelectorAll('.field__err').forEach((p) => { p.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    summary.hidden = true;
    summary.textContent = '';
  }

  function showErrors(errors) {
    errors.forEach(({ fieldId, errId, msg }) => {
      $(errId).textContent = msg;
      const el = $(fieldId);
      if (el && el.tagName !== 'FIELDSET') el.setAttribute('aria-invalid', 'true');
    });
    summary.textContent = errors.length === 1
      ? 'There is 1 thing to fix before you can sign up.'
      : `There are ${errors.length} things to fix before you can sign up.`;
    summary.hidden = false;
    focusField(errors[0].fieldId);
  }

  function focusField(id) {
    const el = $(id);
    const target = el && el.tagName === 'FIELDSET' ? el.querySelector('input') : el;
    if (target) target.focus();
  }

  // --- payload ---
  function payload() {
    const data = new FormData(form);
    const body = new URLSearchParams();
    const mode = data.get('team_mode');
    const diet = data.getAll('diet');
    const fields = {
      name: val('f-name'),
      email: val('f-email').toLowerCase(),
      cid: val('f-cid'),
      year: data.get('year'),
      department: val('f-dept'),
      team_mode: mode,
      team_name: mode === 'team' ? val('f-team-name') : '',
      teammates: mode === 'team' ? val('f-mates') : '',
      diet: diet.join(', '),
      diet_other: diet.includes('Other') ? val('f-diet-other-text') : '',
      allergies: val('f-allergies'),
      access_needs: val('f-access'),
      consent_data: data.get('consent_data') ? 'yes' : 'no',
      consent_photos: data.get('consent_photos') ? 'yes' : 'no',
      website: data.get('website') || '',
    };
    Object.entries(fields).forEach(([k, v]) => body.append(k, v || ''));
    return body;
  }

  // --- sending ---
  // Why fetch with mode 'no-cors' and not a form POST into a hidden iframe:
  // Apps Script answers from a different origin (script.googleusercontent.com, after a redirect),
  // so the page can't read the reply either way. With a hidden iframe the load event fires
  // whether the post worked or not, so there's no reliable way to show the failure message.
  // fetch in no-cors mode gives back an unreadable ("opaque") response, but it *rejects* when the
  // request doesn't get through (offline, blocked, timed out), which is exactly the case we need
  // to catch. Bad input is already stopped by the checks above, and the Apps Script checks again,
  // so a request that arrives is treated as a successful sign-up.
  function send(body) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    return fetch(SHEET_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      // URLSearchParams body = application/x-www-form-urlencoded, allowed in no-cors mode;
      // Apps Script reads it as e.parameter
      body,
      signal: ctrl.signal,
    }).finally(() => clearTimeout(timer));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    failure.hidden = true;

    const errors = checks();
    if (errors.length) {
      showErrors(errors);
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending...';
    try {
      await send(payload());
      $('success-email').textContent = val('f-email');
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      console.error('Hackathon sign-up failed to send', err);
      failure.hidden = false;
      failure.focus();
    } finally {
      submit.disabled = false;
      submit.textContent = 'Sign up';
    }
  });
})();
