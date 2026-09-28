// ICSS — small bits of behaviour. Plain JS, no build step.

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  // --- mark the current page in the taskbar ---
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".taskbar__nav a").forEach((a) => {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });

  // --- project cards: play video / flip through photos on hover ---
  function setupCard(card) {
    const video = card.querySelector("video");
    const frames = [...card.querySelectorAll(".card__media img")];
    let timer = null;
    let i = 0;

    const start = () => {
      card.classList.add("is-playing");
      if (video) {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else if (frames.length > 1 && !timer && !reduceMotion) {
        timer = setInterval(() => {
          frames[i].classList.remove("is-on");
          i = (i + 1) % frames.length;
          frames[i].classList.add("is-on");
        }, 520);
      }
    };
    const stop = () => {
      card.classList.remove("is-playing");
      if (video) video.pause();
      clearInterval(timer);
      timer = null;
    };

    if (canHover) {
      card.addEventListener("mouseenter", start);
      card.addEventListener("mouseleave", stop);
      card.addEventListener("focus", start);
      card.addEventListener("blur", stop);
    }
    return { start, stop };
  }

  const cards = [...document.querySelectorAll(".card")].map((el) => ({ el, ...setupCard(el) }));

  // no hover on phones: play whichever card is in the middle of the screen
  if (!canHover && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const c = cards.find((x) => x.el === e.target);
          if (c) (e.isIntersecting ? c.start : c.stop)();
        });
      },
      { rootMargin: "-35% 0px -35% 0px" }
    );
    cards.forEach((c) => io.observe(c.el));
  }

  // --- the telly on the events page: load the YouTube clip once it's on screen ---
  document.querySelectorAll("iframe[data-yt]").forEach((frame) => {
    const id = frame.dataset.yt;
    const load = () => {
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0`;
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { load(); io.disconnect(); }
      });
      io.observe(frame);
    } else {
      load();
    }
  });

  // --- blog: posts pulled from a published Google Sheet (CSV) ---
  const feed = document.querySelector(".sheet-feed[data-sheet]");
  if (feed && feed.dataset.sheet) {
    const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const safeUrl = (u) => (/^https?:\/\//i.test(u) ? esc(u) : "");
    const parseCSV = (text) => {
      const rows = [];
      let row = [], cell = "", q = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (q) {
          if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
          else if (c === '"') q = false;
          else cell += c;
        } else if (c === '"') q = true;
        else if (c === ",") { row.push(cell); cell = ""; }
        else if (c === "\n" || c === "\r") {
          if (c === "\r" && text[i + 1] === "\n") i++;
          row.push(cell); rows.push(row); row = []; cell = "";
        } else cell += c;
      }
      if (cell || row.length) { row.push(cell); rows.push(row); }
      return rows;
    };
    fetch(feed.dataset.sheet)
      .then((r) => r.text())
      .then((text) => {
        const [head, ...rows] = parseCSV(text);
        const col = (name) => head.findIndex((h) => h.trim().toLowerCase() === name);
        const [d, t, a, p, b, im, l] = ["date", "title", "author", "project", "body", "image", "link"].map(col);
        const posts = rows.filter((r) => r[t] && r[t].trim()).reverse(); // newest rows at the bottom of the sheet
        if (!posts.length) return;
        feed.innerHTML = posts.map((r) => {
          const img = im >= 0 && safeUrl(r[im] || "") ? `<img src="${safeUrl(r[im])}" alt="" loading="lazy">` : "";
          const more = l >= 0 && safeUrl(r[l] || "") ? ` <a href="${safeUrl(r[l])}">read more &rarr;</a>` : "";
          const meta = [r[d], r[a], r[p]].filter(Boolean).map(esc).join(" &middot; ");
          const body = esc(r[b] || "").split(/\n{2,}/).map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`).join("");
          return `<article class="sheet-post">${img}<h3>${esc(r[t])}</h3><p class="post__meta">${meta}</p>${body}${more}</article>`;
        }).join("");
      })
      .catch(() => {});
  }
  const editBtn = document.querySelector("[data-sheet-edit]");
  if (editBtn && editBtn.getAttribute("href") === "#") editBtn.hidden = true;

  // --- floating graphics you can grab and fling about ---
  document.querySelectorAll(".floater").forEach((el) => {
    let sx = 0, sy = 0, ox = 0, oy = 0;
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
      sx = e.clientX; sy = e.clientY;
      const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(el.style.transform || "");
      ox = m ? +m[1] : 0; oy = m ? +m[2] : 0;
    });
    el.addEventListener("pointermove", (e) => {
      if (!el.classList.contains("is-dragging")) return;
      el.style.transform = `translate(${ox + e.clientX - sx}px, ${oy + e.clientY - sy}px)`;
    });
    const drop = () => el.classList.remove("is-dragging");
    el.addEventListener("pointerup", drop);
    el.addEventListener("pointercancel", drop);
  });
})();
