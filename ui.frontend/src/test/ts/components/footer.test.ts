import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Footer } from '../../../main/ts/components/footer';

describe('Footer Component', () => {
  let container: HTMLElement;
  let footer: Footer;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <footer class="footer">
        <div class="footer__container">
          <div class="footer__content">
            <div class="footer__section footer__accordion" data-footer-accordion data-open="true">
              <button class="footer__accordion-trigger" data-accordion-trigger aria-expanded="true">
                <span>About Us</span>
                <span class="footer__accordion-icon">▼</span>
              </button>
              <div class="footer__accordion-content">
                <ul class="footer__link-list">
                  <li><a href="#" class="footer__link">Company Info</a></li>
                  <li><a href="#" class="footer__link">Careers</a></li>
                  <li><a href="#" class="footer__link">Press</a></li>
                </ul>
              </div>
            </div>

            <div class="footer__section footer__accordion" data-footer-accordion data-open="true">
              <button class="footer__accordion-trigger" data-accordion-trigger aria-expanded="true">
                <span>Support</span>
                <span class="footer__accordion-icon">▼</span>
              </button>
              <div class="footer__accordion-content">
                <ul class="footer__link-list">
                  <li><a href="#" class="footer__link">Help Center</a></li>
                  <li><a href="#" class="footer__link">Contact Us</a></li>
                  <li><a href="#" class="footer__link">FAQ</a></li>
                </ul>
              </div>
            </div>

            <div class="footer__section footer__accordion" data-footer-accordion data-open="true">
              <button class="footer__accordion-trigger" data-accordion-trigger aria-expanded="true">
                <span>Legal</span>
                <span class="footer__accordion-icon">▼</span>
              </button>
              <div class="footer__accordion-content">
                <ul class="footer__link-list">
                  <li><a href="#" class="footer__link">Privacy Policy</a></li>
                  <li><a href="#" class="footer__link">Terms of Service</a></li>
                  <li><a href="#" class="footer__link">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div class="footer__section footer__newsletter">
              <h3 class="footer__section-title">Newsletter</h3>
              <form class="footer__newsletter-form" data-newsletter-form>
                <input
                  type="email"
                  name="email"
                  class="footer__newsletter-input"
                  placeholder="Your email"
                  required
                />
                <button type="submit" class="footer__newsletter-button">Subscribe</button>
              </form>
            </div>
          </div>

          <div class="footer__bottom">
            <p class="footer__copyright">&copy; 2024 Hiero eCommerce. All rights reserved.</p>
            <div class="footer__social-links">
              <a href="#" class="footer__social-link" aria-label="Facebook">f</a>
              <a href="#" class="footer__social-link" aria-label="Twitter">𝕏</a>
              <a href="#" class="footer__social-link" aria-label="Instagram">📷</a>
            </div>
          </div>
        </div>
      </footer>
    `;
    document.body.appendChild(container);
    footer = new Footer(container.querySelector('footer') as HTMLElement);
  });

  afterEach(() => {
    footer.destroy();
    container.remove();
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(footer).toBeDefined();
    });

    it('should find accordion elements', () => {
      const accordions = container.querySelectorAll('[data-footer-accordion]');
      expect(accordions.length).toBeGreaterThan(0);
    });
  });

  describe('Accordions', () => {
    it('should toggle accordion on button click', () => {
      const accordion = container.querySelector('[data-footer-accordion]') as HTMLElement;
      const trigger = accordion.querySelector('[data-accordion-trigger]') as HTMLButtonElement;

      const initialOpen = accordion.getAttribute('data-open') === 'true';
      trigger.click();
      const newOpen = accordion.getAttribute('data-open') === 'true';

      expect(newOpen).toBe(!initialOpen);
    });

    it('should update aria-expanded attribute', () => {
      const accordion = container.querySelector('[data-footer-accordion]') as HTMLElement;
      const trigger = accordion.querySelector('[data-accordion-trigger]') as HTMLButtonElement;

      trigger.click();
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      expect(accordion.getAttribute('data-open')).toBe(String(isExpanded));
    });
  });

  describe('Newsletter Form', () => {
    it('should have newsletter form', () => {
      const form = container.querySelector('[data-newsletter-form]');
      expect(form).toBeDefined();
    });

    it('should validate email format', () => {
      const form = container.querySelector('[data-newsletter-form]') as HTMLFormElement;
      const input = form.querySelector('input[type="email"]') as HTMLInputElement;

      input.value = 'invalid-email';
      form.dispatchEvent(new Event('submit'));

      const message = container.querySelector('[data-message-type]');
      expect(message?.getAttribute('data-message-type')).toBe('error');
    });

    it('should accept valid email', () => {
      const form = container.querySelector('[data-newsletter-form]') as HTMLFormElement;
      const input = form.querySelector('input[type="email"]') as HTMLInputElement;

      input.value = 'test@example.com';
      form.dispatchEvent(new Event('submit'));

      const message = container.querySelector('[data-message-type]');
      expect(message?.getAttribute('data-message-type')).toBe('success');
    });

    it('should reset form after successful submission', () => {
      const form = container.querySelector('[data-newsletter-form]') as HTMLFormElement;
      const input = form.querySelector('input[type="email"]') as HTMLInputElement;

      input.value = 'test@example.com';
      form.dispatchEvent(new Event('submit'));

      expect(input.value).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-expanded on accordion triggers', () => {
      const triggers = container.querySelectorAll('[data-accordion-trigger]');
      triggers.forEach(trigger => {
        expect(trigger.hasAttribute('aria-expanded')).toBe(true);
      });
    });

    it('should have aria-label on social links', () => {
      const socialLinks = container.querySelectorAll('.footer__social-link');
      socialLinks.forEach(link => {
        expect(link.hasAttribute('aria-label')).toBe(true);
      });
    });
  });
});
