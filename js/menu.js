document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.site-menu');
  if (!menu) return;

  const toggle = menu.querySelector('.menu-toggle');
  const backdrop = menu.querySelector('.menu-backdrop');
  const links = menu.querySelectorAll('.menu-list a');

  const STORAGE_KEY = 'birthdaySiteMenuOpen';

  function setMenuState(isOpen) {
    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    sessionStorage.setItem(STORAGE_KEY, isOpen ? 'true' : 'false');
  }

  function openMenu() {
    setMenuState(true);
  }

  function closeMenu() {
    setMenuState(false);
  }

  function toggleMenu() {
    const isOpen = menu.classList.contains('is-open');
    setMenuState(!isOpen);
  }

  // restore state when page loads
  const shouldBeOpen = sessionStorage.getItem(STORAGE_KEY) === 'true';
  setMenuState(shouldBeOpen);

  // hamburger <-> X
  toggle.addEventListener('click', toggleMenu);

  // keep it open when navigating to another page
  links.forEach((link) => {
    link.addEventListener('click', () => {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    });
  });

  // do NOT close from backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  // do NOT close with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
    }
  });

  // active page highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
});
