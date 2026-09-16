/* MTM — Motoren Technik Mayer · Scroll-Choreografie & Interaktion */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  const root = document.documentElement;

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const toggle = $('#nav-toggle');
  const setScrolled = () => nav.classList.toggle('is-scrolled', scrollY > 24);
  setScrolled();
  addEventListener('scroll', setScrolled, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('#nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- aktiver abschnitt ---------- */
  const links = $$('#nav-links a[href^="#"]:not(.btn)');
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(en.target.id).setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- formular (mailto-Fallback, bis ein Endpunkt steht) ---------- */
  const form = $('#contact-form');
  const note = $('#form-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = 'Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie den Datenschutzhinweis.';
      note.classList.add('is-error');
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    const fahrzeug = (d.get('fahrzeug') || '').toString().trim();
    const subject = 'Anfrage über die Website' + (fahrzeug ? ' – ' + fahrzeug : '');
    const body = [
      'Name: ' + d.get('name'),
      'E-Mail: ' + d.get('email'),
      'Fahrzeug: ' + (fahrzeug || '–'),
      '',
      d.get('nachricht'),
    ].join('\n');
    note.classList.remove('is-error');
    note.textContent = 'Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage.';
    location.href = 'mailto:info@example.de?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  /* ---------- motion ---------- */
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (reduced) {
    $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
    return;
  }

  /* ---------- hero ---------- */
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
  intro
    .to('[data-hero-line]', { y: 0, duration: 1.1, stagger: 0.1 }, 0.1)
    .to('[data-hero]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out' }, 0.35)
    .to('[data-hero-media]', { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 0.3);
  // Erst starten, wenn die Schriften da sind – sonst springt die Headline mitten in der Animation.
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(() => intro.play());

  /* ---------- reveals ---------- */
  $$('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  $$('[data-reveal-group]').forEach((group) => {
    ScrollTrigger.batch(group.children, {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
    });
  });

  /* ---------- zähler ---------- */
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const state = { v: 0 };
    gsap.to(state, {
      v: end, duration: 1.6, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(state.v); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  /* ---------- parallax (nur mit Maus, nicht auf Touch) ---------- */
  if (!isTouch) {
    $$('[data-parallax]').forEach((img) => {
      gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
