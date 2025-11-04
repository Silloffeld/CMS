# MySQL Setup Guide

This guide will help you configure the project to use MySQL instead of SQLite.

## Prerequisites

You need MySQL installed on your system. Choose one of these options:

### Option 1: Install MySQL Locally

**Windows:**
- Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
- Or use [XAMPP](https://www.apachefriends.org/) (includes MySQL)
- Or use [Laragon](https://laragon.org/) (includes MySQL)

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### Option 2: Use Docker (Recommended)

The easiest way to get MySQL running:

```bash
docker run -d \
  --name cms-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=cms_webshop \
  -p 3306:3306 \
  mysql:8.0
```

To stop/start the container:
```bash
docker stop cms-mysql
docker start cms-mysql
```

To remove the container:
```bash
docker stop cms-mysql
docker rm cms-mysql
```

## Configuration Steps

### 1. Create MySQL Database

Connect to MySQL and create the database:

```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE cms_webshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Note:** If using Docker with the command above, the database is already created.

### 2. Update Your .env File

Copy `.env.example` to `.env` if you haven't already:
```bash
cp .env.example .env
```

Update these lines in your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cms_webshop
DB_USERNAME=root
DB_PASSWORD=root
```

**Important:** Update `DB_USERNAME` and `DB_PASSWORD` with your actual MySQL credentials.

### 3. Generate Application Key (if not done)

```bash
php artisan key:generate
```

### 4. Run Migrations

```bash
php artisan migrate
```

This will create all the necessary tables:
- users
- customers
- products
- product_variants
- cart
- orders
- order_items
- and other system tables

### 5. Seed Sample Data

```bash
php artisan db:seed
```

This creates:
- 1 test customer (customer@test.com / password)
- 4 sample products with 53 variants
- 1 admin user

## Connecting with DataGrip or Rider

### DataGrip

1. Open DataGrip
2. Click **+** → **Data Source** → **MySQL**
3. Configure the connection:
   - **Host:** `127.0.0.1` (or `localhost`)
   - **Port:** `3306`
   - **Database:** `cms_webshop`
   - **User:** `root`
   - **Password:** `root` (or your password)
4. Click **Test Connection**
   - DataGrip will download MySQL drivers if needed
5. Click **OK**

### Rider

1. Open Rider
2. Go to **View** → **Tool Windows** → **Database**
3. Click **+** → **Data Source** → **MySQL**
4. Enter the same connection details as above
5. Click **Test Connection** → **Apply** → **OK**

## Verify Setup

Check your database connection:

```bash
php artisan tinker
```

Then in the tinker console:
```php
DB::connection()->getPdo();
// Should return PDO object without errors

\App\Models\Product::count();
// Should return 4 (number of seeded products)

\App\Models\Customer::count();
// Should return 1 (test customer)
```

Type `exit` to quit tinker.

## Common Connection Issues

### Can't connect to MySQL server

**Check MySQL is running:**
```bash
# Linux/macOS
sudo systemctl status mysql
# or
brew services list

# Windows (in Services app)
# Look for "MySQL" service

# Docker
docker ps | grep cms-mysql
```

**Check port 3306 is available:**
```bash
# Linux/macOS
lsof -i :3306
# or
netstat -an | grep 3306

# Windows
netstat -an | findstr 3306
```

### Access denied for user

- Verify username and password in `.env`
- Make sure user has permissions on the database:
  ```sql
  GRANT ALL PRIVILEGES ON cms_webshop.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Unknown database 'cms_webshop'

Create the database manually:
```sql
CREATE DATABASE cms_webshop;
```

### SQLSTATE[HY000] [2002] Connection refused

- MySQL service is not running
- Wrong host/port in `.env`
- If using Docker, container might be stopped

## Migration Commands Reference

```bash
# Run all migrations
php artisan migrate

# Rollback last batch of migrations
php artisan migrate:rollback

# Reset and re-run all migrations
php artisan migrate:fresh

# Reset and re-run with seeders
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status

# Run specific seeder
php artisan db:seed --class=ProductSeeder
```

## Switching Back to SQLite

If you want to switch back to SQLite:

1. Update `.env`:
   ```env
   DB_CONNECTION=sqlite
   # DB_HOST=127.0.0.1
   # DB_PORT=3306
   # DB_DATABASE=cms_webshop
   # DB_USERNAME=root
   # DB_PASSWORD=
   ```

2. Create SQLite database:
   ```bash
   touch database/database.sqlite
   ```

3. Run migrations:
   ```bash
   php artisan migrate:fresh --seed
   ```

## Next Steps

After MySQL is set up:

1. **Start the development server:**
   ```bash
   php artisan serve
   ```

2. **Build frontend assets:**
   ```bash
   npm install
   npm run dev
   ```

3. **Test the webshop:**
   - Visit http://localhost:8000
   - Browse products at http://localhost:8000/products
   - Login with customer@test.com / password

## Additional Resources

- [Laravel Database Documentation](https://laravel.com/docs/database)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [DataGrip MySQL Guide](https://www.jetbrains.com/help/datagrip/mysql.html)
- Main setup guide: `WEBSHOP_SETUP.md`
- Database tools guide: `DATABASE_SETUP_RIDER_DATAGRIP.md`
