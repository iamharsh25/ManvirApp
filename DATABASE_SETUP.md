# Database Setup Guide

This app now uses **Neon Database** for storing categories and flash cards. Neon provides 3GB of free storage, perfect for your flash card images.

## 🚀 Quick Setup

### Step 1: Create Neon Database

1. Go to [https://console.neon.tech/](https://console.neon.tech/)
2. Sign up/Login with GitHub
3. Click "Create Project"
4. Choose a name (e.g., "flashcard-app")
5. Select a region close to you
6. Click "Create Project"

### Step 2: Get Database URL

1. In your Neon dashboard, go to "Connection Details"
2. Copy the "Connection String" (it looks like: `postgresql://username:password@hostname/database`)
3. Save this URL - you'll need it in the next step

### Step 3: Set Up Database

Run one of these commands with your database URL:

```bash
# Option 1: Set environment variable
export DATABASE_URL="your_database_url_here"
node setup-database.js

# Option 2: Pass URL directly
node setup-database.js "your_database_url_here"
```

### Step 4: Configure Environment

Create a `.env.local` file in your project root:

```env
DATABASE_URL=your_database_url_here
NEON_API_KEY=your_neon_api_key_here
```

### Step 5: Start the App

```bash
npm run dev
```

## 🎯 What This Gives You

### ✅ **Real File Uploads**

- Images are stored in the database
- No more manual file management
- Automatic image processing

### ✅ **Persistent Data**

- Categories and flash cards saved permanently
- No more localStorage limitations
- Data survives app restarts

### ✅ **Scalable Storage**

- 3GB free storage from Neon
- Can store thousands of images
- Easy to upgrade if needed

### ✅ **Admin Features**

- Add categories through the app
- Upload images directly
- Real-time updates

## 📊 Database Schema

### Categories Table

- `id` - Primary key
- `name` - Unique identifier (e.g., "car-logo")
- `display_name` - User-friendly name (e.g., "Car Logo")
- `description` - Category description
- `icon` - Emoji or icon
- `color` - Tailwind color class
- `folder` - Folder name for organization

### Flash Cards Table

- `id` - Primary key
- `name` - Flash card name (e.g., "BMW")
- `image_url` - Base64 encoded image
- `image_data` - Binary image data
- `category_id` - Foreign key to categories
- `created_at` - Timestamp
- `updated_at` - Timestamp

## 🔧 Troubleshooting

### Database Connection Issues

- Check your DATABASE_URL format
- Ensure your Neon project is active
- Verify the connection string is complete

### Setup Script Errors

- Make sure you have the latest dependencies: `npm install`
- Check that your database URL is accessible
- Try running the setup script again

### App Not Loading Categories

- Verify the database setup completed successfully
- Check browser console for errors
- Ensure environment variables are set correctly

## 🆘 Need Help?

1. **Check the setup script output** for specific error messages
2. **Verify your Neon dashboard** shows the tables were created
3. **Check browser console** for any JavaScript errors
4. **Make sure environment variables** are set correctly

## 🎉 Success!

Once everything is set up, you'll be able to:

- ✅ See categories loaded from the database
- ✅ Add new categories through the admin panel
- ✅ Upload images that are stored permanently
- ✅ Have all data persist between app sessions

Your flash card app is now powered by a real database! 🚀
