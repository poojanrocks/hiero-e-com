import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Footer } from '../footer';

describe('Footer Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('data-component', 'footer');
    container.innerHTML = `
      <div data-accordion-section>
        <button data-accordion-header>About Us</button>
        <div data-accordion-content>
          <p>About content</p>
        </div>
      </div>
      <div data-accordion-section>
        <button data-accordion-header>Support</button>
        <div data-accordion-content>
          <p>Support content</p>
        </div>
      </div>
      <nav>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </nav>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should initialize footer component', () => {
    const footer = new Footer();
    expect(footer).toBeDefined();
  });

  it('should set contentinfo role on footer element', () => {
    const footer = new Footer();
    expect(container.getAttribute('role')).toBe('contentinfo');
  });

  it('should set button roles on accordion headers', () => {
    const footer = new Footer();
    const headers = container.querySelectorAll('[data-accordion-header]');

    headers.forEach(header => {
      expect(header.getAttribute('role')).toBe('button');
      expect(header.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('should toggle accordion section on header click', () => {
    const footer = new Footer();
    const firstSection = container.querySelector('[data-accordion-section]');
    const header = firstSection?.querySelector('[data-accordion-header]');

    header?.dispatchEvent(new MouseEvent('click'));
    expect(firstSection?.classList.contains('open')).toBe(true);
    expect(header?.getAttribute('aria-expanded')).toBe('true');

    header?.dispatchEvent(new MouseEvent('click'));
    expect(firstSection?.classList.contains('open')).toBe(false);
    expect(header?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle accordion on Enter key', () => {
    const footer = new Footer();
    const firstSection = container.querySelector('[data-accordion-section]');
    const header = firstSection?.querySelector('[data-accordion-header]');

    header?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(firstSection?.classList.contains('open')).toBe(true);
  });

  it('should toggle accordion on Space key', () => {
    const footer = new Footer();
    const firstSection = container.querySelector('[data-accordion-section]');
    const header = firstSection?.querySelector('[data-accordion-header]');

    header?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(firstSection?.classList.contains('open')).toBe(true);
  });

  it('should set button role on links without href', () => {
    const footerEl = document.createElement('div');
    footerEl.setAttribute('data-component', 'footer');
    footerEl.innerHTML = `<a>Button Link</a>`;
    document.body.appendChild(footerEl);

    const footer = new Footer({ selector: footerEl });
    const link = footerEl.querySelector('a');

    expect(link?.getAttribute('role')).toBe('button');
    expect(link?.getAttribute('tabindex')).toBe('0');

    document.body.removeChild(footerEl);
  });

  it('should destroy component', () => {
    const footer = new Footer();
    footer.destroy();
    expect(footer).toBeDefined();
  });
});
