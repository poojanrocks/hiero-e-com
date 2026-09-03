# Hiero Ecom - Solution Architecture

## Overview

Hiero Ecom is an AEM-based storefront that separates transactional product/catalog data from authored content.

## Architecture Diagram

```
+----------------+       +----------------+       +----------------+
|                |       |                |       |                |
|   AEM Author   |<----->|   AEM Publish  |<----->|   Frontend     |
|                |       |                |       | (SPA/React)    |
| - Content      |       | - Content      |       |                |
|   Fragments    |       |   Fragments    |       |                |
| - Pages        |       | - Pages        |       |                |
| - Assets       |       | - Assets       |       |                |
|                |       |                |       |                |
+-------+--------+       +-------+--------+       +-------+--------+
        |                        |                        |
        |                        |                        |
        v                        v                        v
+----------------+       +----------------+       +----------------+
|                |       |                |       |                |
|   SQL DB       |       |   REST API     |       |   Search       |
| (Product       |       | (Order, Cart,  |       |   (Elastic/   |
|  Catalog,      |       |  Checkout)     |       |    Algolia)   |
|  Inventory,    |       |                |       |                |
|  Pricing)      |       |                |       |                |
+----------------+       +----------------+       +----------------+
```

## Component Responsibilities

### AEM Author
- Author product-related content (rich descriptions, images, categories) using Content Fragments
- Manage pages, experiences, and landing pages
- DAM assets (product images, banners)

### AEM Publish
- Deliver rendered HTML/JSON
- Serve Content Fragment models and fragments via AEM APIs
- Handle personalization and segmentation

### SQL Database (Transactional Data)
- **Source of truth** for: product names, SKUs, prices, inventory, orders, customer data
- Accessed via backend services (e.g., Java servlets or microservices)
- Not directly exposed to AEM components; consumed through API layer

### REST API (Backend Services)
- Expose product catalog, cart, checkout, order history
- Written in Java (Spring Boot) or Node.js, deployed separately
- API contracts defined below

### Search Service
- Index product data for full-text and faceted search
- Powered by Elasticsearch, Algolia, or similar

## Data Strategy

### Product/Catalog Data (SQL)
| Entity | Attributes |
|--------|------------|
| Product | id, sku, name, description, price, currency, categoryId, active, created, updated |
| Category | id, name, parentId, description |
| Inventory | productId, quantity, warehouseId |
| Price | productId, listPrice, salePrice, validFrom, validTo |

### Authored Content (AEM Content Fragments)
| Content Fragment Model | Fields |
|------------------------|--------|
| Product Detail | heroImage, longDescription, features (multifield), relatedProducts |
| Category Page | bannerImage, seoDescription, customHtml |

- Content Fragments reference SQL-based product ID via a custom field
- AEM components fetch product data from the REST API using the product ID

## API Contracts

### Common Error Model
```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with SKU 'X' not found",
    "details": {}
  }
}
```

| HTTP Code | Error Code | Description |
|-----------|------------|-------------|
| 400 | INVALID_REQUEST | Malformed request |
| 404 | PRODUCT_NOT_FOUND | Product not found |
| 404 | CATEGORY_NOT_FOUND | Category not found |
| 500 | INTERNAL_ERROR | Unexpected server error |

### Endpoints (Base: /api/v1)

#### Product
- `GET /products?category=:categoryId&page=:page&size=:size` -> Paginated product list
- `GET /products/:sku` -> Single product
- `GET /products/:sku/price` -> Current price
- `GET /products/:sku/inventory` -> Stock quantity

#### Category
- `GET /categories` -> Full category tree
- `GET /categories/:id` -> Single category with products

#### Cart
- `POST /cart` -> Create cart (returns cartId)
- `GET /cart/:cartId` -> Get cart items
- `POST /cart/:cartId/items` -> Add item
- `DELETE /cart/:cartId/items/:itemId` -> Remove item

#### Checkout
- `POST /checkout/:cartId` -> Place order
- `GET /orders/:orderId` -> Order details

## Environment & Configuration

### Environments
- **dev**: Local development, AEM SDK + local SQL
- **qa**: Shared QA, all cloud services
- **staging**: Pre-production, same as prod config
- **prod**: Production

### Configuration Approach
- Use AEM OSGi configurations for environment-specific settings (API base URL, DB connection strings via secrets)
- Store secrets in cloud environment variables / secrets manager (e.g., AWS Secrets Manager)
- Use AEM Run Modes (author/publish) to differentiate configuration
- Do not commit secrets to repository

### Example OSGi Config (config.author)
```json
{
  "service.api.base.url": "http://localhost:8080/api/v1",
  "search.api.key": "${env:SEARCH_API_KEY}"
}
```

## Conventions

- All API responses return JSON
- Paginated responses contain: `{ "data": [...], "page": 1, "size": 20, "total": 150 }`
- IDs are strings (UUIDs or SKUs)
- Dates in ISO 8601 format
