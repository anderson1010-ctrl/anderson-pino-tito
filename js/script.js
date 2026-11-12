const body = document.body;
const toggleButton = document.getElementById('themeToggle');
const yearElement = document.getElementById('year');
const progressBar = document.getElementById('scrollProgress');
const navigationLinks = Array.from(document.querySelectorAll('.site-nav a'));
const pageSections = Array.from(document.querySelectorAll('main > header[id], main > section[id]'));

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function updateTheme(isLight) {
  body.classList.toggle('light-theme', isLight);
  if (toggleButton) {
    toggleButton.textContent = isLight ? 'Cambiar a oscuro' : 'Cambiar a claro';
    toggleButton.setAttribute('aria-pressed', String(isLight));
  }
}

if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  updateTheme(true);
} else {
  updateTheme(false);
}

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    updateTheme(!body.classList.contains('light-theme'));
  });
}

const revealElements = Array.from(document.querySelectorAll('.reveal'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  body.classList.add('motion-ready');
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

function updateScrollState() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage = scrollableHeight > 0
    ? (window.scrollY / scrollableHeight) * 100
    : 0;

  if (progressBar) {
    progressBar.style.width = `${scrollPercentage}%`;
  }

  let activeSectionId = pageSections[0]?.id;
  pageSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 180) {
      activeSectionId = section.id;
    }
  });

  navigationLinks.forEach((link) => {
    const isActive = link.hash === `#${activeSectionId}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState);
updateScrollState();

const galleryDialog = document.getElementById('galleryDialog');
const galleryImages = Array.from(document.querySelectorAll('.gallery img'));
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
let activePhotoIndex = 0;

function showPhoto(index) {
  activePhotoIndex = (index + galleryImages.length) % galleryImages.length;
  const selectedPhoto = galleryImages[activePhotoIndex];
  lightboxImage.src = selectedPhoto.currentSrc || selectedPhoto.src;
  lightboxImage.alt = selectedPhoto.alt;
  lightboxCaption.textContent = `Foto ${activePhotoIndex + 1} de ${galleryImages.length}`;
}

if (galleryDialog && galleryImages.length && typeof galleryDialog.showModal === 'function') {
  document.querySelectorAll('.gallery-item').forEach((button) => {
    button.addEventListener('click', () => {
      showPhoto(Number(button.dataset.galleryIndex));
      galleryDialog.showModal();
    });
  });

  document.getElementById('closeGallery').addEventListener('click', () => galleryDialog.close());
  document.getElementById('previousPhoto').addEventListener('click', () => {
    showPhoto(activePhotoIndex - 1);
  });
  document.getElementById('nextPhoto').addEventListener('click', () => {
    showPhoto(activePhotoIndex + 1);
  });

  galleryDialog.addEventListener('click', (event) => {
    if (event.target === galleryDialog) {
      galleryDialog.close();
    }
  });

  galleryDialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      showPhoto(activePhotoIndex - 1);
    } else if (event.key === 'ArrowRight') {
      showPhoto(activePhotoIndex + 1);
    }
  });
}
