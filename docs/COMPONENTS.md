# Global Storefront Components

## Header Component

### Features
- **Responsive Navigation**: Mobile-first navigation with hamburger menu toggle
- **Search Functionality**: Integrated search bar with submit capability
- **Wishlist Entry Point**: Icon with item count badge
- **Shopping Cart Entry Point**: Icon with item count badge
- **Sticky Positioning**: Header remains visible during page scroll
- **Keyboard Accessibility**: Full keyboard navigation support (Tab, Enter, Escape)

### Usage
```html
<header class="header" role="banner" data-component="header">
  <!-- Navigation and actions -->
</header>
```

### Configuration (Author Dialog)
- **Brand Name**: Customizable brand/company name
- **Logo Path**: Path to logo image asset
- **Navigation Path**: Path to navigation configuration

### Responsive Breakpoints
- **Desktop (>768px)**: Full navigation and search visible
- **Tablet (481-768px)**: Compact menu with hamburger toggle
- **Mobile (<480px)**: Minimal header with collapsed menu

## Footer Component

### Features
- **Multi-Column Layout**: Responsive grid layout for footer content
- **Social Media Links**: Configurable social media icon links
- **Company Information**: Sections for company, support, and legal information
- **Copyright Section**: Customizable copyright text and badges
- **Keyboard Accessible**: Full keyboard navigation for all links

### Usage
```html
<footer class="footer" role="contentinfo" data-component="footer">
  <!-- Footer content sections -->
</footer>
```

### Configuration (Author Dialog)
- **Copyright Text**: Customizable copyright message
- **Show Social Links**: Toggle visibility of social media links
- **Footer Columns Config**: JSON configuration for footer sections

### Responsive Breakpoints
- **Desktop (>768px)**: 4-column grid layout
- **Tablet (481-768px)**: 2-column grid layout
- **Mobile (<480px)**: Single column stacked layout

## Global UI Patterns

### Empty State
Used when no content is available.
```javascript
PatternManager.renderEmptyState({
  icon: '📦',
  title: 'No items found',
  message: 'There are no items to display.',
  actionText: 'Go shopping',
  actionUrl: '/shop'
});
```

### Loading State
Used during async data loading.
```javascript
PatternManager.renderLoadingState({
  text: 'Loading...'
});
```

### Skeleton Loader
Used for progressive content loading.
```javascript
PatternManager.renderSkeletonLoader('text', 3);
```

### Error State
Used when operations fail.
```javascript
PatternManager.renderErrorState({
  title: 'Something went wrong',
  message: 'Please try again',
  primaryAction: { text: 'Retry', callback: () => {} },
  secondaryAction: { text: 'Go back', callback: () => {} }
});
```

### Toast Notifications
Used for transient messages.
```javascript
PatternManager.showToast('Success!', 'success', 3000);
PatternManager.showToast('Error!', 'error', 3000);
```

## Accessibility Features

### Header
- Semantic HTML5 elements (`<header>`, `<nav>`)
- ARIA labels and roles for all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators for keyboard users
- Screen reader friendly labels

### Footer
- Semantic HTML5 elements (`<footer>`, `<a>`)
- ARIA roles for content regions
- Keyboard navigation for all links
- Focus indicators and hover states
- Sufficient color contrast ratios

### Patterns
- ARIA live regions for dynamic content updates
- Alert roles for error states
- Status roles for loading states
- Proper heading hierarchy
- Hidden decorative elements with aria-hidden

## Client Library Dependencies

- **Category**: `hiero-ecom.header-footer`, `hiero-ecom.patterns`
- **Dependencies**: `granite.jquery`

## Testing

### Unit Tests
- Header component model initialization
- Footer component model initialization
- Configuration handling

### Integration Tests
- Header and footer render on all page templates
- Navigation links work correctly
- Cart and wishlist counts update
- Mobile menu toggle functionality
- Search form submission

### Accessibility Testing
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader compatibility
- Focus indicators visibility
- Color contrast ratios
- ARIA labels accuracy
