// Database configuration for Neon
// Replace this with your actual Neon database URL
const DATABASE_URL = "postgresql://neondb_owner:npg_NrTpqoW5FuY8@ep-sparkling-feather-a7df9xcr-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const DATABASE_CONFIG = {
  DATABASE_URL: DATABASE_URL,
  NEON_API_KEY: "your_neon_api_key_here",
};

// Database connection
export const getDatabaseUrl = () => {
  if (
    !DATABASE_CONFIG.DATABASE_URL ||
    DATABASE_CONFIG.DATABASE_URL === "your_neon_database_url_here"
  ) {
    throw new Error(`
Please set your DATABASE_URL in the database.ts file:

1. Go to https://console.neon.tech/
2. Create a new project
3. Copy your connection string
4. Replace "your_neon_database_url_here" in src/config/database.ts
5. It should look like: postgresql://username:password@hostname/database
    `);
  }
  return DATABASE_CONFIG.DATABASE_URL;
};
