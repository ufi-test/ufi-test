const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
const header = document.querySelector('.site-header');
const desktop = window.matchMedia('(min-width: 56rem)');
function isOpen() {
  return toggle.getAttribute('aria-expanded') === 'true';
}
function closeMenu(returnFocus = false) {
  toggle.setAttribute('aria-expanded', 'false');
  navigation.hidden = !desktop.matches;
  if (returnFocus) toggle.focus();
}
function syncNavigation() {
  // Hide mobile links before removing them from normal flow.
  toggle.hidden = desktop.matches;
  closeMenu();
  header.classList.add('nav-enhanced');
}
toggle.addEventListener('click', () => {
  const expanded = isOpen();
  toggle.setAttribute('aria-expanded', String(!expanded));
  navigation.hidden = expanded;
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a') && !desktop.matches) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && isOpen()) {
    event.preventDefault();
    closeMenu(true);
  }
});
document.addEventListener('click', event => {
  if (!desktop.matches && isOpen() && !header.contains(event.target)) {
    closeMenu(navigation.contains(document.activeElement));
  }
});
document.addEventListener('focusin', event => {
  if (!desktop.matches && isOpen() && !header.contains(event.target)) closeMenu();
});
desktop.addEventListener('change', syncNavigation);
syncNavigation();
