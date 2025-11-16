# 🔌 Connection Guide: Connect Backend to PostgreSQL

## **Step 1: Update .env File**

1. Open `server/.env` file
2. Replace these values with your PostgreSQL credentials:

```env
DB_USER=postgres          # Your PostgreSQL username (usually 'postgres')
DB_HOST=localhost         # Usually 'localhost'
DB_PASSWORD=your_password # Your PostgreSQL password (CHANGE THIS!)
DB_NAME=mealsdb           # Database name you created
DB_PORT=5432              # PostgreSQL default port (usually 5432)
PORT=5000                 # Backend server port
```

### **How to find your PostgreSQL password:**
- If you set it during installation, use that password
- If you forgot it, you may need to reset it
- Default user is usually `postgres`

---

## **Step 2: Install Dependencies**

Make sure all packages are installed:

```bash
cd server
npm install
```

This should install:
- express
- pg (PostgreSQL client)
- cors
- dotenv

---

## **Step 3: Test Database Connection**

Create a quick test file to verify connection:

```bash
cd server
node test-connection.js
```

Or run the server directly - it will show connection errors if any:

```bash
npm start
```

---

## **Step 4: Start the Backend Server**

```bash
cd server
npm start
```

**Expected Output:**
```
Server running at http://localhost:5000
```

If you see connection errors, check:
- PostgreSQL service is running
- Database credentials in `.env` are correct
- Database `mealsdb` exists

---

## **Step 5: Test API Endpoints**

Open your browser or use curl:

1. **Health Check:**
   ```
   http://localhost:5000/
   ```
   Should return: `Fitness Tracker API 🚀`

2. **Get Food Items:**
   ```
   http://localhost:5000/foods
   ```
   Should return JSON array of food items

3. **Search Foods:**
   ```
   http://localhost:5000/foods?search=chicken
   ```
   Should return filtered food items

---

## **Step 6: Start Frontend**

In a **new terminal window**:

```bash
# From project root (not server folder)
npm start
```

Frontend will run on `http://localhost:3000` (or different port)

---

## **Troubleshooting**

### ❌ Error: "Connection refused"
**Solution:** PostgreSQL service is not running
- Windows: Open Services (`services.msc`), find "PostgreSQL", start it
- Or restart PostgreSQL from pgAdmin

### ❌ Error: "password authentication failed"
**Solution:** Wrong password in `.env` file
- Check your PostgreSQL password
- Try reconnecting in pgAdmin to verify password

### ❌ Error: "database 'mealsdb' does not exist"
**Solution:** Database not created yet
- Run: `CREATE DATABASE mealsdb;` in PostgreSQL

### ❌ Error: "relation 'food_items' does not exist"
**Solution:** Tables not created
- Run the `setup_database.sql` script you have

### ❌ Error: "ECONNREFUSED"
**Solution:** PostgreSQL not listening on that port
- Check if port 5432 is correct in `.env`
- Verify PostgreSQL is running

---

## **Quick Test Commands**

```bash
# Test database connection directly
psql -U postgres -d mealsdb -c "SELECT COUNT(*) FROM food_items;"

# Check if server port is in use
# Windows PowerShell:
netstat -ano | findstr :5000

# Start server in development (with auto-restart if you add nodemon)
npm start
```

---

## **Next Steps After Connection Works:**

✅ Backend running on `http://localhost:5000`  
✅ Database connected  
✅ Start frontend with `npm start` (from project root)  
✅ Test meal planner in browser  

Your application should now work! 🎉

