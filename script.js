const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

function closeMenu({ returnFocus = false } = {}) {
  if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
  menuToggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const wasOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!wasOpen));
});

navigation.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || menuToggle.getAttribute('aria-expanded') !== 'true') return;
  const destination = document.querySelector(link.hash);
  closeMenu();
  destination.setAttribute('tabindex', '-1');
  destination.focus({ preventScroll: true });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.header-inner')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
    closeMenu({ returnFocus: true });
  }
});

matchMedia('(min-width: 701px)').addEventListener('change', () => closeMenu());

for (const card of document.querySelectorAll('.service-card')) {
  const dialog = document.getElementById(card.dataset.dialog);
  const closeButton = dialog.querySelector('.dialog-close');
  let pointerStartedOutside = false;

  card.addEventListener('click', () => {
    closeMenu();
    dialog.showModal();
    document.documentElement.classList.add('has-dialog');
  });

  closeButton.addEventListener('click', () => dialog.close());

  dialog.addEventListener('pointerdown', (event) => {
    pointerStartedOutside = event.target === dialog;
  });

  dialog.addEventListener('click', (event) => {
    if (pointerStartedOutside && event.target === dialog) dialog.close();
    pointerStartedOutside = false;
  });

  // The close button is the only focusable element in each service dialog.
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus();
    }
  });

  dialog.addEventListener('close', () => {
    pointerStartedOutside = false;
    document.documentElement.classList.remove('has-dialog');
    card.focus({ preventScroll: true });
  });
}

for (const button of document.querySelectorAll('.faq-toggle')) {
  const answer = document.getElementById(button.getAttribute('aria-controls'));

  button.addEventListener('click', () => {
    const isOpening = button.getAttribute('aria-expanded') === 'false';
    button.setAttribute('aria-expanded', String(isOpening));
    answer.inert = !isOpening;
  });
}
