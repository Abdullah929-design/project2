# 📋 Step-by-Step Database Setup Guide

## Prerequisites
- PostgreSQL installed and running on your system
- PostgreSQL service should be running (check with `services.msc` on Windows)

---

## **STEP 1: Open PostgreSQL Command Line**

### Option A: Using pgAdmin (GUI - Recommended for beginners)
1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Right-click on **"Databases"** → **"Create"** → **"Database"**
4. Name: `mealsdb`
5. Click **"Save"**
6. Right-click on `mealsdb` → **"Query Tool"**
7. Copy and paste the SQL from `setup_database.sql` (skip the CREATE DATABASE line)

### Option B: Using psql (Command Line)
1. Open **Command Prompt** or **PowerShell**
2. Navigate to PostgreSQL bin directory:
   ```bash
   cd "C:\Program Files\PostgreSQL\<version>\bin"
   ```
3. Run psql:
   ```bash
   psql -U postgres
   ```
   (Enter your PostgreSQL password when prompted)

---

## **STEP 2: Create the Database**

If using **psql**, run:
```sql
CREATE DATABASE mealsdb;
```

Exit psql:
```sql
\q
```

Connect to the new database:
```bash
psql -U postgres -d mealsdb
```

---

## **STEP 3: Run the Setup SQL Script**

### Option A: Using pgAdmin Query Tool
1. In pgAdmin, right-click on `mealsdb` database
2. Click **"Query Tool"**
3. Open the file `server/setup_database.sql`
4. Copy all the SQL (except the CREATE DATABASE line)
5. Paste into Query Tool
6. Click **"Execute"** (F5 or play button)

### Option B: Using psql Command Line
```bash
psql -U postgres -d mealsdb -f setup_database.sql
```

### Option C: Copy-Paste into psql
1. Connect to mealsdb:
   ```bash
   psql -U postgres -d mealsdb
   ```
2. Copy the SQL from `setup_database.sql` (starting from CREATE TABLE statements)
3. Paste into the psql prompt
4. Press Enter

---

## **STEP 4: Verify Tables Were Created**

Run these commands to verify:

```sql
-- List all tables
\dt

-- Check food_items table structure
\d food_items

-- Check user_meals table structure
\d user_meals

-- Check user_goals table structure
\d user_goals

-- See sample data in food_items
SELECT * FROM food_items LIMIT 5;
```

**Expected Output:**
- You should see 3 tables: `food_items`, `user_meals`, `user_goals`
- `food_items` should have 15 sample food items

---

## **STEP 5: Create Database User (Optional but Recommended)**

For better security, create a dedicated user:

```sql
-- Create user
CREATE USER meals_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mealsdb TO meals_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO meals_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO meals_user;

-- Grant privileges on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO meals_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO meals_user;
```

---

## **STEP 6: Troubleshooting**

### Issue: "database does not exist"
**Solution:** Make sure you created the database first:
```sql
CREATE DATABASE mealsdb;
```

### Issue: "permission denied"
**Solution:** Make sure you're using the correct user:
```bash
psql -U postgres -d mealsdb
```

### Issue: "relation already exists"
**Solution:** Tables already exist. You can either:
- Drop and recreate: `DROP TABLE user_meals CASCADE;` (then rerun setup)
- Or use `CREATE TABLE IF NOT EXISTS` (already in the script)

### Issue: "password authentication failed"
**Solution:** 
- Check your PostgreSQL password
- Or reset it in pgAdmin → Server Properties → Change Password

---

## **STEP 7: Test Database Connection**

Run a simple query to test:
```sql
SELECT COUNT(*) FROM food_items;
```

Should return: `15` (number of sample foods)

---

## **Next Steps:**
After database is set up, proceed to:
1. Create `.env` file in `server/` folder with database credentials
2. Start the backend server
3. Connect the frontend

---

## **Quick Reference Commands**

```bash
# Connect to PostgreSQL
psql -U postgres

# Connect to specific database
psql -U postgres -d mealsdb

# List all databases
\l

# List all tables
\dt

# Describe table structure
\d table_name

# Exit psql
\q
```

