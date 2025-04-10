const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

// Define Lottie animations to download
const lottieFiles = [
  {
    name: 'fruit_animation.json',
    url: 'https://assets10.lottiefiles.com/packages/lf20_ydo1amjm.json',
    fallbackColor: '#ff6b6b' // Red
  },
  {
    name: 'vegetable_animation.json',
    url: 'https://assets7.lottiefiles.com/packages/lf20_dudmkdsj.json',
    fallbackColor: '#51cf66' // Green
  },
  {
    name: 'meat_animation.json',
    url: 'https://assets4.lottiefiles.com/packages/lf20_qs1edps7.json',
    fallbackColor: '#e64980' // Pink
  },
  {
    name: 'dairy_animation.json',
    url: 'https://assets9.lottiefiles.com/packages/lf20_FOrRqZ.json',
    fallbackColor: '#f8f9fa' // White
  },
  {
    name: 'grain_animation.json',
    url: 'https://assets2.lottiefiles.com/packages/lf20_phfzmvtt.json',
    fallbackColor: '#fcc419' // Yellow
  },
  {
    name: 'seafood_animation.json',
    url: 'https://assets7.lottiefiles.com/packages/lf20_jnu3k1m5.json',
    fallbackColor: '#74c0fc' // Blue
  },
  {
    name: 'spice_animation.json',
    url: 'https://assets4.lottiefiles.com/packages/lf20_k9wsvmf1.json',
    fallbackColor: '#ff922b' // Orange
  },
  {
    name: 'pasta_animation.json',
    url: 'https://assets2.lottiefiles.com/packages/lf20_ifaky8wr.json',
    fallbackColor: '#ffb300' // Amber
  },
  {
    name: 'default_food_animation.json',
    url: 'https://assets6.lottiefiles.com/packages/lf20_ysduybqg.json',
    fallbackColor: '#adb5bd' // Gray
  }
];

// Ensure the lottie directory exists
const lottieDir = path.join(process.cwd(), 'public', 'lottie');
if (!fs.existsSync(lottieDir)) {
  console.log('Creating lottie directory...');
  fs.mkdirSync(lottieDir, { recursive: true });
}

// Create a fallback Lottie JSON for when download fails
function createFallbackLottie(filename, color) {
  const fallbackPath = path.join(lottieDir, filename);
  console.log(`Creating fallback Lottie for ${filename} with color ${color}...`);
  
  // Simple pulsating circle animation as fallback
  const fallbackLottie = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Fallback Animation",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Circle",
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [100, 100, 0], ix: 2, l: 2 },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.5, 0.5, 0.5], y: [1, 1, 1] },
                o: { x: [0.5, 0.5, 0.5], y: [0, 0, 0] },
                t: 0,
                s: [100, 100, 100]
              },
              {
                i: { x: [0.5, 0.5, 0.5], y: [1, 1, 1] },
                o: { x: [0.5, 0.5, 0.5], y: [0, 0, 0] },
                t: 30,
                s: [120, 120, 100]
              },
              { t: 60, s: [100, 100, 100] }
            ],
            ix: 6,
            l: 2
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                d: 1,
                ty: "el",
                s: { a: 0, k: [80, 80], ix: 2 },
                p: { a: 0, k: [0, 0], ix: 3 },
                nm: "Ellipse Path 1",
                mn: "ADBE Vector Shape - Ellipse",
                hd: false
              },
              {
                ty: "fl",
                c: {
                  a: 0,
                  k: hexToRgb(color),
                  ix: 4
                },
                o: { a: 0, k: 100, ix: 5 },
                r: 1,
                bm: 0,
                nm: "Fill",
                mn: "ADBE Vector Graphic - Fill",
                hd: false
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: "Transform"
              }
            ],
            nm: "Ellipse 1",
            np: 3,
            cix: 2,
            bm: 0,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false
          }
        ],
        ip: 0,
        op: 60,
        st: 0,
        bm: 0
      }
    ],
    markers: []
  };
  
  // Write fallback JSON to file
  fs.writeFileSync(fallbackPath, JSON.stringify(fallbackLottie, null, 2));
  
  console.log(`Created fallback Lottie for ${filename}`);
}

// Helper function to convert hex color to RGB array for Lottie
function hexToRgb(hex) {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  
  return [r, g, b, 1];
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

// Main function to download all Lottie animations
async function downloadLottieAnimations() {
  console.log('Starting Lottie animation downloads...');
  
  for (const lottie of lottieFiles) {
    const outputPath = path.join(lottieDir, lottie.name);
    
    // Skip if the file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`${lottie.name} already exists, skipping...`);
      continue;
    }
    
    try {
      await downloadFile(lottie.url, outputPath);
    } catch (error) {
      console.error(`Failed to download ${lottie.name}:`, error.message);
      createFallbackLottie(lottie.name, lottie.fallbackColor);
    }
  }
  
  console.log('Lottie animation download process complete!');
}

// Run the download process
downloadLottieAnimations().catch(err => {
  console.error('Error in download process:', err);
  process.exit(1);
}); 