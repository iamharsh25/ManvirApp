import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // If deploying to GitHub Pages under /kid-games/, uncomment:
  // base: "/kid-games/",
  base: "/ManvirApp/",
});
