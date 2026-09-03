import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/dom';
import Footer from '../Footer';
import type { FooterConfig } from '../../../types';

describe('Footer Component', () => {
  let container: HTMLDivElement;
  let footer: Footer;
  const mockConfig: FooterConfig = {
    companyName: 'Hiero Test Co',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    socialLinks: [
      { icon: '📘', href: 'https://facebook.com', label: 'Facebook' },
      { icon: '𝕏', href: 'https://twitter.com', label: 'Twitter' },
    ],
    copyright: '© 2024 Test Corp',
  };

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-footer';
    document.body.appendChild(container);
    footer = new Footer('test-footer', mockConfig);
  });

  afterEach(() => {
    footer.destroy();
    document.body.removeChild(container);
  });

  it('should render footer with company name', () => {
    expect(screen.getByText('Hiero Test Co')).toBeTruthy();
  });

  it('should render quick links', () => {
    expect(screen.getByText('About')).toBeTruthy();
    expect(screen.getByText('Contact')).toBeTruthy();
  });

  it('should render social links', () => {
    const facebookLink = screen.getByLabelText('Facebook');
    const twitterLink = screen.getByLabelText('Twitter');
    expect(facebookLink).toBeTruthy();
    expect(twitterLink).toBeTruthy();
  });

  it('should render legal links', () => {
    expect(screen.getByText('Privacy Policy')).toBeTruthy();
    expect(screen.getByText('Terms of Service')).toBeTruthy();
    expect(screen.getByText('Cookie Settings')).toBeTruthy();
  });

  it('should render copyright text', () => {
    expect(screen.getByText('© 2024 Test Corp')).toBeTruthy();
  });

  it('should have proper ARIA labels', () => {
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeTruthy();
  });

  it('should render section headings', () => {
    expect(screen.getByText('Quick Links')).toBeTruthy();
    expect(screen.getByText('Follow Us')).toBeTruthy();
  });

  it('should have social links with aria-labels', () => {
    const socialLink = screen.getByLabelText('Facebook') as HTMLAnchorElement;
    expect(socialLink.getAttribute('aria-label')).toBe('Facebook');
  });

  it('should render default copyright when not provided', () => {
    const container2 = document.createElement('div');
    container2.id = 'test-footer-2';
    document.body.appendChild(container2);
    
    const footerNoConfig = new Footer('test-footer-2', {
      companyName: 'Test Company',
    });
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}.*Hiero eCommerce`))).toBeTruthy();
    
    footerNoConfig.destroy();
    document.body.removeChild(container2);
  });

  it('should render default company name when not provided', () => {
    const container2 = document.createElement('div');
    container2.id = 'test-footer-3';
    document.body.appendChild(container2);
    
    const footerNoName = new Footer('test-footer-3', {});
    expect(screen.getByText('Hiero eCommerce')).toBeTruthy();
    
    footerNoName.destroy();
    document.body.removeChild(container2);
  });
});
