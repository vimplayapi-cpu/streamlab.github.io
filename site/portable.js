(() => {
  'use strict';
  const scriptUrl = document.querySelector('script[src$="portable.js"]')?.src || location.href;
  const siteUrl = path => new URL(path, scriptUrl).href;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionEnabled = !reducedMotion.matches && !navigator.connection?.saveData;
  const runningAnimations = new Set();
  const animate = (element, frames, options) => {
    if (!motionEnabled || !element.animate) return;
    const animation = element.animate(frames, options);
    runningAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => runningAnimations.delete(animation));
  };
  const overlays = [...document.querySelectorAll('[data-hook="hamburger-overlay-root"]')];
  const openers = [...document.querySelectorAll('.wixui-hamburger-open-button')];
  let activeMenu = null;
  let returnFocus = null;
  function closeMenu() {
    if (!activeMenu) return;
    activeMenu.dataset.visible = 'false';
    activeMenu.setAttribute('aria-hidden', 'true');
    activeMenu = null;
    document.body.classList.remove('portable-menu-open');
    document.querySelectorAll('main,footer').forEach(x => { x.inert = false; });
    openers.forEach(x => x.setAttribute('aria-expanded', 'false'));
    returnFocus?.setAttribute('aria-expanded', 'false');
    returnFocus?.focus({preventScroll:true});
  }
  function openMenu(button) {
    const menu = overlays[openers.indexOf(button)] || overlays[0];
    if (!menu) return;
    closeMenu();
    returnFocus = button;
    activeMenu = menu;
    menu.dataset.visible = 'true';
    menu.removeAttribute('aria-hidden');
    menu.querySelectorAll('[aria-hidden="true"]').forEach(x => x.setAttribute('aria-hidden', 'false'));
    document.body.classList.add('portable-menu-open');
    document.querySelectorAll('main,footer').forEach(x => { if (!x.contains(menu)) x.inert = true; });
    button.setAttribute('aria-expanded', 'true');
    [...menu.querySelectorAll('button,a[href]')].find(x => x.getClientRects().length)?.focus();
    const panel = menu.querySelector('.portable-menu-links');
    if (panel) animate(panel, [{opacity:0,translate:'32px 0'},{opacity:1,translate:'0 0'}], {duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
  overlays.forEach(menu => {
    if (!menu.querySelector('a[href]')) {
      const source = document.querySelector('header nav.wixui-menu');
      if (source) {
        const nav = document.createElement('nav'); nav.className = 'portable-menu-links'; nav.setAttribute('aria-label', 'Site navigation');
        source.querySelectorAll('a[href]').forEach(link => {
          const copy = document.createElement('a'); copy.href = link.getAttribute('href'); copy.textContent = link.textContent.trim(); nav.append(copy);
        });
        const news = document.createElement('a'); news.href = siteUrl('blog/index.html'); news.textContent = 'News';
        nav.insertBefore(news, nav.lastElementChild);
        menu.prepend(nav);
      }
    }
    menu.dataset.visible = 'false';
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Site menu');
    menu.querySelectorAll('a[href]').forEach(link => {
      const clean = url => new URL(url, location.href).pathname.replace(/index\.html$/,'').replace(/\/$/,'');
      if (!link.hash && clean(link.href) === clean(location.href)) link.setAttribute('aria-current', 'page');
      link.addEventListener('click', closeMenu);
    });
    menu.querySelectorAll('.wixui-hamburger-close-button').forEach(x => x.addEventListener('click', closeMenu));
    menu.addEventListener('click', event => {
      if (event.target === menu || event.target.closest('[data-hook="hamburger-overlay-dialog"]')) closeMenu();
    });
  });
  openers.forEach(button => {
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => openMenu(button));
  });
  // The live site's header also contains a custom vector menu icon.
  document.querySelectorAll('button.wixui-vector-image').forEach(button => {
    if (!button.closest('header,#SITE_HEADER,[data-semantic-classname="header"]')) return;
    button.setAttribute('aria-label', 'Menu');
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => openMenu(button));
  });
  document.addEventListener('keydown', event => {
    if (!activeMenu) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
    if (event.key !== 'Tab') return;
    const focusable = [...activeMenu.querySelectorAll('a[href],button,[tabindex="0"]')].filter(x => x.getClientRects().length);
    if (!focusable.length) { event.preventDefault(); return; }
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.querySelector('#SKIP_TO_CONTENT_BTN')?.addEventListener('click', () => {
    const main = document.querySelector('main');
    if (main) { main.tabIndex = -1; main.focus(); main.scrollIntoView(); }
  });
  const videos = [...document.querySelectorAll('video')];
  const visibleVideos = new Set();
  function loadVideo(video) {
    if (!video.getAttribute('src') && video.dataset.videoSrc) video.src = video.dataset.videoSrc;
  }
  function updateVideos() {
    videos.forEach(video => {
      if (motionEnabled && visibleVideos.has(video) && !document.hidden && !video.dataset.userPaused) {
        loadVideo(video); video.play().catch(() => {});
      } else video.pause();
    });
  }
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleVideos.add(entry.target); else visibleVideos.delete(entry.target);
    });
    updateVideos();
  }, {rootMargin:'120px 0px'});
  videos.forEach(video => {
    video.muted = true;
    videoObserver.observe(video);
    // Native controls also work when automatic motion is disabled.
    video.addEventListener('pointerdown', () => loadVideo(video));
    video.addEventListener('keydown', event => {
      if ([' ', 'Enter', 'MediaPlayPause'].includes(event.key)) loadVideo(video);
    });
  });
  document.addEventListener('visibilitychange', updateVideos);
  document.querySelectorAll('[data-testid="vb-audio"],[data-testid="vb-play"],[data-testid="vb-play-pause"]').forEach(control => {
    const activate = () => {
      let parent = control.parentElement;
      while (parent && !parent.querySelector('video')) parent = parent.parentElement;
      const video = parent?.querySelector('video');
      if (!video) return;
      if (control.dataset.testid === 'vb-audio') {
        video.muted = !video.muted; control.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute'); control.setAttribute('aria-pressed', String(video.muted));
      } else if (video.paused) { delete video.dataset.userPaused; loadVideo(video); video.play().catch(() => {}); control.setAttribute('aria-label', 'Pause'); }
      else { video.dataset.userPaused = 'true'; video.pause(); control.setAttribute('aria-label', 'Play'); }
    };
    control.addEventListener('click', activate);
    control.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } });
  });
  document.querySelectorAll('form[data-portable-form]').forEach(form => {
    const nativePosition = form.querySelector('select[name="Open Positions"]');
    const requestedPosition = new URLSearchParams(location.search).get('position');
    if (nativePosition && [...nativePosition.options].some(option => option.value === requestedPosition)) nativePosition.value = requestedPosition;
    form.querySelectorAll('[data-form-unavailable]').forEach(note => {
      const key = note.dataset.formUnavailable === 'newsletter' ? 'newsletterEndpoint' : 'contactEndpoint';
      note.hidden = Boolean(window.STREAMLAB_CONFIG?.forms?.[key]);
    });
    form.querySelectorAll('[data-hook="dropdown-base"][aria-label="Open Positions"]').forEach(button => {
      const select = document.createElement('select');
      select.name = 'Open Positions'; select.setAttribute('aria-label', 'Open Positions');
      for (const label of ['', 'Creative', 'Marketing', 'Analytics', 'R&D']) {
        const option = document.createElement('option'); option.value = label; option.textContent = label || 'Choose a position'; select.append(option);
      }
      button.parentElement.style.position = 'relative';
      select.className = 'portable-native-select';
      button.parentElement.append(select);
      button.tabIndex = -1; button.setAttribute('aria-hidden', 'true');
      select.addEventListener('change', () => { button.querySelector('[data-hook="dropdown-base-text"]').textContent = select.value; });
      const requested = new URLSearchParams(location.search).get('position');
      if ([...select.options].some(option => option.value === requested)) { select.value = requested; select.dispatchEvent(new Event('change')); }
    });
    form.querySelectorAll('[data-hook="country-selector-trigger"]').forEach(button => {
      const popover = document.createElement('div');
      popover.className = 'portable-country-popover'; popover.hidden = true;
      const label = document.createElement('label'); label.textContent = 'Country calling code';
      const input = document.createElement('input'); input.type = 'text'; input.name = 'Country calling code';
      input.placeholder = '+995'; input.pattern = '\\+[0-9]{1,4}'; input.inputMode = 'tel';
      label.append(input); popover.append(label); button.parentElement.append(popover);
      button.parentElement.style.position = 'relative';
      button.addEventListener('click', () => { popover.hidden = !popover.hidden; button.setAttribute('aria-expanded', String(!popover.hidden)); if (!popover.hidden) input.focus(); });
      input.addEventListener('change', () => { if (!input.value || input.checkValidity()) { popover.hidden = true; button.setAttribute('aria-expanded', 'false'); if (input.value) button.querySelector('span').textContent = input.value; } });
      form.querySelector('input[type="phone"]')?.setAttribute('type', 'tel');
    });
    const consent = form.querySelector('input[type="checkbox"]');
    if (/subscr|newsletter/i.test(form.dataset.portableForm) && consent) consent.required = true;
    consent?.addEventListener('change', () => {
      const wrapper = consent.closest('[data-checked]');
      if (wrapper) wrapper.dataset.checked = String(consent.checked);
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      let status = form.querySelector('.portable-form-status');
      if (!status) { status = document.createElement('p'); status.className = 'portable-form-status'; status.setAttribute('role', 'status'); form.append(status); }
      const isNewsletter = /subscr|newsletter/i.test(form.dataset.portableForm);
      const settings = window.STREAMLAB_CONFIG?.forms || {};
      const endpoint = isNewsletter ? settings.newsletterEndpoint : settings.contactEndpoint;
      if (!endpoint) { status.textContent = 'This form is not connected yet. Your information has not been sent.'; return; }
      let url;
      try { url = new URL(endpoint, location.href); }
      catch { status.textContent = 'The form is unavailable. Please try again later.'; return; }
      if (url.protocol !== 'https:' && url.origin !== location.origin) { status.textContent = 'The form is unavailable. Please try again later.'; return; }
      const submit = form.querySelector('[type="submit"]');
      if (submit) submit.disabled = true;
      status.textContent = 'Sending…';
      try {
        const fields = Object.fromEntries(new FormData(form));
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: form.dataset.portableForm, fields }) });
        if (!response.ok) throw new Error('Submission failed');
        status.textContent = 'Thank you. Your submission has been received.';
        form.reset();
      } catch { status.textContent = 'Your submission could not be sent. Please try again.'; }
      finally { if (submit) submit.disabled = false; }
    });
  });
  function announce(message) {
    let toast = document.querySelector('.portable-toast');
    if (!toast) { toast = document.createElement('div'); toast.className = 'portable-toast'; toast.setAttribute('role', 'status'); document.body.append(toast); }
    toast.textContent = message; toast.hidden = false;
    clearTimeout(announce.timer); announce.timer = setTimeout(() => { toast.hidden = true; }, 6000);
  }
  async function copyLink(url) {
    try { await navigator.clipboard.writeText(url); announce('Link copied.'); }
    catch { announce('Copy this link: ' + url); }
  }
  document.querySelectorAll('[data-hook^="share-button__"]').forEach(button => {
    button.addEventListener('click', () => {
      const channel = button.dataset.hook.replace('share-button__', '');
      const url = location.href;
      if (channel === 'link') return copyLink(url);
      if (channel === 'print') return window.print();
      const targets = {
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
        twitter: 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(document.title),
        'linked-in': 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url)
      };
      if (targets[channel]) window.open(targets[channel], '_blank', 'noopener,noreferrer');
    });
  });
  document.querySelectorAll('[data-hook="more-button"]').forEach(button => button.addEventListener('click', () => {
    const article = button.closest('article,[data-hook="post-list-item"]');
    const link = article?.querySelector('a[href*="post/"]')?.href || location.href;
    copyLink(link);
  }));
  document.querySelectorAll('button[aria-label="Like post"],[data-hook="comment-box-placeholder"]').forEach(button => button.addEventListener('click', () => announce('Comments and likes are not connected on this copy yet.')));
  document.querySelectorAll('[data-hook="image-expand-button"]').forEach(button => button.addEventListener('click', () => {
    const image = button.parentElement.querySelector('img') || button.closest('[data-hook]')?.querySelector('img');
    if (!image) return;
    const dialog = document.createElement('dialog'); dialog.className = 'portable-image-dialog';
    const expanded = image.cloneNode(); expanded.removeAttribute('style');
    const close = document.createElement('button'); close.textContent = 'Close'; close.setAttribute('aria-label', 'Close image');
    close.addEventListener('click', () => { dialog.close(); dialog.remove(); });
    dialog.addEventListener('click', e => { if (e.target === dialog) { dialog.close(); dialog.remove(); } });
    dialog.addEventListener('cancel', () => dialog.remove());
    dialog.append(close, expanded); document.body.append(dialog); dialog.showModal();
  }));

  document.querySelectorAll('.portable-product-gallery').forEach(gallery => {
    const rail = gallery.querySelector('.portable-product-rail');
    const previous = gallery.querySelector('[data-hook="nav-arrow-prev"]');
    const next = gallery.querySelector('[data-hook="nav-arrow-next"]');
    const move = direction => rail.scrollBy({left:direction * (rail.querySelector('a').getBoundingClientRect().width + 20),behavior:motionEnabled?'smooth':'instant'});
    const update = () => { previous.disabled = rail.scrollLeft <= 1; next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2; };
    previous.addEventListener('click', () => move(-1)); next.addEventListener('click', () => move(1));
    rail.addEventListener('scroll', update, {passive:true});
    rail.addEventListener('keydown', e => { if (e.target === rail && ['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); move(e.key==='ArrowRight'?1:-1); } });
    new ResizeObserver(update).observe(rail); update();
  });

  const entranceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entranceObserver.unobserve(entry.target);
      if (entry.boundingClientRect.height < 950) animate(entry.target,
        [{opacity:.15,translate:'0 24px'},{opacity:1,translate:'0 0'}],
        {duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
    });
  }, {threshold:.1});
  document.querySelectorAll('main .wixui-rich-text,main .portable-product-card,main .sl-card,main .sl-career').forEach(element => entranceObserver.observe(element));

  const animatedImages = [...document.images].filter(img => /\.gif(?:$|\?)/i.test(img.src)).map(img => ({
    img, original:img.getAttribute('src'),
    sources:[...img.closest('picture')?.querySelectorAll('source') || []].map(source => ({source,original:source.getAttribute('srcset')}))
  }));
  const still = value => value.replace(/[^/\s,]+\.gif/g, filename => window.STREAMLAB_MOTION_ASSETS?.[filename] || filename);
  const motionButtons = [...document.querySelectorAll('.portable-menu-links')].map(nav => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'portable-motion-toggle';
    button.addEventListener('click', () => { motionEnabled = !motionEnabled; applyMotion(); });
    nav.append(button); return button;
  });
  function applyMotion() {
    document.body.dataset.motion = motionEnabled ? 'on' : 'off';
    motionButtons.forEach(button => {
      button.textContent = motionEnabled ? 'Pause motion' : 'Enable motion';
      button.setAttribute('aria-pressed', String(!motionEnabled));
    });
    if (!motionEnabled) runningAnimations.forEach(animation => animation.cancel());
    animatedImages.forEach(({img,original,sources}) => {
      img.setAttribute('src', motionEnabled ? original : still(original));
      sources.forEach(({source,original:value}) => source.setAttribute('srcset', motionEnabled ? value : still(value)));
    });
    updateVideos();
  }
  reducedMotion.addEventListener('change', () => { motionEnabled = !reducedMotion.matches; applyMotion(); });
  applyMotion();

  const progress = document.createElement('div'); progress.className = 'portable-scroll-progress'; progress.setAttribute('aria-hidden','true');
  const top = document.createElement('button'); top.type = 'button'; top.className = 'portable-back-top'; top.setAttribute('aria-label','Back to top'); top.textContent = '↑'; top.hidden = true;
  const floatingMenu = document.createElement('button'); floatingMenu.type = 'button'; floatingMenu.className = 'portable-floating-menu'; floatingMenu.setAttribute('aria-label','Open site menu'); floatingMenu.setAttribute('aria-haspopup','dialog'); floatingMenu.setAttribute('aria-expanded','false'); floatingMenu.textContent = '≡'; floatingMenu.hidden = true;
  floatingMenu.addEventListener('click', () => openMenu(floatingMenu));
  top.addEventListener('click', () => { window.scrollTo({top:0,behavior:motionEnabled?'smooth':'instant'}); document.querySelector('header a[href]')?.focus({preventScroll:true}); });
  document.body.append(progress,top,floatingMenu);
  let frame;
  function updateScroll() {
    cancelAnimationFrame(frame); frame = requestAnimationFrame(() => {
      const height = document.documentElement.scrollHeight - innerHeight;
      progress.style.scale = `${height > 0 ? Math.min(1,scrollY/height) : 0} 1`;
      top.hidden = scrollY < innerHeight;
      floatingMenu.hidden = !overlays.length || (document.querySelector('header')?.getBoundingClientRect().bottom || 0) > 0;
    });
  }
  addEventListener('scroll',updateScroll,{passive:true}); addEventListener('resize',updateScroll); updateScroll();
})();
