const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
const header = document.querySelector('.site-header');
function isWideNavigation() {
  const textSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return window.innerWidth >= 56 * textSize;
}
function isOpen() {
  return toggle.getAttribute('aria-expanded') === 'true';
}
function notifyNavigation() {
  document.dispatchEvent(new CustomEvent('ufi:navigationchange'));
}
function closeMenu(returnFocus = false) {
  toggle.setAttribute('aria-expanded', 'false');
  navigation.hidden = !header.classList.contains('nav-wide');
  if (returnFocus) toggle.focus();
  notifyNavigation();
}
function syncNavigation() {
  let wide = isWideNavigation();
  const active = document.activeElement;
  const hadFocus = navigation.contains(active);
  toggle.hidden = wide;
  header.classList.toggle('nav-wide', wide);
  navigation.hidden = !wide;
  const nav = header.querySelector('.nav');
  if (wide && nav && nav.scrollWidth > nav.clientWidth + 1) {
    wide = false;
    header.classList.remove('nav-wide');
  }
  toggle.hidden = wide;
  toggle.setAttribute('aria-expanded', 'false');
  navigation.hidden = !wide;
  header.classList.add('nav-enhanced');
  if (!wide && hadFocus) toggle.focus();
  else if (wide && active === toggle) navigation.querySelector('a')?.focus();
  notifyNavigation();
}
toggle.addEventListener('click', () => {
  const expanded = isOpen();
  toggle.setAttribute('aria-expanded', String(!expanded));
  navigation.hidden = expanded;
  notifyNavigation();
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a') && !header.classList.contains('nav-wide')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && isOpen()) {
    event.preventDefault();
    closeMenu(true);
  }
});
document.addEventListener('click', event => {
  if (!header.classList.contains('nav-wide') && isOpen() && !header.contains(event.target)) {
    closeMenu(navigation.contains(document.activeElement));
  }
});
document.addEventListener('focusin', () => {
  if (!header.classList.contains('nav-wide') && isOpen() && !header.contains(document.activeElement)) closeMenu();
});
document.addEventListener('ufi:open-preferences', () => closeMenu());
document.addEventListener('ufi:preferenceschange', syncNavigation);
window.addEventListener('resize', syncNavigation);
syncNavigation();
