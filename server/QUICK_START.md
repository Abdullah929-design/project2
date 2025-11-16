# ⚡ Quick Start: Database Setup

## 🎯 Simple 5-Step Process

### **Step 1: Create Database**
Open **pgAdmin** (or `psql` command line) and run:
```sql
CREATE DATABASE mealsdb;
```

### **Step 2: Open SQL Script**
In pgAdmin:
1. Right-click on `mealsdb` database
2. Click **"Query Tool"**
3. Open file: `server/setup_database.sql`

### **Step 3: Execute SQL**
1. Copy all SQL (from `CREATE TABLE` onwards - skip the `CREATE DATABASE` line)
2. Paste in Query Tool
3. Click **"Execute"** (F5)

### **Step 4: Verify**
Run this query:
```sql
SELECT COUNT(*) FROM food_items;
```
Should return: `15`

### **Step 5: Done! ✅**
Your database is ready! Next step is to create the `.env` file and start the server.

---

## 📝 Using Command Line (psql)

```bash
# 1. Connect to PostgreSQL
psql -U postgres

# 2. Create database
CREATE DATABASE mealsdb;
\q

# 3. Connect to mealsdb and run script
psql -U postgres -d mealsdb -f setup_database.sql

# 4. Verify
psql -U postgres -d mealsdb
SELECT COUNT(*) FROM food_items;
\q
```

---

## 🔍 Check Tables Created

```sql
-- List all tables
\dt

-- Should see:
-- food_items
-- user_meals  
-- user_goals
```

---

**Need detailed instructions?** See `DATABASE_SETUP_GUIDE.md`

