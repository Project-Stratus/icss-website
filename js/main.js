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

  // --- blog: every post comes from a published Google Sheet ---
  // Idea from Tomo Kihara's sheet2news.js (github.com/kihapper/sheet2news.js). The feed URL that
  // script used was switched off by Google in 2021, so this reads the sheet's CSV export instead.
  // Columns: Date | Title | Project | Author | Description | Image | Link | Show (only "yes" rows show)
  const feed = document.querySelector(".sheet-feed[data-sheet]");
  if (feed && feed.dataset.sheet) {
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    // allow full web links or paths on this site, nothing else (no javascript: etc)
    const safeUrl = (u) => (/^(https?:\/\/|archive\/|assets\/)/i.test(u.trim()) ? esc(u.trim()) : "");
    const niceDate = (d) => {
      const m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/.exec(d.trim());
      if (!m) return esc(d);
      return (m[3] ? +m[3] + " " : "") + MONTHS[+m[2] - 1] + " " + m[1];
    };
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
      .then((r) => { if (!r.ok) throw new Error("sheet not shared"); return r.text(); })
      .then((text) => {
        const [head, ...rows] = parseCSV(text);
        const names = head.map((h) => h.trim().toLowerCase());
        const posts = rows
          .map((r) => {
            const get = (...keys) => { for (const k of keys) { const i = names.indexOf(k); if (i >= 0 && r[i]) return r[i].trim(); } return ""; };
            return { date: get("date"), title: get("title"), project: get("project"), author: get("author"),
                     text: get("description", "body"), image: get("image"), link: get("link"), show: get("show").toLowerCase() };
          })
          .filter((p) => p.title && p.show === "yes")
          .sort((a, b) => b.date.localeCompare(a.date)); // newest first

        const isArchive = (p) => parseInt(p.date, 10) <= 2023;
        const latest = posts.filter((p) => !isArchive(p));
        const old = posts.filter(isArchive);

        // new posts: title, details, text, picture
        feed.innerHTML = latest.map((p) => {
          const link = safeUrl(p.link), img = safeUrl(p.image);
          const meta = [p.date && niceDate(p.date), p.project && esc(p.project), p.author && esc(p.author)].filter(Boolean).join(" &middot; ");
          const title = link ? `<a href="${link}">${esc(p.title)}</a>` : esc(p.title);
          const body = esc(p.text).split(/\n{2,}/).map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`).join("");
          return `<article class="sheet-post">${img ? `<img src="${img}" alt="" loading="lazy">` : ""}<h3>${title}</h3><p class="post__meta">${meta}</p>${body}</article>`;
        }).join("");

        // archive: the same year-by-year list as before, but from the sheet
        const archive = document.getElementById("archive-posts");
        if (archive && old.length) {
          let html = "", year = "";
          old.forEach((p) => {
            const y = p.date.slice(0, 4);
            if (y !== year) { html += (year ? "</ul>" : "") + `<h3 class="year-head">${esc(y)}</h3><ul class="post-list">`; year = y; }
            const link = safeUrl(p.link);
            html += `<li><time>${niceDate(p.date)}</time>` + (link
              ? `<a href="${link}">${esc(p.title)}</a>`
              : `<span class="gone">${esc(p.title)} <small>(lost in the Great Fire)</small></span>`) + "</li>";
          });
          archive.innerHTML = html + "</ul>";
        }
      })
      .catch(() => {}); // if the sheet can't be reached, the built-in list stays up
  }

  // "add your update" link on the blog: private for now, so it only shows when viewing the site locally
  const onLocalhost = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  document.querySelectorAll("[data-private]").forEach((el) => { if (onLocalhost) el.hidden = false; });

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
