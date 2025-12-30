# Laravel React Headless CMS

This is a Laravel backend with a React frontend for a webshop CMS.

## Stack

- Laravel 12 (Headless API)
- React 19 (Frontend SPA)
- React Router (Client-side routing)

## Project Explanation

This is a Laravel backend providing a RESTful API directly connected to a React SPA frontend for managing an online shop/store!

The backend serves as a headless CMS, exposing JSON API endpoints for:
- Authentication
- Product management
- Customer management
- Admin panel functionality
- Shop functionality

The frontend is a standalone React application that consumes these APIs.

## Getting Started

### Backend Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Frontend Setup

```bash
npm install
npm run dev
```

### Development

Run both backend and frontend:

```bash
composer run dev
```

## API Endpoints

All endpoints return JSON responses. Authentication is handled via Laravel sessions/Sanctum.

### Authentication
- `GET /api` - Home/welcome
- `POST /login` - Authenticate user
- `POST /logout` - Logout user
- `POST /register` - Register new user

### Admin
- `GET /admin` - Admin dashboard
- `GET /admin/manage` - Manage products
- `POST /admin/import` - Import products from CSV

### Shop
- `GET /products` - List all products
- `GET /account` - User account info
- `POST /cart` - Manage cart

Feel free to use this however you want!
