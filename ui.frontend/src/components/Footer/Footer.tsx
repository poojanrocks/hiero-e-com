import React from 'react';
import '../Footer/Footer.scss';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  columns?: FooterColumn[];
  copyright?: string;
  socialLinks?: Array<{ label: string; url: string; icon: string }>;
  newsletter?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  columns = [],
  copyright = '© 2024 Store. All rights reserved.',
  socialLinks = [],
  newsletter = false
}) => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__content">
          {columns.map((column, index) => (
            <div key={index} className="footer__column">
              <h3 className="footer__heading">{column.title}</h3>
              <ul className="footer__list">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="footer__item">
                    <a href={link.url} className="footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {newsletter && (
            <div className="footer__column footer__column--newsletter">
              <h3 className="footer__heading">Newsletter</h3>
              <p className="footer__description">Subscribe for updates and exclusive offers</p>
              <form className="footer__newsletter" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="footer__input"
                  required
                />
                <button type="submit" className="footer__button" aria-label="Subscribe">
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="footer__social">
            <h3 className="sr-only">Follow us</h3>
            <ul className="footer__social-list">
              {socialLinks.map((social, index) => (
                <li key={index} className="footer__social-item">
                  <a
                    href={social.url}
                    aria-label={social.label}
                    className="footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="icon" aria-hidden="true">
                      <use href={social.icon}></use>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">{copyright}</p>
        <ul className="footer__legal">
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/cookies">Cookie Settings</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;