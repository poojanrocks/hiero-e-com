# Hiero eCommerce

A modern AEM-based e-commerce storefront with responsive design and accessibility-first components.

## Architecture

Follows AEM best practices with clear separation of concerns:
- **ui.frontend**: TypeScript/SCSS source code built with webpack
- **ui.apps**: HTL templates, component definitions, and AEM dialogs
- **core**: Java models and backend services
- **ui.config**: OSGi configuration
- **ui.content**: Content packages

## Building

### Prerequisites
- Java 11+
- Maven 3.6+
- Node.js 18+ (managed by frontend-maven-plugin)

### Build Commands

```bash
# Build entire project
mvn clean install

# Build ui.frontend only (with hot reload)
cd ui.frontend
npm install
npm run dev

# Run tests
mvn test

# Run frontend tests
cd ui.frontend
npm run test
```

## Components

### Header
Responsive header with:
- Logo and navigation links
- Search functionality
- Cart counter
- Wishlist counter
- Mobile menu with Escape key handling
- Full keyboard navigation support
- ARIA labels for screen readers

**Location**: `ui.apps/src/main/content/jcr_root/apps/hiero-ecom/components/header/`

### Footer
Responsive footer with:
- Collapsible groups on mobile (Products, Help, Company)
- Social media links
- Copyright information
- Accessible link labels

**Location**: `ui.apps/src/main/content/jcr_root/apps/hiero-ecom/components/footer/`

## Shared Services

### Navigation Service
Manages active link states across page navigation.

### Search Service
Handles search input and form submission.

### Cart Service
Manages cart state and add-to-cart operations.

### Wishlist Service
Manages wishlist state and add/remove operations.

**Location**: `ui.frontend/src/main/ts/shared/services/`

## Global Patterns

### Loading Pattern
Spinner-based loading state with `aria-busy` attribute.

### Empty Pattern
User-friendly empty state message.

### Error Pattern
Error message with retry button and `role="alert"`.

**Location**: `ui.frontend/src/main/ts/patterns/`

## Testing

### Frontend Unit Tests
```bash
cd ui.frontend
npm run test
npm run test:watch
```

### Backend Tests
```bash
mvn test
```

## Accessibility

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation (Tab, Escape)
- Focus management
- Screen reader support
- Color contrast compliance

## Responsive Design

- Mobile first approach
- Breakpoint: 768px (tablet/desktop)
- Flexible grid layout
- Touch-friendly touch targets (min 44x44px)

## Known Limitations

- Social media links use emoji icons (can be replaced with SVG)
- Search API endpoint requires backend implementation
- Cart and wishlist state persisted via attributes (can be integrated with session/local storage)

## Documentation

See `docs/` directory for:
- API documentation
- Component specifications
- Architecture decisions
- Configuration guide
