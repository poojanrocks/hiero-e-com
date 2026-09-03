import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders copyright text', () => {
    const copyright = '© 2024 My Store';
    render(<Footer copyright={copyright} />);

    expect(screen.getByText(copyright)).toBeInTheDocument();
  });

  it('renders footer columns with links', () => {
    const columns = [
      {
        title: 'Company',
        links: [
          { label: 'About Us', url: '/about' },
          { label: 'Careers', url: '/careers' }
        ]
      },
      {
        title: 'Support',
        links: [
          { label: 'Contact', url: '/contact' },
          { label: 'FAQ', url: '/faq' }
        ]
      }
    ];

    render(<Footer columns={columns} />);

    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Settings')).toBeInTheDocument();
  });

  it('renders newsletter section when enabled', () => {
    render(<Footer newsletter={true} />);

    expect(screen.getByText('Newsletter')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('renders social links', () => {
    const socialLinks = [
      { label: 'Facebook', url: 'https://facebook.com', icon: '#icon-facebook' },
      { label: 'Twitter', url: 'https://twitter.com', icon: '#icon-twitter' }
    ];

    render(<Footer socialLinks={socialLinks} />);

    const facebookLink = screen.getByLabelText('Facebook');
    const twitterLink = screen.getByLabelText('Twitter');

    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
  });

  it('has proper accessibility structure', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('opens social links in new tab', () => {
    const socialLinks = [
      { label: 'Facebook', url: 'https://facebook.com', icon: '#icon-facebook' }
    ];

    render(<Footer socialLinks={socialLinks} />);

    const facebookLink = screen.getByLabelText('Facebook');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
