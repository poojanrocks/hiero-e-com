# Hiero Ecom API Contracts

## Base URL
`/api/v1`

## Common Error Model
```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with SKU 'X' not found",
    "details": {}
  }
}
```

## Endpoints

### Product
- `GET /products?category=:categoryId&page=:page&size=:size`
  Response: `{ "data": [Product], "page": 1, "size": 20, "total": 150 }`
- `GET /products/:sku`
  Response: Product object
- `GET /products/:sku/price`
  Response: `{ "productId": "...", "listPrice": 19.99, "salePrice": 14.99, "currency": "USD" }`
- `GET /products/:sku/inventory`
  Response: `{ "productId": "...", "quantity": 50 }`

### Category
- `GET /categories`
  Response: `[ Category, ... ]` (tree structure with children)
- `GET /categories/:id`
  Response: Category object with `products` array

### Cart
- `POST /cart` (no body, returns `{ "cartId": "..." }`)
- `GET /cart/:cartId`
  Response: `{ "cartId": "...", "items": [ { "sku": "...", "quantity": 2, "price": 14.99 } ] }`
- `POST /cart/:cartId/items`
  Body: `{ "sku": "...", "quantity": 1 }`
  Response: updated cart object
- `DELETE /cart/:cartId/items/:itemId`
  Response: `{ "success": true }`

### Checkout
- `POST /checkout/:cartId`
  Body: `{ "shippingAddress": { ... }, "paymentMethod": "..." }`
  Response: `{ "orderId": "...", "status": "confirmed" }`
- `GET /orders/:orderId`
  Response: Order object with status and line items

## Pagination
All paginated responses:
```json
{
  "data": [...],
  "page": 1,
  "size": 20,
  "total": 150
}
```

## Error Codes
| HTTP Code | Error Code | Description |
|-----------|------------|-------------|
| 400 | INVALID_REQUEST | Malformed request body or parameters |
| 404 | PRODUCT_NOT_FOUND | Product not found |
| 404 | CATEGORY_NOT_FOUND | Category not found |
| 404 | CART_NOT_FOUND | Cart not found |
| 404 | ORDER_NOT_FOUND | Order not found |
| 409 | CART_EXPIRED | Cart has expired |
| 500 | INTERNAL_ERROR | Unexpected server error |
