/* Shared reading/display preferences. Restore in <head>; create controls after DOM ready. */
(() => {
  'use strict';
  const storageKey = 'ufi.reading-display.v1';
  const defaults = { textSize: 'standard', appearance: 'system', contrast: 'standard', wordSpacing: 'standard', lineSpacing: 'standard' };
  const allowed = {
    textSize: ['standard', 'larger', 'largest'], appearance: ['system', 'light', 'dark'],
    contrast: ['standard', 'increased'], wordSpacing: ['standard', 'wider'], lineSpacing: ['standard', 'roomier']
  };
  const root = document.documentElement;
  const darkTheme = document.querySelector('#dark-theme');
  const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let canSave = true;
  function validate(value) {
    const result = { ...defaults };
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const key of Object.keys(defaults)) if (allowed[key].includes(value[key])) result[key] = value[key];
    }
    return result;
  }
  function readSaved() {
    try { return validate(JSON.parse(window.localStorage.getItem(storageKey))); }
    catch (error) {
      // Corrupt saved data falls back to defaults; blocked storage must not prevent current-page changes.
      if (!(error instanceof SyntaxError)) canSave = false;
      return { ...defaults };
    }
  }
  let state = readSaved();
  function apply() {
    const theme = state.appearance === 'system' ? (deviceTheme.matches ? 'dark' : 'light') : state.appearance;
    root.dataset.theme = theme;
    root.dataset.textSize = state.textSize;
    root.dataset.contrast = state.contrast;
    root.dataset.wordSpacing = state.wordSpacing;
    root.dataset.lineSpacing = state.lineSpacing;
    if (darkTheme) darkTheme.media = theme === 'dark' ? 'all' : 'not all';
  }
  function announceChange() { document.dispatchEvent(new CustomEvent('ufi:preferenceschange')); }
  function save(reset = false) {
    try {
      if (reset) window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, JSON.stringify(state));
      canSave = true;
    } catch { canSave = false; }
  }
  apply();
  deviceTheme.addEventListener('change', () => {
    if (state.appearance === 'system') { apply(); announceChange(); }
  });

  function setup() {
    // A failed/unsupported optional dialog must not disable links, navigation, or the form.
    if (!window.HTMLDialogElement || typeof HTMLDialogElement.prototype.showModal !== 'function') return;
    const navigation = document.querySelector('#nav-links');
    if (!navigation) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'reading-preferences';
    dialog.className = 'preferences-dialog';
    dialog.setAttribute('aria-labelledby', 'preferences-title');
    dialog.innerHTML = `
      <div class="preferences-header">
        <h2 id="preferences-title" tabindex="-1">Reading &amp; display</h2>
        <button class="preferences-close" type="button" aria-label="Close reading and display settings" data-close-preferences>×</button>
      </div>
      <div class="preferences-content">
        <p class="preferences-intro">Adjust how this site looks. Changes apply immediately.</p>
        <div class="preferences-field"><label for="preference-text-size">Text size</label><div class="preferences-select"><select id="preference-text-size" name="textSize"><option value="standard">Standard</option><option value="larger">Larger (125%)</option><option value="largest">Largest (150%)</option></select></div></div>
        <div class="preferences-field"><label for="preference-appearance">Appearance</label><div class="preferences-select"><select id="preference-appearance" name="appearance"><option value="system">Use device setting</option><option value="light">Light</option><option value="dark">Dark</option></select></div></div>
        <div class="preferences-field"><label for="preference-contrast">Contrast</label><div class="preferences-select"><select id="preference-contrast" name="contrast"><option value="standard">Standard</option><option value="increased">Increased</option></select></div></div>
        <div class="preferences-field"><label for="preference-word-spacing">Word spacing</label><div class="preferences-select"><select id="preference-word-spacing" name="wordSpacing"><option value="standard">Standard</option><option value="wider">Wider</option></select></div></div>
        <div class="preferences-field"><label for="preference-line-spacing">Line spacing</label><div class="preferences-select"><select id="preference-line-spacing" name="lineSpacing"><option value="standard">Standard</option><option value="roomier">Roomier</option></select></div></div>
        <p class="preferences-storage"></p>
        <p class="preferences-status" role="status" aria-live="polite" aria-atomic="true"></p>
      </div>
      <div class="preferences-actions"><button class="button button-secondary" type="button" aria-label="Reset all preferences" data-reset-preferences>Reset all</button><button class="button" type="button" data-close-preferences>Done</button></div>`;
    document.body.append(dialog);
    const controls = Array.from(dialog.querySelectorAll('select'));
    const storageNote = dialog.querySelector('.preferences-storage');
    const status = dialog.querySelector('.preferences-status');
    function refreshControls() {
      for (const control of controls) control.value = state[control.name];
      storageNote.textContent = canSave ? 'Preferences are saved in this browser.' : 'Preferences apply now, but this browser is not allowing them to be saved.';
    }
    refreshControls();
    dialog.addEventListener('change', event => {
      const control = event.target;
      if (!controls.includes(control) || !allowed[control.name].includes(control.value)) return;
      state = { ...state, [control.name]: control.value };
      apply(); save(); refreshControls(); announceChange();
      status.textContent = ''; // Native selects already announce their selected value.
    });
    dialog.querySelector('[data-reset-preferences]').addEventListener('click', () => {
      state = { ...defaults };
      apply(); save(true); refreshControls(); announceChange();
      status.textContent = 'Preferences reset to defaults.';
    });
    for (const button of dialog.querySelectorAll('[data-close-preferences]')) button.addEventListener('click', () => dialog.close());
    let opener = null;
    const item = document.createElement('li');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'preferences-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    const icon = `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="6.5" r="1.5" fill="currentColor"/><path d="M7 10h10M12 9v5m0 0-3 4m3-4 3 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    trigger.innerHTML = `${icon}<span>Accessibility</span>`;
    const floating = document.createElement('button');
    floating.type = 'button';
    floating.className = 'preferences-floating';
    floating.hidden = true;
    floating.setAttribute('aria-label', 'Accessibility settings');
    floating.title = 'Accessibility settings';
    floating.setAttribute('aria-haspopup', 'dialog');
    floating.setAttribute('aria-controls', dialog.id);
    floating.innerHTML = icon;
    function updateShortcut() {
      const wide = document.querySelector('.site-header').classList.contains('nav-wide');
      const menuOpen = document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true';
      const visible = !wide && !menuOpen && !dialog.open;
      const hadFocus = document.activeElement === floating;
      root.dataset.preferencesLayout = wide ? 'wide' : 'compact';
      floating.hidden = !visible;
      if (hadFocus && !visible && !dialog.open) {
        (wide ? trigger : document.querySelector('.menu-toggle')).focus({ preventScroll: true });
      }
    }
    function openPreferences(source) {
      opener = source;
      refreshControls(); status.textContent = '';
      document.dispatchEvent(new CustomEvent('ufi:open-preferences'));
      dialog.showModal();
      document.body.classList.add('preferences-open');
      updateShortcut();
      dialog.querySelector('#preferences-title').focus({ preventScroll: true });
    }
    trigger.addEventListener('click', () => openPreferences(trigger));
    floating.addEventListener('click', () => openPreferences(floating));
    dialog.addEventListener('close', () => {
      document.body.classList.remove('preferences-open');
      updateShortcut();
      const target = opener && opener.getClientRects().length ? opener : trigger.getClientRects().length ? trigger : document.querySelector('.menu-toggle:not([hidden])') || document.querySelector('.brand');
      target?.focus({ preventScroll: true });
    });
    // Require a pointer press AND click outside the panel, so dragging out of a control does not dismiss it.
    let pressedBackdrop = false;
    function outsidePanel(event) {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    }
    dialog.addEventListener('pointerdown', event => {
      pressedBackdrop = event.target === dialog && outsidePanel(event);
    });
    dialog.addEventListener('pointercancel', () => { pressedBackdrop = false; });
    dialog.addEventListener('click', event => {
      if (pressedBackdrop && event.target === dialog && outsidePanel(event)) dialog.close();
      pressedBackdrop = false;
    });
    item.append(trigger); navigation.append(item);
    document.body.append(floating);
    document.addEventListener('ufi:navigationchange', updateShortcut);
    announceChange();
    updateShortcut();
    window.addEventListener('storage', event => {
      if (event.key === storageKey || event.key === null) {
        state = readSaved(); apply(); refreshControls(); announceChange();
        status.textContent = 'Preferences updated from another page.';
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
})();
