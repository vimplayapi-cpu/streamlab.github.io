(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  const motionButton = document.querySelector('.motion-toggle');
  function syncMotion() {
    document.documentElement.classList.toggle('motion-off', paused);
    document.documentElement.classList.toggle('motion-user-enabled', !paused);
    motionButton.textContent = paused ? 'Enable motion' : 'Pause motion';
    motionButton.setAttribute('aria-pressed', String(paused));
  }
  syncMotion();
  motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reduced.addEventListener('change', e => { paused = e.matches; syncMotion(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .07 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.documentElement.classList.add('motion-ready');
  }
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  let previousOverflow = '';
  function setMenu(open, restoreFocus = true) {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.hidden = !open; nav.inert = !open;
    if (open) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; nav.querySelector('a').focus(); }
    else { document.body.style.overflow = previousOverflow; if (restoreFocus) menu.focus(); }
  }
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false, false); });
  document.addEventListener('keydown', e => {
    if (nav.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); setMenu(false); }
    if (e.key === 'Tab') {
      const items = [menu, ...nav.querySelectorAll('a')];
      const index = items.indexOf(document.activeElement);
      if (e.shiftKey && index <= 0) { e.preventDefault(); items.at(-1).focus(); }
      else if (!e.shiftKey && index === items.length - 1) { e.preventDefault(); menu.focus(); }
    }
  });
  matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches && !nav.hidden) setMenu(false, false); });
  const progress = document.querySelector('.progress');
  let scrollScheduled = false;
  function updateProgress() {
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
    scrollScheduled = false;
  }
  addEventListener('scroll', () => { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  updateProgress();
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        if (paused) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--rx', `${-(e.clientY - r.top - r.height / 2) / r.height * 5}deg`);
        el.style.setProperty('--ry', `${(e.clientX - r.left - r.width / 2) / r.width * 6}deg`);
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
    const hero = document.querySelector('.hero');
    const art = document.querySelector('[data-parallax]');
    if (hero && art) {
      hero.addEventListener('pointermove', e => {
        if (paused) return;
        const r = hero.getBoundingClientRect();
        art.style.setProperty('--px', `${(e.clientX - r.left - r.width / 2) * .018}px`);
        art.style.setProperty('--py', `${(e.clientY - r.top - r.height / 2) * .018}px`);
      });
      hero.addEventListener('pointerleave', () => { art.style.setProperty('--px', '0px'); art.style.setProperty('--py', '0px'); });
    }
  }
  const form = document.querySelector('#contact-form');
  if (form) {
    const interests = { 'streamsphere': 'Streamsphere', 'edit-pro': 'Streamlab Edit Pro', 'analytics': 'Streamlab Analytics', 'streamsense': 'StreamSense' };
    const param = new URLSearchParams(location.search).get('interest');
    const chosen = interests[param] || param;
    if ([...form.elements.interest.options].some(o => o.value === chosen)) form.elements.interest.value = chosen;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const body = `Hello Streamlab,\n\n${values.get('message')}\n\nName: ${values.get('first')} ${values.get('last')}\nEmail: ${values.get('email')}\nInterest: ${values.get('interest')}`;
      const mail = `mailto:info@streamlab.com?subject=${encodeURIComponent('Streamlab enquiry: ' + values.get('interest'))}&body=${encodeURIComponent(body)}`;
      const fallback = document.querySelector('#email-fallback');
      fallback.href = mail; fallback.hidden = false;
      document.querySelector('#form-status').textContent = 'Your enquiry is prepared. Send it from your email app. If nothing opened, use the link below or call our team.';
      location.href = mail;
    });
  }
})();
