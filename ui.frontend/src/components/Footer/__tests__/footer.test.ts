import { Footer } from '../footer';
import { StateManager } from '../../../services/state-manager';

describe('Footer Component', () => {
  let container: HTMLElement;
  let footer: Footer;
  let stateManager: StateManager;

  beforeEach(() => {
    document.body.innerHTML = `
      <footer id="footer" role="contentinfo">
        <div data-expandable-section>
          <button data-expandable-header aria-expanded="false">Section 1</button>
          <div data-expandable-content aria-hidden="true">
            <ul>
              <li><a href="#">Link 1</a></li>
            </ul>
          </div>
        </div>
        <form data-newsletter-form>
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </footer>
    `;

    stateManager = StateManager.getInstance();
    footer = new Footer('footer');
    footer.init();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Expandable Sections', () => {
    it('should toggle expandable section on click', () => {
      const header = document.querySelector('[data-expandable-header]') as HTMLElement;
      header.click();

      expect(header.getAttribute('aria-expanded')).toBe('true');
    });

    it('should toggle expandable section on Enter key', () => {
      const header = document.querySelector('[data-expandable-header]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      header.dispatchEvent(event);

      expect(header.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Newsletter Subscription', () => {
    it('should validate email format', () => {
      const form = document.querySelector('[data-newsletter-form]') as HTMLFormElement;
      const input = form.querySelector('input[type="email"]') as HTMLInputElement;

      input.value = 'invalid-email';
      form.dispatchEvent(new Event('submit'));

      // Notification should appear
      const notification = document.querySelector('.notification');
      expect(notification).toBeTruthy();
    });

    it('should accept valid email', () => {
      const form = document.querySelector('[data-newsletter-form]') as HTMLFormElement;
      const input = form.querySelector('input[type="email"]') as HTMLInputElement;

      input.value = 'test@example.com';
      form.dispatchEvent(new Event('submit'));

      // Form should be reset
      expect(input.value).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper footer role', () => {
      const footer = document.querySelector('#footer');
      expect(footer?.getAttribute('role')).toBe('contentinfo');
    });

    it('should have aria labels on expandable sections', () => {
      const header = document.querySelector('[data-expandable-header]');
      expect(header?.getAttribute('aria-expanded')).toBeDefined();
      expect(header?.getAttribute('role')).toBe('button');
    });
  });
});
