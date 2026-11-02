const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
const mobile = window.matchMedia('(max-width: 48rem)');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  navigation.hidden = mobile.matches;
}
function syncNavigation() {
  toggle.hidden = !mobile.matches;
  closeMenu();
}
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  navigation.hidden = expanded;
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a') && mobile.matches) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
mobile.addEventListener('change', syncNavigation);
syncNavigation();
