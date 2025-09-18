# Image Upload Instructions

## How to Add Images to Flash Card Categories

Since the browser cannot directly write files to the `public` folder for security reasons, here's how to add images:

### Method 1: Manual File Addition (Recommended)

1. **Navigate to the category folder** in your file system:

   ```
   /Volumes/Personal/ManvirApp/public/Resources/FlashCards/
   ├── Car Logo/          ← Add images here
   ├── Mood/              ← Add images here
   └── Weather/           ← Add images here
   ```

2. **Add your images** to the appropriate folder

3. **Name your images** using this format:

   - Use lowercase letters and numbers only
   - Replace spaces with underscores
   - Examples: `bmw_logo.png`, `happy_face.jpg`, `sunny_day.png`

4. **Update the imageLoader.ts** file to include your new images:
   ```typescript
   DYNAMIC_CATEGORIES = {
     "Car Logo": ["bmw_logo.png", "mercedes_logo.png", "audi_logo.png"],
     Mood: ["angry.png", "excited.png", "happy.png", "sad.png"],
     Weather: ["cloudy.png", "rainy.png", "snowy.png", "sunny.png"],
   };
   ```

### Method 2: Using Admin Panel (Simulated)

1. **Click "Add More Categories"** in the Flash Card section
2. **Enter admin password**: `admin`
3. **Choose "New Flash Card"**
4. **Select category** and **enter name**
5. **Upload image** - the system will show you the expected filename
6. **Manually save** the image to the correct folder with the suggested name

### File Naming Rules

- ✅ `bmw_logo.png` - Good
- ✅ `happy_face.jpg` - Good
- ✅ `sunny_day.png` - Good
- ❌ `BMW Logo.png` - Bad (uppercase, spaces)
- ❌ `happy-face.jpg` - Bad (hyphens)
- ❌ `sunny day.png` - Bad (spaces)

### Supported Image Formats

- `.png` (recommended)
- `.jpg` / `.jpeg`
- `.gif`
- `.webp`

### Example Workflow

1. You want to add a "BMW" flash card to "Car Logo" category
2. Name it: `bmw_logo.png`
3. Save it to: `public/Resources/FlashCards/Car Logo/bmw_logo.png`
4. Update the imageLoader.ts file to include `"bmw_logo.png"` in the Car Logo array
5. Refresh the app - the new flash card will appear!

## Current Categories

- **Car Logo** (0 images) - Empty folder, ready for images
- **Mood** (4 images) - angry, excited, happy, sad
- **Weather** (4 images) - cloudy, rainy, snowy, sunny
