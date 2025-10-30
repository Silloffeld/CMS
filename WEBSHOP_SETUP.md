# Webshop Setup Guide

This Laravel + React webshop CMS is now fully functional! Here's what has been implemented:

## Features Implemented

### Customer-Facing Features
- **Product Browsing**: View all published products with variants (sizes, colors, etc.)
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Place orders with shipping address
- **Order History**: View past orders and their status
- **Account Management**: Update profile information and password

### Backend Features
- **Order Management**: Orders are stored with customer information
- **Inventory Tracking**: Products have inventory quantities
- **Product Variants**: Support for multiple product options (size, color, etc.)
- **Admin CMS**: Existing admin panel for managing products

## Database Schema

### Tables Created
- `products` - Main product information
- `product_variants` - Product variants with options, price, inventory
- `customers` - Customer accounts (separate from admin users)
- `cart` - Shopping cart items
- `orders` - Order information
- `order_items` - Individual items in each order

## Setup Instructions

1. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   touch database/database.sqlite
   php artisan migrate
   ```

4. **Seed Sample Data**
   ```bash
   php artisan db:seed
   ```
   This creates:
   - 1 test customer (email: customer@test.com, password: password)
   - 4 sample products with variants
   - 1 admin user (from AdminUserSeeder)

5. **Build Assets**
   ```bash
   npm run build
   # or for development
   npm run dev
   ```

6. **Run the Application**
   ```bash
   php artisan serve
   ```

## Routes

### Shop Routes (Customer-Facing)
- `GET /` - Welcome page
- `GET /products` - Browse all products
- `GET /login` - Customer login
- `GET /register` - Customer registration

**Authenticated Customer Routes:**
- `GET /account` - Account management
- `POST /account` - Update account
- `GET /cart` - View shopping cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/{id}` - Update cart item quantity
- `DELETE /cart/{id}` - Remove item from cart
- `GET /checkout` - Checkout page
- `POST /checkout` - Process order
- `GET /orders` - Order history
- `GET /order/{id}/confirmation` - Order confirmation

### Admin Routes
- `GET /admin/login` - Admin login
- `GET /admin` - Admin dashboard
- (Other existing admin routes for product management)

## Testing the Webshop

1. **Browse Products**: Navigate to `/products` to see the sample products
2. **Create Account**: Go to `/register` to create a customer account
3. **Login**: Use the test customer credentials or your new account
4. **Add to Cart**: Click "Add to Cart" on any product variant
5. **Checkout**: Navigate through cart → checkout → place order
6. **View Orders**: Check your order history at `/orders`

## Test Credentials

- **Test Customer**: 
  - Email: customer@test.com
  - Password: password

## What's Working

✅ Product listing with variants
✅ Add to cart functionality  
✅ Cart management (update quantities, remove items)
✅ Checkout process
✅ Order placement and storage
✅ Order history
✅ Customer account management
✅ Responsive design with Tailwind CSS
✅ Navigation across all shop pages

## Future Enhancements (Optional)

- Product images display (Media model exists)
- Product search and filtering
- Payment gateway integration
- Email notifications for orders
- Product reviews and ratings
- Wishlist functionality
- Guest checkout option
- Shipping calculations
- Tax calculations
- Discount codes/coupons

## Notes

- The shop uses a separate authentication guard for customers (`auth:web`)
- Admin users and customers are separate entities
- All prices are in USD
- Cart is persisted in database (not session-based)
- Orders track inventory but don't automatically decrement it (implement as needed)
