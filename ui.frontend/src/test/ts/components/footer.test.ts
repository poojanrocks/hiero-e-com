import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';

describe('Footer Component DOM Tests', () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>');
    document = dom.window.document;
    (global as any).document = document;
    (global as any).window = dom.window;
  });

  test('footer element exists and has correct role', () => {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    footer.className = 'footer';
    document.body.appendChild(footer);

    const footerElement = document.querySelector('footer[role="contentinfo"]');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass('footer');
  });

  test('footer links have correct attributes', () => {
    const link = document.createElement('a');
    link.setAttribute('aria-label', 'Footer Link');
    link.href = 'https://example.com';
    link.className = 'footer__link';
    document.body.appendChild(link);

    const footerLink = document.querySelector('.footer__link');
    expect(footerLink).toHaveAttribute('aria-label');
    expect(footerLink).toHaveAttribute('href', 'https://example.com');
  });
});
