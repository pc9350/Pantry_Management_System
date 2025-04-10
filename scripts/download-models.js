const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

// Define model files to download and their sources
const modelFiles = [
  {
    name: 'apple.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/apple/model.gltf',
    fallbackColor: '#ff0000' // Red
  },
  {
    name: 'broccoli.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/broccoli/model.gltf',
    fallbackColor: '#008000' // Green
  },
  {
    name: 'chicken.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/chicken/model.gltf',
    fallbackColor: '#f5deb3' // Wheat
  },
  {
    name: 'cheese.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/cheese/model.gltf',
    fallbackColor: '#ffff00' // Yellow
  },
  {
    name: 'bread.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/bread/model.gltf',
    fallbackColor: '#d2b48c' // Tan
  },
  {
    name: 'salmon.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/salmon/model.gltf',
    fallbackColor: '#fa8072' // Salmon
  },
  {
    name: 'cinnamon.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/cinnamon/model.gltf',
    fallbackColor: '#d2691e' // Chocolate
  },
  {
    name: 'pasta.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/pasta/model.gltf',
    fallbackColor: '#ffd700' // Gold
  }
];

// Ensure the models directory exists
const modelsDir = path.join(process.cwd(), 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  console.log('Creating models directory...');
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Create a placeholder GLB file if download fails
function createPlaceholderFile(filename, color) {
  const placeholderPath = path.join(modelsDir, filename);
  console.log(`Creating placeholder for ${filename} with color ${color}...`);
  
  // We'll just create an empty file as a placeholder
  // In a real implementation, you might want to create a simple colored cube GLB
  fs.writeFileSync(placeholderPath, `// Placeholder for ${filename} - please replace with a real model\n// This file was created because automatic download failed`);
  
  console.log(`Created placeholder for ${filename}`);
}

// Download a file from a URL
async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      pipeline(response, file)
        .then(() => {
          console.log(`Successfully downloaded to ${outputPath}`);
          resolve();
        })
        .catch(err => {
          console.error(`Error downloading ${url}:`, err);
          reject(err);
        });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file if there was an error
      console.error(`Error downloading ${url}:`, err);
      reject(err);
    });
  });
}

// Main function to download all models
async function downloadModels() {
  console.log('Starting model downloads...');
  
  for (const model of modelFiles) {
    const outputPath = path.join(modelsDir, model.name);
    
    // Skip if the file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`${model.name} already exists, skipping...`);
      continue;
    }
    
    try {
      await downloadFile(model.url, outputPath);
    } catch (error) {
      console.error(`Failed to download ${model.name}:`, error.message);
      createPlaceholderFile(model.name, model.fallbackColor);
    }
  }
  
  console.log('Model download process complete!');
}

// Run the download process
downloadModels().catch(err => {
  console.error('Error in download process:', err);
  process.exit(1);
}); 