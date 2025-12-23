# Database Setup Guide for Rider & DataGrip

This guide explains how to set up and connect to the database for this Laravel + React webshop project using JetBrains Rider and DataGrip.

## Project Database Configuration

This project uses **SQLite** by default (configured in `.env.example`), which is perfect for development and makes setup incredibly simple with JetBrains tools.

## Option 1: Using SQLite (Recommended for Development)

### Setup Steps

1. **Create the Environment File**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

2. **Create the SQLite Database File**
   ```bash
   touch database/database.sqlite
   ```

3. **Run Migrations**
   ```bash
   php artisan migrate
   ```

4. **Seed Sample Data**
   ```bash
   php artisan db:seed
   ```

### Connecting with DataGrip

1. **Open DataGrip**
2. Click the **+** button or go to **File → New → Data Source → SQLite**
3. Configure the connection:
   - **File**: Browse to your project folder and select `database/database.sqlite`
   - Click **Test Connection** (DataGrip will download SQLite drivers if needed)
   - Click **OK**

4. **View Your Data**
   - Expand the database in the left panel
   - You'll see all tables: `products`, `product_variants`, `customers`, `cart`, `orders`, `order_items`, etc.
   - Double-click any table to view/edit data
   - Right-click a table → **Dump Data to File** to export

### Connecting with Rider

1. **Open Rider**
2. Open the **Database** tool window (View → Tool Windows → Database)
3. Click the **+** button → **Data Source → SQLite**
4. Configure the connection:
   - **File**: Browse to `database/database.sqlite` in your project
   - Click **Test Connection**
   - Click **Apply** and **OK**

5. **Use the Database**
   - View tables and data in the Database panel
   - Run queries in the console (Ctrl+Shift+F10)
   - Edit data directly in table views

## Option 2: Using MySQL/MariaDB

If you prefer MySQL instead of SQLite:

### Setup Steps

1. **Install MySQL/MariaDB**
   - Download from [MySQL](https://dev.mysql.com/downloads/mysql/) or [MariaDB](https://mariadb.org/download/)
   - Or use Docker:
     ```bash
     docker run -d \
       --name cms-mysql \
       -e MYSQL_ROOT_PASSWORD=root \
       -e MYSQL_DATABASE=cms_webshop \
       -p 3306:3306 \
       mysql:8.0
     ```

2. **Update .env File**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=cms_webshop
   DB_USERNAME=root
   DB_PASSWORD=root
   ```

3. **Run Migrations**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

### Connecting with DataGrip

1. **Open DataGrip**
2. Click **+** → **Data Source → MySQL**
3. Configure:
   - **Host**: `127.0.0.1` or `localhost`
   - **Port**: `3306`
   - **User**: `root`
   - **Password**: `root` (or your password)
   - **Database**: `cms_webshop`
4. Click **Test Connection** → **OK**

### Connecting with Rider

1. **Open Rider Database Panel**
2. Click **+** → **Data Source → MySQL**
3. Enter the same connection details as above
4. Click **Test Connection** → **Apply** → **OK**

## Option 3: Using PostgreSQL

### Setup Steps

1. **Install PostgreSQL**
   - Download from [PostgreSQL](https://www.postgresql.org/download/)
   - Or use Docker:
     ```bash
     docker run -d \
       --name cms-postgres \
       -e POSTGRES_PASSWORD=secret \
       -e POSTGRES_DB=cms_webshop \
       -p 5432:5432 \
       postgres:15
     ```

2. **Update .env File**
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=cms_webshop
   DB_USERNAME=postgres
   DB_PASSWORD=secret
   ```

3. **Run Migrations**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

### Connecting with DataGrip

1. Click **+** → **Data Source → PostgreSQL**
2. Configure:
   - **Host**: `127.0.0.1`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: `secret`
   - **Database**: `cms_webshop`
3. Click **Test Connection** → **OK**

### Connecting with Rider

Same steps as DataGrip using the Database panel.

## Database Schema Overview

After running migrations, you'll have these tables:

### Core Tables
- **users** - Admin users for the CMS
- **customers** - Customer accounts for the shop
- **products** - Product information
- **product_variants** - Product variants (sizes, colors, etc.)
- **cart** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Individual items in each order

### System Tables
- **migrations** - Migration history
- **cache** - Cache storage
- **jobs** - Queue jobs
- **sessions** - User sessions

## Useful DataGrip/Rider Features

### 1. Query Console
- Right-click database → **New → Query Console**
- Write and execute SQL queries
- Example:
  ```sql
  -- View all products with their variants
  SELECT p.title, pv.options, pv.price, pv.inventory_qty
  FROM products p
  JOIN product_variants pv ON p.id = pv.product_id
  WHERE p.published = 1;
  
  -- View recent orders
  SELECT o.id, c.email, o.total, o.status, o.created_at
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  ORDER BY o.created_at DESC
  LIMIT 10;
  ```

### 2. Data Editor
- Double-click any table to open in editor
- Add/edit/delete rows directly
- Use filters to find specific data
- Export data to CSV, JSON, SQL, etc.

### 3. Diagrams
- Right-click database → **Diagrams → Show Visualization**
- See table relationships visually
- Useful for understanding the schema

### 4. Database Compare
- **Tools → Database Diff**
- Compare databases or schemas
- Sync changes between environments

### 5. Run SQL Files
- Drag and drop `.sql` files into the editor
- Right-click → **Run** to execute
- Perfect for running custom scripts

## Sample Data

After running `php artisan db:seed`, you'll have:

- **1 Test Customer**
  - Email: `customer@test.com`
  - Password: `password`

- **4 Products**
  - Classic T-Shirt (16 variants)
  - Slim Fit Jeans (15 variants)
  - Running Sneakers (18 variants)
  - Travel Backpack (4 variants)

- **1 Admin User** (from AdminUserSeeder)

## Troubleshooting

### SQLite Database Locked
If you get "database is locked" errors:
- Close all connections in DataGrip/Rider
- Stop Laravel server (`php artisan serve`)
- Wait a few seconds and try again

### Can't Find Database File
- Make sure you created the file: `touch database/database.sqlite`
- Check the absolute path in your `.env`: `DB_DATABASE=/absolute/path/to/database/database.sqlite`

### Migration Errors
- Make sure you have the latest code: `git pull`
- Clear config cache: `php artisan config:clear`
- Try fresh migration: `php artisan migrate:fresh --seed`

### Connection Issues (MySQL/PostgreSQL)
- Check database service is running
- Verify credentials in `.env`
- Test connection with CLI:
  ```bash
  # MySQL
  mysql -u root -p
  
  # PostgreSQL
  psql -U postgres -d cms_webshop
  ```

## Best Practices

1. **Use Migrations** - Never modify the database structure directly
2. **Use Seeders** - Create seeders for test data
3. **Backup SQLite** - Copy `database/database.sqlite` for backups
4. **Version Control** - Never commit your `.env` or `database.sqlite` files
5. **Fresh Start** - Use `php artisan migrate:fresh --seed` to reset database

## Quick Reference Commands

```bash
# Create database file (SQLite only)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh migration (drops all tables)
php artisan migrate:fresh

# Fresh migration with seeders
php artisan migrate:fresh --seed

# Run specific seeder
php artisan db:seed --class=ProductSeeder

# Check migration status
php artisan migrate:status

# Generate new migration
php artisan make:migration create_table_name

# Generate new seeder
php artisan make:seeder TableSeeder
```

## Additional Resources

- [Laravel Database Documentation](https://laravel.com/docs/database)
- [DataGrip Documentation](https://www.jetbrains.com/help/datagrip/)
- [Rider Database Tools](https://www.jetbrains.com/help/rider/Database_tool_window.html)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

---

For more information about the project, see:
- `WEBSHOP_SETUP.md` - General setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
