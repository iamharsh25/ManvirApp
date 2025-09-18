#!/usr/bin/env node

/**
 * Database URL Setup Helper
 * This script helps you set up your Neon database URL
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

async function setupDatabaseUrl() {
  console.log("🔧 Database URL Setup Helper\n");

  // Get database URL from user
  const databaseUrl = process.argv[2];

  if (!databaseUrl) {
    console.log("❌ Please provide your Neon database URL:");
    console.log('   Run: node setup-database-url.js "your_database_url_here"');
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
    // Read the current database config file
    const configPath = join(process.cwd(), "src", "config", "database.ts");
    let configContent = readFileSync(configPath, "utf8");

    // Replace the placeholder URL
    configContent = configContent.replace(
      'const DATABASE_URL = "your_neon_database_url_here";',
      `const DATABASE_URL = "${databaseUrl}";`
    );

    // Write the updated config
    writeFileSync(configPath, configContent);

    console.log("✅ Database URL updated successfully!");
    console.log("📁 Updated file: src/config/database.ts");
    console.log("\n🚀 Next steps:");
    console.log("   1. Run: npm run setup-db");
    console.log("   2. Run: npm run dev");
    console.log("   3. Open your app and test the features!");
  } catch (error) {
    console.error("❌ Error updating database URL:", error.message);
    process.exit(1);
  }
}

setupDatabaseUrl();
