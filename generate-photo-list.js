// Auto-generate photo list from public/ folder
// Run this with: node generate-photo-list.js
// This creates a photos.json file that the browser can load automatically!

const fs = require('fs');
const path = require('path');

const PHOTOS_FOLDER = './public/';
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const OUTPUT_FILE = './photos.json';

function generatePhotoList() {
  try {
    // Check if public folder exists
    if (!fs.existsSync(PHOTOS_FOLDER)) {
      console.error('❌ Error: public/ folder not found!');
      console.log('📁 Please create a public/ folder and add your photos there');
      return;
    }

    // Read all files in the public folder
    const files = fs.readdirSync(PHOTOS_FOLDER);
    
    // Filter only image files
    const photoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    });
    
    // Sort files for consistent ordering
    photoFiles.sort();
    
    // Generate JSON file
    const photoData = {
      folder: "public/",
      photos: photoFiles,
      count: photoFiles.length,
      generated: new Date().toISOString()
    };
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photoData, null, 2));
    
    console.log('✅ Photo list generated successfully!');
    console.log(`📸 Found ${photoFiles.length} photos:`);
    photoFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    console.log(`📄 Generated: ${OUTPUT_FILE}`);
    console.log('🚀 Your website will now automatically load all photos!');
    
  } catch (error) {
    console.error('❌ Error generating photo list:');
    console.error(error.message);
  }
}

generatePhotoList(); 