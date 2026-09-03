import React from 'react';
import '../Navigation/Navigation.scss';

interface NavigationItem {
  label: string;
  url: string;
  active?: boolean;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
  onItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ items = [], onItemClick }) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ul className="navigation" role="menubar">
      {items.map((item, index) => (
        <li key={index} className="navigation__item">
          <a
            href={item.url}
            className={`navigation__link ${item.active ? 'navigation__link--active' : ''}`}
            onClick={onItemClick}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.label}
          </a>
          {item.children && item.children.length > 0 && (
            <>
              <button
                className="navigation__submenu-toggle"
                onClick={() => handleToggle(index)}
                aria-expanded={expandedIndex === index}
                aria-label={`Toggle submenu for ${item.label}`}
              >
                <svg className="icon icon--chevron" aria-hidden="true">
                  <use href="#icon-chevron"></use>
                </svg>
              </button>
              <ul
                className={`navigation__submenu ${expandedIndex === index ? 'navigation__submenu--open' : ''}`}
                role="menu"
              >
                {item.children.map((child, childIndex) => (
                  <li key={childIndex} className="navigation__submenu-item">
                    <a
                      href={child.url}
                      className="navigation__submenu-link"
                      onClick={onItemClick}
                      role="menuitem"
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Navigation;