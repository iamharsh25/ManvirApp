# Complete Database Setup Guide

This guide will help you set up Neon database with proper tables for Categories and FlashCards, and enable real image uploads.

## 🚀 Step 1: Create Neon Database

### 1.1 Sign Up for Neon

1. Go to https://console.neon.tech/
2. Click "Sign up" or "Log in"
3. Choose "Continue with GitHub"
4. Authorize Neon to access your GitHub account

### 1.2 Create New Project

1. Click "Create Project"
2. Enter project name: `flashcard-app`
3. Choose a region close to you (e.g., "US East")
4. Click "Create Project"
5. Wait for the project to be created (1-2 minutes)

### 1.3 Get Your Database URL

1. In your Neon dashboard, find "Connection Details"
2. Copy the "Connection String" (it looks like):
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```
3. Save this URL - you'll need it in the next step

## 🔧 Step 2: Configure Your App

### 2.1 Update Database Configuration

1. Open `src/config/database.ts`
2. Find this line:
   ```typescript
   const DATABASE_URL = "your_neon_database_url_here";
   ```
3. Replace `"your_neon_database_url_here"` with your actual connection string:
   ```typescript
   const DATABASE_URL =
     "postgresql://username:password@hostname/database?sslmode=require";
   ```

### 2.2 Test Database Connection

1. Open terminal in your project folder
2. Run the setup script:
   ```bash
   npm run setup-db
   ```
3. You should see:
   ```
   🚀 Setting up Neon Database for Flash Card App...
   📊 Creating database tables...
   ✅ Categories table created
   ✅ Flash cards table created
   ✅ Database indexes created
   📝 Inserting default categories...
   ✅ Default categories inserted
   🎉 Database setup completed successfully!
   ```

## 📊 Step 3: Database Tables Created

The setup script creates these tables:

### Categories Table

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(100),
  folder VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### FlashCards Table

```sql
CREATE TABLE flash_cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  image_data BYTEA,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Step 4: Test Your App

### 4.1 Start the App

```bash
npm run dev
```

### 4.2 Open Your Browser

- Go to: http://localhost:5173/ManvirApp/
- You should see your app working with database!

### 4.3 Test Categories

1. Click "Flash Cards"
2. You should see 3 categories loaded from database:
   - Car Logo (0 cards)
   - Mood (0 cards)
   - Weather (0 cards)

### 4.4 Test Image Upload

1. Click "Add More Categories"
2. Enter password: `admin`
3. Choose "New Flash Card"
4. Select a category (e.g., "Car Logo")
5. Enter name: "BMW"
6. Upload an image
7. Click "Upload & Save"

The image will be:

- ✅ Stored in the database as base64
- ✅ Saved permanently
- ✅ Available immediately
- ✅ Persist across page refreshes

## 🔍 Step 5: Verify Database

### 5.1 Check Your Neon Dashboard

1. Go back to https://console.neon.tech/
2. Click on your project
3. Go to "Tables" section
4. You should see:
   - `categories` table with 3 default categories
   - `flash_cards` table (empty initially)

### 5.2 Add Some Test Data

1. Use the admin panel to add a few flash cards
2. Check your Neon dashboard to see the data being added
3. Refresh your app - data should persist!

## ✅ Success!

You now have:

- ✅ **Real Database Storage** - 3GB free from Neon
- ✅ **Persistent Data** - survives app restarts
- ✅ **Image Upload** - images stored in database
- ✅ **Admin Panel** - add categories and flash cards
- ✅ **Scalable System** - easy to add more features

## 🎉 Your Flash Card App is Complete!

Features working:

- ✅ Name game for unlocking
- ✅ Session management (1-hour timeout)
- ✅ Category browsing from database
- ✅ Flash card game with database images
- ✅ Admin panel for adding content
- ✅ Real image uploads to database

Enjoy your fully functional flash card app! 🚀
