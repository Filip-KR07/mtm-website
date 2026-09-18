/* MTM — Motoren Technik Mayer · Interaktion & Scroll-Choreografie */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  const root = document.documentElement;
  const EN = root.lang === 'en';

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const setScrolled = () => { if (nav) nav.classList.toggle('is-scrolled', scrollY > 40); };
  setScrolled();
  addEventListener('scroll', setScrolled, { passive: true });

  /* ---------- menü (vollflächig, CSS-Transitions = unterbrechbar) ---------- */
  const menu = $('#menu');
  const toggle = $('#nav-toggle');
  const setMenu = (open) => {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', EN ? (open ? 'Close menu' : 'Open menu') : (open ? 'Menü schließen' : 'Menü öffnen'));
    document.body.classList.toggle('menu-open', open);
    nav.classList.toggle('is-scrolled', open || scrollY > 40);
  };
  if (menu && toggle) {
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  }
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- hero slider ---------- */
  const hero = $('.hero');
  if (hero) {
  const slides = $$('[data-slide]', hero);
  const dots = $$('.hero__dots button', hero);
  const DUR = 7000;
  // Ken Burns auch beim ersten Slide: Startzustand (scale 1.08) einmal erzwingen, dann aktivieren → Transition läuft
  if (!reduced && slides[0]) { slides[0].classList.remove('is-active'); void hero.offsetWidth; slides[0].classList.add('is-active'); }
  let idx = 0, timer = null;
  const animateIn = (slide) => {
    if (!window.gsap || reduced) { $$('[data-hero]', slide).forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
    gsap.fromTo($$('[data-hero]', slide), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.25, overwrite: true });
  };
  const show = (n, restart = true) => {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => {
      d.setAttribute('aria-selected', String(i === idx));
      // Progress-Animation neu starten
      const bar = d.firstElementChild; bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    });
    animateIn(slides[idx]);
    if (restart) schedule();
  };
  const schedule = () => { clearTimeout(timer); if (!reduced) timer = setTimeout(() => show(idx + 1), DUR); };
  dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
  hero.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
  // Touch: Wischen
  let sx = 0;
  hero.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { document.hidden ? clearTimeout(timer) : schedule(); });
  // Erst starten, wenn die Schrift da ist – sonst springt die Headline mitten in der Animation.
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(() => show(0));
  }

  /* ---------- scroller (leistungen): Pfeile + Maus-Drag, 1:1 am Zeiger ---------- */
  const scroller = $('#scroller');
  if (scroller) {
    const step = () => Math.min(scroller.clientWidth * 0.8, 800);
    $$('[data-scroll]').forEach((b) => b.addEventListener('click', () => {
      scroller.scrollBy({ left: step() * Number(b.dataset.scroll), behavior: reduced ? 'auto' : 'smooth' });
    }));
    let dragging = false, startX = 0, startLeft = 0, moved = 0;
    scroller.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      dragging = true; moved = 0; startX = e.clientX; startLeft = scroller.scrollLeft;
      scroller.setPointerCapture(e.pointerId);
    });
    scroller.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) { moved = 1; scroller.classList.add('is-dragging'); }
      scroller.scrollLeft = startLeft - dx;
    });
    const end = () => { if (!dragging) return; dragging = false; scroller.classList.remove('is-dragging'); };
    scroller.addEventListener('pointerup', end);
    scroller.addEventListener('pointercancel', end);
    scroller.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = 0; } }, true);
  }

  /* ---------- galerie: Bilder vorladen, sobald die Sektion in die Nähe kommt (sonst ruckelt das seitliche Scrollen) ---------- */
  const gal = $('.gal');
  if (gal) {
    let done = false;
    const warm = () => {
      if (done) return; done = true;
      $$('img[loading="lazy"]', gal).forEach((img) => { img.loading = 'eager'; img.decoding = 'async'; });
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { warm(); io.disconnect(); } }, { rootMargin: '150% 0px' });
      io.observe(gal);
    }
    // Fallback: kurz nach dem Laden, wenn der Hero steht – Galerie sitzt sonst beim ersten Wischen ohne Bilder da
    addEventListener('load', () => setTimeout(warm, 2500), { once: true });
  }

  /* ---------- galerie: langsamer Endlos-Lauf nach links ---------- */
  const galScroller = gal && $('#scroller', gal);
  if (galScroller && !reduced) {
    const track = $('.scroller__track', galScroller);
    const originals = Array.from(track.children);
    originals.forEach((li) => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
    galScroller.classList.add('is-auto');
    let loopW = 0, paused = false, userHold = 0, visible = true, last = 0;
    const SPEED = 28; // px pro Sekunde
    const measure = () => { const first = originals[0], firstClone = track.children[originals.length]; loopW = firstClone.offsetLeft - first.offsetLeft; };
    measure(); addEventListener('resize', measure);
    const tick = (now) => {
      const dt = Math.min(48, now - (last || now)); last = now;
      if (!paused && visible && now > userHold && loopW > 0) {
        let x = galScroller.scrollLeft + SPEED * dt / 1000;
        if (x >= loopW) x -= loopW;
        galScroller.scrollLeft = x;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const hold = (ms) => { userHold = performance.now() + ms; };
    // Pause nur beim aktiven Ziehen – nicht beim bloßen Hover, sonst steht die Galerie, sobald man sie ansieht
    galScroller.addEventListener('pointerdown', () => { paused = true; });
    addEventListener('pointerup', () => { paused = false; });
    addEventListener('pointercancel', () => { paused = false; });
    galScroller.addEventListener('touchstart', () => hold(4000), { passive: true });
    galScroller.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) hold(3000); }, { passive: true });
    galScroller.addEventListener('focusin', () => { paused = true; });
    galScroller.addEventListener('focusout', () => { paused = false; });
    $$('[data-scroll]').forEach((b) => b.addEventListener('click', () => hold(3000)));
    // Nahtloser Übergang auch bei manuellem Scrollen ans Ende
    galScroller.addEventListener('scroll', () => {
      if (loopW <= 0) return;
      if (galScroller.scrollLeft >= loopW * 1.5) galScroller.scrollLeft -= loopW;
    }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(galScroller);
  }

  /* ---------- händlersuche (Filter im DOM, ohne Backend) ---------- */
  const finder = $('#finder');
  if (finder) {
    const items = $$('#dealers .dealer');
    const cont = $('#f-cont'), cc = $('#f-cc'), plz = $('#f-plz');
    const count = $('#finder-count'), empty = $('#finder-empty');
    const CONT = {};
    $$('#f-cc option').forEach((o) => { const it = items.find((d) => d.dataset.cc === o.value); if (it) CONT[o.value] = it.dataset.cont; });
    const apply = () => {
      const c = cont.value, k = cc.value, p = plz.value.trim().replace(/\D/g, '');
      let n = 0;
      items.forEach((d) => {
        const ok = (!c || d.dataset.cont === c) && (!k || d.dataset.cc === k) && (!p || d.dataset.plz.startsWith(p));
        d.hidden = !ok; if (ok) n++;
      });
      $$('#f-cc option').forEach((o) => { if (o.value) o.hidden = !!c && CONT[o.value] !== c; });
      if (c && k && CONT[k] !== c) { cc.value = ''; return apply(); }
      count.textContent = n === 1 ? '1 Händler' : n + ' Händler';
      empty.hidden = n > 0;
    };
    [cont, cc].forEach((s) => s.addEventListener('change', apply));
    plz.addEventListener('input', apply);
    finder.addEventListener('reset', () => setTimeout(apply, 0));
    finder.addEventListener('submit', (e) => e.preventDefault());
    apply();
  }

  /* ---------- formular (mailto-Fallback, bis ein Endpunkt steht) ---------- */
  const form = $('#contact-form') || $('[data-form]');
  const note = $('#form-note');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = EN ? 'Please fill in all required fields and confirm the privacy notice.' : 'Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie den Datenschutzhinweis.';
      note.classList.add('is-error');
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    const kind = form.dataset.form || 'kontakt';
    const fahrzeug = (d.get('fahrzeug') || '').toString().trim();
    const subjects = { kontakt: (EN ? 'Enquiry via website' : 'Anfrage über die Website') + (fahrzeug ? ' – ' + fahrzeug : ''), presse: 'Antrag auf Pressekonto', newsletter: 'Newsletter-Anmeldung' };
    const subject = subjects[kind];
    const body = kind === 'kontakt'
      ? ['Name: ' + d.get('name'), (EN ? 'Email: ' : 'E-Mail: ') + d.get('email'), (EN ? 'Car: ' : 'Fahrzeug: ') + (fahrzeug || '–'), '', d.get('nachricht')].join('\n')
      : Array.from(d.entries()).filter(([k]) => k !== 'datenschutz').map(([k, v]) => k.charAt(0).toUpperCase() + k.slice(1) + ': ' + (v || '–')).join('\n');
    note.classList.remove('is-error');
    note.textContent = EN ? 'Your email client opens with the prepared enquiry.' : 'Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage.';
    location.href = 'mailto:' + (kind === 'presse' ? 'presse@mtm-online.de' : 'info@mtm-online.de') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  /* ---------- faq (details mit animiertem Auf-/Zuklappen, WAAPI) ---------- */
  $$('.faq__item').forEach((item) => {
    const summary = $('summary', item);
    const body = $('.faq__body', item);
    let anim = null;
    const run = (from, to, onDone) => {
      if (anim) anim.cancel();
      const a = body.animate(
        [{ height: from + 'px', opacity: from ? 1 : 0 }, { height: to + 'px', opacity: to ? 1 : 0 }],
        { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' }
      );
      anim = a;
      const finish = () => {
        if (anim !== a) return;
        anim = null;
        if (a.playState !== 'finished') a.cancel();
        body.style.height = '';
        onDone && onDone();
      };
      a.onfinish = finish;
      setTimeout(finish, 320);
    };
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (reduced) { item.open = !item.open; return; }
      if (item.open) run(body.offsetHeight, 0, () => { item.open = false; });
      else { item.open = true; run(0, body.scrollHeight); }
    });
  });

  /* ---------- motion (GSAP) ---------- */
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('js'); $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; }); return; }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (reduced) {
    $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
    return;
  }

  $$('[data-reveal]').forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  $$('[data-reveal-group]').forEach((group) => {
    ScrollTrigger.batch(group.children, {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true }),
    });
  });

  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const state = { v: 0 };
    gsap.to(state, {
      v: end, duration: 1.6, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(state.v); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Parallax auf Vollbild-Sektionen: Bild bewegt sich langsamer als der Inhalt.
  $$('[data-parallax]').forEach((media) => {
    gsap.fromTo(media, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: media.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
