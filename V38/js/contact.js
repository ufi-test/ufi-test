(() => {
  const redirect = document.querySelector('.contact-form input[name="redirect"]');
  if (redirect && window.location.protocol === 'https:') {
    redirect.value = new URL('thanks.html', window.location.href).href;
  }

  const layout = document.querySelector('.contact-layout');
  const researchCopy = document.getElementById('research-copy');
  const participantCopy = document.getElementById('participant-copy');
  const formHeading = document.getElementById('form-heading');
  const formNote = document.getElementById('form-note');
  const subjectLabel = document.getElementById('subject-label');
  const enquiryType = document.getElementById('enquiry-type');

  function showAudience(participant) {
    researchCopy.hidden = participant;
    participantCopy.hidden = !participant;
    layout.setAttribute('aria-labelledby', participant ? 'participant-heading' : 'contact-heading');
    formHeading.textContent = participant ? 'Contact the Playtest Team' : 'Send Us a Message';
    formNote.textContent = participant
      ? 'All fields are required. If your question is about a study, include its name or session date if you know it.'
      : 'All fields are required.';
    subjectLabel.textContent = participant ? 'What is your question about?' : 'Subject';
    enquiryType.value = participant ? 'Participant enquiry' : 'Research enquiry';
  }

  showAudience(window.location.hash === '#participants');
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    // In-page anchors such as the skip link keep the current audience.
    if (hash === '#participants' || hash === '#research' || hash === '') {
      showAudience(hash === '#participants');
    }
  });
})();
