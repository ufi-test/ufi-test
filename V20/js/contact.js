/* Keep native HTML POST, but return to this deployed version after success. */
(() => {
  const redirect = document.querySelector('.contact-form input[name="redirect"]');
  if (!redirect || window.location.protocol !== 'https:') return;
  redirect.value = new URL('thanks.html', window.location.href).href;
})();
