import { neon } from "@neondatabase/serverless";
import { getDatabaseUrl } from "../config/database";

// Initialize Neon client
const sql = neon(getDatabaseUrl());

// Database schema
export const createTables = async () => {
  try {
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

    // Create flash_cards table
    await sql`
      CREATE TABLE IF NOT EXISTS flash_cards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        image_data BYTEA, -- Store image as binary data
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_flash_cards_category_id ON flash_cards(category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name)`;

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating database tables:", error);
    throw error;
  }
};

// Initialize database
export const initializeDatabase = async () => {
  try {
    await createTables();

    // Insert default categories if they don't exist
    await insertDefaultCategories();
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Insert default categories
const insertDefaultCategories = async () => {
  try {
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

    console.log("Default categories inserted successfully");
  } catch (error) {
    console.error("Error inserting default categories:", error);
  }
};

export { sql };
