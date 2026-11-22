/* JT Flowops, phones only (under 640px). The design kit holds every visual still on a phone and cuts
   desktop-sized pictures with a fade. This file changes that for this site, without touching the kit:
   1. a hero window shows only the rows that fit whole;
   2. a card's or split's picture panel takes the height of the picture in it, so nothing is cut;
   3. the picture on screen plays (the kit's own hover play, asked for by script), one at a time,
      and plays again on a tap. Reduced motion: nothing plays. Wider screens: this file does nothing. */
(() => {
  const phone = matchMedia('(max-width: 639px)');
  if (!phone.matches) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fitHero = () => {
    document.querySelectorAll('.hero__media .ui-win__rows').forEach(ul => {
      const edge = ul.closest('.hero__media').getBoundingClientRect().bottom - 20;
      const rows = [...ul.children];
      rows.forEach(li => { li.style.display = ''; });
      rows.forEach((li, i) => { if (i > 1 && li.getBoundingClientRect().bottom > edge) li.style.display = 'none'; });
    });
  };

  const fitPanels = () => {
    document.querySelectorAll('main .panel > .stage').forEach(stage => {
      const panel = stage.parentElement;
      if (panel.closest('.hero')) return;
      const piece = stage.querySelector(':scope > .at-rise > .ui, :scope > .at-rise > [data-ui], :scope > .at-corner > .ui, :scope > .at-corner > [data-ui]');
      if (!piece) return;
      const top = piece.getBoundingClientRect().top - panel.getBoundingClientRect().top;
      const h = Math.ceil(top + piece.getBoundingClientRect().height + 24);
      if (h > 120) panel.style.setProperty('--p-h', h + 'px');
      // a panel its section stretches taller than the picture: the picture sits in the middle of it
      const wrap = piece.parentElement, spare = panel.getBoundingClientRect().height - h;
      wrap.style.top = spare > 40 ? Math.round(24 + spare / 2) + 'px' : '';
    });
  };

  const fit = () => { fitHero(); fitPanels(); };
  const settle = () => [0, 400, 1200, 2500].forEach(ms => setTimeout(fit, ms));
  if (document.readyState === 'complete') settle(); else addEventListener('load', settle);
  addEventListener('orientationchange', () => setTimeout(fit, 300));

  if (reduced || !('IntersectionObserver' in window)) return;
  const hostOf = el => el.closest('[data-ui-hover], .card, .tile, .menu-card') || el.closest('[data-ui-pause-host], .panel__screen, .panel, .frame');
  let playing = null, timer = 0;
  const rest = host => { host.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' })); if (playing === host) playing = null; };
  const play = host => {
    if (playing && playing !== host) rest(playing);
    playing = host; clearTimeout(timer);
    host.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    timer = setTimeout(() => rest(host), 9000);
  };
  const start = () => {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      const host = hostOf(e.target);
      if (!host) return;
      if (e.isIntersecting && e.intersectionRatio >= 0.6) play(host);
      else if (playing === host) rest(host);
    }), { threshold: [0, 0.6] });
    document.querySelectorAll('main .stage').forEach(stage => {
      if (!stage.querySelector('[data-ui]')) return;
      const box = stage.parentElement, host = hostOf(stage);
      io.observe(box);
      if (host) box.addEventListener('click', () => play(host));
    });
  };
  if (document.readyState === 'complete') setTimeout(start, 900); else addEventListener('load', () => setTimeout(start, 900));
})();
