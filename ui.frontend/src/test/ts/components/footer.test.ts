import { Footer } from '@components/footer/footer';

describe('Footer Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('data-footer-component', 'test');
    container.innerHTML = `
      <footer class="hiero-ecom-footer">
        <div class="hiero-ecom-footer__container">
          <div class="hiero-ecom-footer__content">
            <div class="hiero-ecom-footer__group" data-footer-group data-footer-group-open="false">
              <button data-footer-group-toggle aria-label="Toggle group">Products</button>
              <div class="hiero-ecom-footer__group-items">
                <a href="#" class="hiero-ecom-footer__link">Category 1</a>
                <a href="#" class="hiero-ecom-footer__link">Category 2</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should initialize without errors', () => {
    expect(() => {
      new Footer({ rootSelector: '[data-footer-component="test"]' });
    }).not.toThrow();
  });

  test('should toggle group on button click', () => {
    const footer = new Footer({ rootSelector: '[data-footer-component="test"]' });
    const toggle = container.querySelector('[data-footer-group-toggle]') as HTMLElement;
    const group = container.querySelector('[data-footer-group]') as HTMLElement;
    
    toggle.click();
    expect(group.getAttribute('data-footer-group-open')).toBe('true');
    
    toggle.click();
    expect(group.getAttribute('data-footer-group-open')).toBe('false');
  });

  test('should have accessible group toggle button', () => {
    const toggle = container.querySelector('[data-footer-group-toggle]') as HTMLElement;
    expect(toggle).toHaveAttribute('aria-label');
  });

  test('should set aria-labels on footer links', () => {
    const footer = new Footer({ rootSelector: '[data-footer-component="test"]' });
    const links = container.querySelectorAll('.hiero-ecom-footer__link');
    
    links.forEach((link) => {
      expect(link).toHaveAttribute('aria-label');
    });
  });
});