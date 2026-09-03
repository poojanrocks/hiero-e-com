// Global UI components and utilities
export { Header } from './components/header';
export { Footer } from './components/footer';

// Initialize components on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const headerElements = document.querySelectorAll('.header');
  const footerElements = document.querySelectorAll('.footer');

  headerElements.forEach(element => {
    if (window.Header) {
      new window.Header(element as HTMLElement);
    }
  });

  footerElements.forEach(element => {
    if (window.Footer) {
      new window.Footer(element as HTMLElement);
    }
  });
});
