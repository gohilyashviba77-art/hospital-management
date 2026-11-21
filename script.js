const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  navigation.classList.toggle('is-open', !isExpanded);
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
document.querySelector('#patient-dob').max = localToday;
document.querySelector('#appointment-date').min = localToday;
document.querySelector('#current-year').textContent = today.getFullYear();

function saveSubmission(storageKey, form, statusElement, successMessage) {
  statusElement.classList.remove('error');

  if (!form.reportValidity()) {
    return;
  }

  const submission = Object.fromEntries(new FormData(form).entries());
  submission.submittedAt = new Date().toISOString();

  try {
    const savedSubmissions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(savedSubmissions)) {
      throw new Error('Stored form data has an unexpected format.');
    }

    savedSubmissions.push(submission);
    localStorage.setItem(storageKey, JSON.stringify(savedSubmissions));
    statusElement.textContent = successMessage;
    form.reset();
  } catch (error) {
    console.error('Unable to save form submission in LocalStorage:', error);
    statusElement.textContent = 'We could not save your information in this browser. Please check your browser storage settings and try again.';
    statusElement.classList.add('error');
  }
}

document.querySelector('#patient-form').addEventListener('submit', (event) => {
  event.preventDefault();
  saveSubmission(
    'northstarPatients',
    event.currentTarget,
    document.querySelector('#patient-status'),
    'Registration saved in this browser. Thank you!'
  );
});

document.querySelector('#appointment-form').addEventListener('submit', (event) => {
  event.preventDefault();
  saveSubmission(
    'northstarAppointments',
    event.currentTarget,
    document.querySelector('#appointment-status'),
    'Appointment request saved in this browser. This demo does not confirm a real booking.'
  );
});
