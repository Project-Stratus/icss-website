/**
 * ICSS Autumn Hackathon sign-ups -> Google Sheet.
 *
 * This is NOT run by the website. Paste it into the Sheet's Apps Script editor
 * (Extensions > Apps Script) and deploy it as a web app. Full steps are in README.md,
 * "Hackathon sign-ups". The page that posts here is hackathon.html / js/hackathon-form.js.
 *
 * Every sign-up becomes one row in the "Sign-ups" tab (created, with a header row, on the
 * first sign-up). If you add a field to the form, add its name to FIELDS below as well,
 * then redeploy (Deploy > Manage deployments > edit > Version: New version).
 */

var SHEET_NAME = 'Sign-ups';

// order of the columns after the timestamp. Names match the form's field names.
var FIELDS = [
  'name', 'email', 'cid', 'year', 'department',
  'team_mode', 'team_name', 'teammates',
  'diet', 'diet_other', 'allergies', 'access_needs',
  'consent_data', 'consent_photos'
];

var REQUIRED = ['name', 'email', 'year', 'department', 'team_mode', 'diet', 'consent_data'];
var EMAIL_RE = /^[^\s@]+@(imperial\.ac\.uk|ic\.ac\.uk)$/i;
var MAX_LEN = 2000;

function doPost(e) {
  var p = (e && e.parameter) || {};

  // honeypot: people never see the "website" field, bots fill it in.
  // Say "ok" so the bot moves on, but don't save anything.
  if (p.website) return reply({ ok: true });

  var errors = validate(p);
  if (errors.length) return reply({ ok: false, errors: errors });

  // stop two sign-ups at the same moment both writing the header row
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet();
    var row = [new Date()].concat(FIELDS.map(function (f) { return clean(p[f]); }));
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

// opening the web app URL in a browser shows this, handy for checking the deployment works
function doGet() {
  return reply({ ok: true, message: 'ICSS hackathon sign-up endpoint. Sign-ups are sent here with POST.' });
}

function validate(p) {
  var errors = [];
  REQUIRED.forEach(function (f) {
    if (!String(p[f] || '').trim()) errors.push('missing ' + f);
  });
  if (p.email && !EMAIL_RE.test(String(p.email).trim())) errors.push('email must end in @imperial.ac.uk or @ic.ac.uk');
  if (p.cid && !/^\d{8}$/.test(String(p.cid).trim())) errors.push('cid must be 8 digits');
  if (p.team_mode && p.team_mode !== 'team' && p.team_mode !== 'match') errors.push('bad team_mode');
  if (p.team_mode === 'team' && !String(p.team_name || '').trim()) errors.push('missing team_name');
  if (p.team_mode === 'team' && !String(p.teammates || '').trim()) errors.push('missing teammates');
  if (p.consent_data && p.consent_data !== 'yes') errors.push('consent_data must be yes');
  return errors;
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp'].concat(FIELDS));
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// trims, caps the length, and stops anything that looks like a formula
// (=, +, -, @) being run when the sheet is opened
function clean(v) {
  var s = String(v == null ? '' : v).trim().slice(0, MAX_LEN);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
