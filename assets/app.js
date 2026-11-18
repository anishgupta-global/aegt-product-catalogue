(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // category filter + paging
  const grid = $("[data-grid]");
  if (grid) {
    const items = $$("[data-item]", grid), f = $("[data-filter]"), more = $("[data-more]"), PER = 48; let n = PER;
    const show = () => { const q = (f && f.value || "").trim().toLowerCase(); let shown = 0;
      items.forEach(x => { const hit = !q || x.dataset.q.includes(q); const vis = hit && (q || shown < n); x.hidden = !vis; if (vis) shown++; });
      if (more) more.hidden = !!q || items.length <= n; };
    if (f) f.addEventListener("input", show); if (more) more.addEventListener("click", () => { n += PER; show(); }); show();
  }
  // global search
  if (window.PSEARCH) {
    const q = new URLSearchParams(location.search).get("q") || "", out = $("#ps-res"), qs = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    $("#ps-q").textContent = q; const inp = $("header .search input"); if (inp) inp.value = q;
    const hits = qs.length ? window.PSEARCH.filter(p => qs.every(w => p.s.includes(w))) : [];
    out.innerHTML = hits.length ? hits.map(p => `<a class="card" href="${esc(p.h)}"><div class="img">${p.i ? `<img src="${esc(p.i)}" alt="" loading="lazy">` : ""}</div><div class="t"><span class="nm">${esc(p.n)}</span><span class="pshort">${esc(p.c)}</span></div></a>`).join("")
      : `<p class="muted">${esc(out.dataset.none)}</p>`;
  }
})();
