import React from 'react';
import './Footer.scss';

interface FooterColumn {
  title: string;
  links: Array<{ label: string; url: string }>;
}

interface FooterProps {
  columns?: FooterColumn[];
  companyName?: string;
  copyrightYear?: number;
  socialLinks?: Array<{ label: string; url: string; icon: string }>;
}

export const Footer: React.FC<FooterProps> = ({
  columns = [],
  companyName = 'Hiero eCommerce',
  copyrightYear = new Date().getFullYear(),
  socialLinks = []
}) => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__content">
          {columns.length > 0 && (
            <div className="footer__columns">
              {columns.map((column, index) => (
                <div key={index} className="footer__column">
                  <h3 className="footer__column-title">{column.title}</h3>
                  <ul className="footer__links">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex} className="footer__link-item">
                        <a href={link.url} className="footer__link">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="footer__social">
            <h3 className="footer__social-title">Follow Us</h3>
            <ul className="footer__social-list">
              {socialLinks.map((social, index) => (
                <li key={index} className="footer__social-item">
                  <a
                    href={social.url}
                    className="footer__social-link"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="footer__social-icon">{social.icon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; {copyrightYear} {companyName}. All rights reserved.
        </p>
        <nav className="footer__legal" aria-label="Legal navigation">
          <a href="/privacy" className="footer__legal-link">
            Privacy Policy
          </a>
          <a href="/terms" className="footer__legal-link">
            Terms of Service
          </a>
          <a href="/cookies" className="footer__legal-link">
            Cookie Settings
          </a>
        </nav>
      </div>
    </footer>
  );
};
