#!/usr/bin/env node

/**
 * Database Setup Script for Neon Database
 *
 * This script helps you set up your Neon database for the Flash Card app.
 *
 * Steps:
 * 1. Go to https://console.neon.tech/
 * 2. Create a new project
 * 3. Get your database URL and API key
 * 4. Run this script with your credentials
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

async function setupDatabase() {
  console.log("🚀 Setting up Neon Database for Flash Card App...\n");

  // Try to read database URL from config file first
  let databaseUrl = process.env.DATABASE_URL || process.argv[2];

  if (!databaseUrl || databaseUrl === "your_neon_database_url_here") {
    try {
      // Read from config file
      const configPath = join(process.cwd(), "src", "config", "database.ts");
      const configContent = readFileSync(configPath, "utf8");

      // Extract DATABASE_URL from config file
      const urlMatch = configContent.match(/const DATABASE_URL = "([^"]+)";/);
      if (
        urlMatch &&
        urlMatch[1] &&
        urlMatch[1] !== "your_neon_database_url_here"
      ) {
        databaseUrl = urlMatch[1];
        console.log("📁 Using database URL from config file");
      }
    } catch (error) {
      // Config file not found or couldn't read, continue with original logic
    }
  }

  if (!databaseUrl || databaseUrl === "your_neon_database_url_here") {
    console.log("❌ Please provide your Neon database URL:");
    console.log("   Option 1: Set DATABASE_URL environment variable");
    console.log(
      '   Option 2: Run: node setup-database.js "your_database_url_here"'
    );
    console.log("   Option 3: Update src/config/database.ts with your URL");
    console.log("\n📖 How to get your database URL:");
    console.log("   1. Go to https://console.neon.tech/");
    console.log("   2. Create a new project");
    console.log("   3. Copy the connection string from your dashboard");
    console.log(
      "   4. It should look like: postgresql://username:password@hostname/database"
    );
    process.exit(1);
  }

  try {
    const sql = neon(databaseUrl);

    console.log("📊 Creating database tables...");

    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        display_name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(100),
        folder VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Categories table created");

    // Create flash_cards table
    await sql`
      CREATE TABLE IF NOT EXISTS flash_cards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        image_data BYTEA,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Flash cards table created");

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_flash_cards_category_id ON flash_cards(category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name)`;
    console.log("✅ Database indexes created");

    // Insert default categories
    console.log("📝 Inserting default categories...");

    const defaultCategories = [
      {
        name: "car-logo",
        display_name: "Car Logo",
        description: "Learn about different car brands",
        icon: "🚗",
        color: "from-blue-500 to-blue-700",
        folder: "Car Logo",
      },
      {
        name: "mood",
        display_name: "Mood",
        description: "Express your feelings",
        icon: "😊",
        color: "from-yellow-500 to-orange-500",
        folder: "Mood",
      },
      {
        name: "weather",
        display_name: "Weather",
        description: "Learn about weather conditions",
        icon: "☀️",
        color: "from-cyan-500 to-blue-500",
        folder: "Weather",
      },
    ];

    for (const category of defaultCategories) {
      await sql`
        INSERT INTO categories (name, display_name, description, icon, color, folder)
        VALUES (${category.name}, ${category.display_name}, ${category.description}, ${category.icon}, ${category.color}, ${category.folder})
        ON CONFLICT (name) DO NOTHING
      `;
    }
    console.log("✅ Default categories inserted");

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("   1. Set your DATABASE_URL in your environment variables");
    console.log("   2. Run: npm run dev");
    console.log("   3. Open your app and start adding flash cards!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("   - Make sure your database URL is correct");
    console.log("   - Check that your Neon project is active");
    console.log("   - Verify your connection string format");
    process.exit(1);
  }
}

setupDatabase();
