(() => {
  'use strict';
  const root = document.documentElement;
  const motionAllowed = () => !root.classList.contains('motion-off');
  // Keep pointer effects subtle and preserve the native cursor.
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.pointer-surface').forEach(surface => {
      let scheduled = false, x = 0, y = 0;
      surface.addEventListener('pointermove', event => {
        if (!motionAllowed()) return;
        const rect = surface.getBoundingClientRect();
        x = event.clientX - rect.left; y = event.clientY - rect.top;
        if (!scheduled) { scheduled = true; requestAnimationFrame(() => {
          surface.style.setProperty('--mouse-x', `${x}px`);
          surface.style.setProperty('--mouse-y', `${y}px`);
          if (surface.classList.contains('hero-product')) surface.style.setProperty('--hero-rotate', `${(x / rect.width - .5) * 4}deg`);
          scheduled = false;
        }); }
      });
      surface.addEventListener('pointerleave', () => surface.style.setProperty('--hero-rotate', '0deg'));
    });
  }
  const heroImage = document.querySelector('[data-hero-screenshot]');
  const originalProducts = {
    live: ['product-live.png','Streamsphere / live production'],
    editor: ['product-editor.jpg','Streamlab Edit Pro'],
    analytics: ['product-analytics.jpg','Streamlab Analytics']
  };
  document.querySelectorAll('[data-hero-product]').forEach(button => button.addEventListener('click', () => {
    const [file, title] = originalProducts[button.dataset.heroProduct];
    const prefix = heroImage.getAttribute('src').split('assets/new/')[0];
    heroImage.src = `${prefix}assets/new/${file}`;
    heroImage.alt = `Original Streamlab website product visual: ${title}`;
    document.querySelector('[data-hero-product-title]').textContent = title;
    const opener = heroImage.closest('[data-image-view]');
    opener.dataset.imageView = heroImage.getAttribute('src'); opener.dataset.imageTitle = title;
    document.querySelectorAll('[data-hero-product]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  const dialog = document.querySelector('.image-dialog');
  if (dialog) {
    let returnFocus;
    document.querySelectorAll('[data-image-view]').forEach(button => button.addEventListener('click', () => {
      returnFocus = button;
      dialog.querySelector('[data-image-dialog-image]').src = button.dataset.imageView;
      dialog.querySelector('[data-image-dialog-image]').alt = `Original product visual: ${button.dataset.imageTitle}`;
      dialog.querySelector('[data-image-dialog-title]').textContent = button.dataset.imageTitle;
      dialog.showModal();
    }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => returnFocus?.focus());
  }
  function keyboardTabs(tabs, select) {
    tabs.forEach((button, index) => button.addEventListener('keydown', e => {
      let next;
      if (['ArrowRight','ArrowDown'].includes(e.key)) next = (index + 1) % tabs.length;
      else if (['ArrowLeft','ArrowUp'].includes(e.key)) next = (index - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else return;
      e.preventDefault(); select(tabs[next]); tabs[next].focus();
    }));
  }
  const demo = document.querySelector('.demo-shell');
  if (demo) {
    let running = false, previewSeconds = 0, editPlaying = false, editPosition = 0;
    const tabs = [...demo.querySelectorAll('[data-demo-tab]')];
    const tabSelect = selected => {
      tabs.forEach(button => { const on = button === selected; button.setAttribute('aria-selected',String(on)); button.tabIndex = on ? 0 : -1; document.getElementById(button.getAttribute('aria-controls')).hidden = !on; });
      if (selected.dataset.demoTab !== 'live') setPreview(false);
      if (selected.dataset.demoTab !== 'editor') setEditPlaying(false);
    };
    tabs.forEach(button => button.addEventListener('click', () => tabSelect(button)));
    keyboardTabs(tabs, tabSelect);
    const previewButton = demo.querySelector('[data-preview-toggle]');
    const clock = demo.querySelector('[data-preview-clock]');
    const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
    function setPreview(on) {
      running = on; previewButton.setAttribute('aria-pressed',String(on));
      previewButton.textContent = on ? '■ Stop preview' : '▶ Start preview';
      demo.querySelector('[data-preview-state]').textContent = on ? 'PREVIEW RUNNING' : 'PREVIEW PAUSED';
      demo.querySelector('[data-preview-state]').classList.toggle('is-running',on);
      demo.querySelector('.demo-screen').classList.toggle('is-running',on);
    }
    previewButton.addEventListener('click', () => setPreview(!running));
    const sceneTitles = { coast: 'A different perspective', production: 'Behind every broadcast', title: 'Your opening title' };
    demo.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => {
      const scene = button.dataset.scene;
      demo.querySelectorAll('[data-scene]').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
      const screen = demo.querySelector('.demo-screen'); screen.dataset.currentScene = scene;
      const frame = demo.querySelector('.demo-frame');
      demo.querySelector('.demo-titlecard').hidden = scene !== 'title';
      if (scene !== 'title') { frame.src = scene === 'production' ? frame.dataset.production : frame.dataset.coast; frame.alt = scene === 'production' ? 'Illustrative production scene' : 'Sample coastal documentary frame'; }
      demo.querySelector('[data-scene-label]').textContent = sceneTitles[scene];
    }));
    const overlay = demo.querySelector('[data-overlay]');
    overlay.addEventListener('click', () => {
      const on = overlay.getAttribute('aria-pressed') !== 'true';
      overlay.setAttribute('aria-pressed',String(on)); overlay.textContent = on ? 'Hide title overlay' : 'Show title overlay';
      demo.querySelector('.demo-lower-third').hidden = !on;
    });
    const volume = demo.querySelector('[data-volume]');
    volume.addEventListener('input', () => {
      demo.querySelector('[data-volume-output]').textContent = `${volume.value}%`;
      demo.querySelectorAll('.level-meter:not(.microphone) i').forEach((bar,index) => bar.style.opacity = index < Math.round(Number(volume.value) / 100 * 8) ? '1' : '.12');
    });
    const mute = demo.querySelector('[data-mute]');
    mute.addEventListener('click', () => {
      const muted = mute.getAttribute('aria-pressed') !== 'true'; mute.setAttribute('aria-pressed',String(muted)); mute.textContent = muted ? 'Unmute sample mic' : 'Mute sample mic'; demo.querySelector('.microphone').classList.toggle('muted',muted);
    });
    const scrubber = demo.querySelector('[data-scrubber]');
    const editFrame = demo.querySelector('[data-editor-frame]');
    const play = demo.querySelector('[data-edit-play]');
    function setEditPlaying(on) { editPlaying = on; play.setAttribute('aria-pressed',String(on)); play.setAttribute('aria-label',on ? 'Pause timeline preview' : 'Play timeline preview'); play.textContent = on ? 'Ⅱ' : '▶'; }
    function setPosition(value) {
      editPosition = Math.max(0,Math.min(48,Number(value))); scrubber.value = String(editPosition);
      const scene = editPosition < 24 ? 'coast' : 'production';
      const next = editFrame.dataset[scene]; if (editFrame.getAttribute('src') !== next) editFrame.src = next;
      demo.querySelector('[data-edit-time]').textContent = `${formatTime(editPosition)} / 00:48`;
      const timeline = demo.querySelector('.timeline');
      timeline.style.setProperty('--playhead', `${Math.max(0,timeline.clientWidth - 27) * editPosition / 48}px`);
      demo.querySelectorAll('[data-clip]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.clip === scene)));
    }
    scrubber.addEventListener('input', () => setPosition(scrubber.value));
    demo.querySelectorAll('[data-clip]').forEach(button => button.addEventListener('click', () => setPosition(button.dataset.clip === 'coast' ? 0 : 24)));
    play.addEventListener('click', () => { if (editPosition >= 48) setPosition(0); setEditPlaying(!editPlaying); });
    const title = demo.querySelector('[data-edit-title]');
    const titlePreview = demo.querySelector('[data-editor-title]');
    title.addEventListener('input', () => titlePreview.textContent = title.value);
    const colors = { mint:'#c7ffed', peach:'#ffd2bd', white:'#ffffff' };
    const colorSelect = demo.querySelector('[data-edit-color]');
    colorSelect.addEventListener('change', () => titlePreview.style.color = colors[colorSelect.value]);
    demo.querySelector('[data-edit-reset]').addEventListener('click', () => { setEditPlaying(false); setPosition(0); title.value = 'Every story starts with a frame.'; titlePreview.textContent = title.value; colorSelect.value='mint'; titlePreview.style.color = colors.mint; });
    const datasets = {
      '7': { views:'12,480', watch:'08:24', peak:'384', bars:[1120,1640,1310,2320,1940,2890,1260] },
      '30': { views:'48,920', watch:'09:12', peak:'612', bars:[4700,6900,5420,8160,6740,9340,7660] }
    };
    let period = '7';
    const chartBars = [...demo.querySelectorAll('[data-chart-bar]')];
    function showBar(index) {
      const label = period === '7' ? `Day ${index+1}` : `Group ${index+1}`;
      demo.querySelector('[data-chart-value]').textContent = `${label}: ${datasets[period].bars[index].toLocaleString('en-US')} sample views`;
    }
    function setPeriod(next) {
      period = next; const data = datasets[period];
      demo.querySelectorAll('[data-period]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.period === next)));
      ['views','watch','peak'].forEach(key => demo.querySelector(`[data-metric="${key}"]`).textContent = data[key]);
      const max = Math.max(...data.bars);
      chartBars.forEach((button,index) => { button.style.setProperty('--bar', `${data.bars[index] / max * 85}%`); const label = period === '7' ? `Day ${index+1}` : `Group ${index+1}`; button.setAttribute('aria-label', `${label}: ${data.bars[index]} sample views`); button.querySelector('small').textContent = period === '7' ? String(index+1) : ['1–4','5–8','9–12','13–16','17–20','21–25','26–30'][index]; });
      demo.querySelector('[data-chart-value]').textContent = 'Hover or focus a bar';
    }
    demo.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click', () => setPeriod(button.dataset.period)));
    chartBars.forEach((button,index) => { button.addEventListener('pointerenter', () => showBar(index)); button.addEventListener('focus', () => showBar(index)); button.addEventListener('click', () => showBar(index)); });
    setPeriod('7');
    setInterval(() => {
      if (document.hidden) return;
      if (running) { previewSeconds++; clock.textContent = formatTime(previewSeconds); }
      if (editPlaying) { setPosition(editPosition + 1); if (editPosition >= 48) setEditPlaying(false); }
    },1000);
    document.addEventListener('visibilitychange', () => { if (document.hidden) { setPreview(false); setEditPlaying(false); } });
    addEventListener('resize', () => setPosition(editPosition), {passive:true});
  }
  const workflow = document.querySelector('.workflow-section');
  if (workflow) {
    const stages = [
      ['01 / SET THE SCENE','Start with what you want to share.','Think through your cameras, media, aspect ratio, and visual identity. Our first conversation starts with your production requirements.'],
      ['02 / SHAPE THE STORY','Give every frame a purpose.','Plan your scenes, titles, graphics, and audio. Explore a sample scene switch or edit timeline in the interactive tour above.'],
      ['03 / PLAN YOUR DELIVERY','Design the path to your audience.','Discuss your preferred platforms, network conditions, and delivery requirements with the team. Confirm compatibility and your setup during a guided demonstration.'],
      ['04 / LEARN FROM THE AUDIENCE','Use insights to shape what comes next.','Review audience engagement and viewing patterns. The sample analytics tour illustrates the questions a reporting workflow can help you explore.']
    ];
    const tabs = [...workflow.querySelectorAll('[data-workflow-step]')];
    const selectStage = selected => {
      tabs.forEach(button => { const on = button === selected; button.setAttribute('aria-selected',String(on)); button.tabIndex = on ? 0 : -1; });
      const [kicker,title,copy] = stages[Number(selected.dataset.workflowStep)];
      workflow.querySelector('[data-workflow-kicker]').textContent = kicker;
      workflow.querySelector('[data-workflow-title]').textContent = title;
      workflow.querySelector('[data-workflow-copy]').textContent = copy;
      workflow.querySelector('[role=tabpanel]').setAttribute('aria-labelledby',selected.id);
    };
    tabs.forEach(button => button.addEventListener('click', () => selectStage(button)));
    keyboardTabs(tabs,selectStage);
    let pending = false;
    const update = () => { const rect = workflow.getBoundingClientRect(); workflow.style.setProperty('--chapter-progress', String(Math.max(0,Math.min(1,(innerHeight - rect.top)/(innerHeight + rect.height))))); pending = false; };
    addEventListener('scroll', () => { if (!pending && motionAllowed()) { pending = true; requestAnimationFrame(update); } }, {passive:true});
    update();
  }
})();
