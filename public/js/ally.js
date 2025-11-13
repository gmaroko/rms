document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main');

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    });
  }
});