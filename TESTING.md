# Testing Guide

Quick reference for running tests and code quality checks on this project.

## Prerequisites

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Set up environment
cp .env.example .env
php artisan key:generate
```

## Running Tests

### PHP Tests
```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run with coverage
php artisan test --coverage
```

### PHP Code Style
```bash
# Check and fix code style
./vendor/bin/pint

# Check only (don't fix)
./vendor/bin/pint --test
```

## Frontend Checks

### Build Assets
```bash
# Production build
npm run build

# Development build with watch
npm run dev

# SSR build
npm run build:ssr
```

### TypeScript
```bash
# Type checking
npm run types
```

### ESLint
```bash
# Lint and fix
npm run lint
```

### Prettier
```bash
# Format code
npm run format

# Check formatting only
npm run format:check
```

## Complete Test Suite

Run all tests and checks in order:

```bash
# 1. PHP code style
./vendor/bin/pint

# 2. PHP tests
php artisan test

# 3. Build frontend
npm run build

# 4. TypeScript check
npm run types

# 5. ESLint
npm run lint

# 6. Prettier check
npm run format:check
```

## CI/CD Integration

For automated testing in CI/CD pipelines, use:

```bash
# Setup
composer install --no-interaction --prefer-dist --optimize-autoloader
npm ci
cp .env.example .env
php artisan key:generate

# Run checks
./vendor/bin/pint --test
php artisan test
npm run build
npm run types
npm run lint
npm run format:check
```

## Common Issues

### Missing Vite Manifest
**Error:** `Vite manifest not found`  
**Solution:** Run `npm run build` before running tests

### User Factory Not Found
**Error:** `Call to undefined method App\Models\User::factory()`  
**Solution:** Add `use HasFactory;` to `app/Models/User.php`

### TypeScript Errors
Most TypeScript errors are due to missing type definitions. See `TEST_RESULTS.md` for specific issues and recommendations.

## Documentation

For detailed test results and recommendations, see:
- `TEST_RESULTS.md` - Comprehensive test results and findings
- `phpunit.xml` - PHPUnit configuration
- `package.json` - npm scripts and dependencies
- `composer.json` - Composer scripts and dependencies

---

*Last updated: 2025-12-10*
