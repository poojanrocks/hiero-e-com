import { describe, it, expect, beforeEach } from 'vitest';
import Footer from '../js/footer';

describe('Footer', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <footer data-component="footer" role="contentinfo">
        <div class="footer__container">
          <div class="footer__sections">
            <div class="footer__section">
              <button data-toggle="section" aria-controls="section-1" aria-expanded="true">
                Company
              </button>
              <div id="section-1" class="footer__section-content">
                <ul>
                  <li><a href="/about">About</a></li>
                  <li><a href="/careers">Careers</a></li>
                </ul>
              </div>
            </div>
            <div class="footer__section">
              <button data-toggle="section" aria-controls="section-2" aria-expanded="true">
                Support
              </button>
              <div id="section-2" class="footer__section-content">
                <ul>
                  <li><a href="/help">Help</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <p class="footer__copyright">© 2024 Hiero eCommerce</p>
          </div>
        </div>
      </footer>
    `;
  });

  it('should initialize footer component', () => {
    const footer = new Footer('[data-component="footer"]');
    expect(footer).toBeDefined();
  });

  it('should toggle section visibility', () => {
    new Footer('[data-component="footer"]');
    const button = document.querySelector('[data-toggle="section"]') as HTMLElement;
    const section = document.querySelector('#section-1') as HTMLElement;
    
    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(section.classList.contains('collapsed')).toBe(true);
    
    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(section.classList.contains('collapsed')).toBe(false);
  });

  it('should have proper accessibility attributes', () => {
    new Footer('[data-component="footer"]');
    const footer = document.querySelector('[data-component="footer"]');
    expect(footer?.getAttribute('role')).toBe('contentinfo');
  });
});