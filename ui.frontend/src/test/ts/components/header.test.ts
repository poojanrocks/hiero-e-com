import { Header } from '@components/header/header';

describe('Header Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('data-header-component', 'test');
    container.innerHTML = `
      <header class="hiero-ecom-header">
        <div class="hiero-ecom-header__container">
          <a href="/" class="hiero-ecom-header__logo">Logo</a>
          <button data-header-menu-toggle aria-label="Toggle menu">Menu</button>
          <div class="hiero-ecom-header__mobile-menu" data-mobile-menu-open="false">
            <button data-header-menu-close aria-label="Close menu">Close</button>
          </div>
        </div>
      </header>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should initialize without errors', () => {
    expect(() => {
      new Header({ rootSelector: '[data-header-component="test"]' });
    }).not.toThrow();
  });

  test('should toggle mobile menu on button click', () => {
    const header = new Header({ rootSelector: '[data-header-component="test"]' });
    const toggle = container.querySelector('[data-header-menu-toggle]') as HTMLElement;
    
    toggle.click();
    const headerEl = container.querySelector('[data-header-component]') as HTMLElement;
    expect(headerEl.getAttribute('data-mobile-menu-open')).toBe('true');
  });

  test('should close menu on Escape key', () => {
    const header = new Header({ rootSelector: '[data-header-component="test"]' });
    const toggle = container.querySelector('[data-header-menu-toggle]') as HTMLElement;
    
    toggle.click();
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    
    const headerEl = container.querySelector('[data-header-component]') as HTMLElement;
    expect(headerEl.getAttribute('data-mobile-menu-open')).toBe('false');
  });

  test('should have accessible menu toggle button', () => {
    const toggle = container.querySelector('[data-header-menu-toggle]') as HTMLElement;
    expect(toggle).toHaveAttribute('aria-label');
  });
});