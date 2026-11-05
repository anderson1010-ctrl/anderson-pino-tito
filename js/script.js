const body = document.body;
const toggleButton = document.getElementById('themeToggle');
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    toggleButton.textContent = isLight ? 'Cambiar a oscuro' : 'Cambiar tema';
  });
}
