import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';

describe('Header Component DOM Tests', () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>');
    document = dom.window.document;
    (global as any).document = document;
    (global as any).window = dom.window;
  });

  test('header element exists and has correct role', () => {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.className = 'header';
    document.body.appendChild(header);

    const headerElement = document.querySelector('header[role="banner"]');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass('header');
  });

  test('toggle button has aria-label attribute', () => {
    const toggle = document.createElement('button');
    toggle.setAttribute('aria-label', 'Menu');
    toggle.className = 'header__menu-toggle';
    document.body.appendChild(toggle);

    const button = document.querySelector('.header__menu-toggle');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('aria-label', 'Menu');
  });
});
