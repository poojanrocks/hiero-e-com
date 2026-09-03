import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from './Footer';

describe('Footer Component', () => {
  const mockColumns = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', url: '/about' },
        { label: 'Contact', url: '/contact' }
      ]
    },
    {
      title: 'Products',
      links: [
        { label: 'Electronics', url: '/electronics' },
        { label: 'Clothing', url: '/clothing' }
      ]
    }
  ];

  const mockSocialLinks = [
    { label: 'Facebook', url: 'https://facebook.com', icon: 'f' },
    { label: 'Twitter', url: 'https://twitter.com', icon: '𝕏' }
  ];

  test('renders footer with contentinfo role', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('renders copyright information', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer companyName="Test Company" copyrightYear={currentYear} />);
    expect(screen.getByText(new RegExp(`© ${currentYear} Test Company`))).toBeInTheDocument();
  });

  test('renders footer columns', () => {
    render(<Footer columns={mockColumns} />);
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  test('renders column links', () => {
    render(<Footer columns={mockColumns} />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  test('renders social links with correct attributes', () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    const facebookLink = screen.getByLabelText('Facebook');
    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
    expect(facebookLink).toHaveAttribute('target', '_blank');
  });

  test('renders legal navigation', () => {
    render(<Footer />);
    const legalNav = screen.getByLabelText('Legal navigation');
    expect(legalNav).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  test('renders legal links with correct hrefs', () => {
    render(<Footer />);
    const privacyLink = screen.getByText('Privacy Policy');
    const termsLink = screen.getByText('Terms of Service');
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  test('renders multiple columns layout', () => {
    render(<Footer columns={mockColumns} />);
    const companyTitle = screen.getByText('Company');
    const productsTitle = screen.getByText('Products');
    expect(companyTitle).toBeInTheDocument();
    expect(productsTitle).toBeInTheDocument();
  });

  test('has proper link accessibility attributes', () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    const twitterLink = screen.getByLabelText('Twitter');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
