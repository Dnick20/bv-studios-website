const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Output directory for optimized images
  outputDir: 'public/images/optimized',
  
  // Image quality settings
  quality: 80,
  
  // Target dimensions for different image types
  dimensions: {
    thumbnail: { width: 400, height: 225 }, // 16:9 aspect ratio
    hero: { width: 1200, height: 675 },     // 16:9 aspect ratio
    team: { width: 300, height: 300 },      // Square for team photos
    portfolio: { width: 800, height: 450 }   // 16:9 for portfolio
  },
  
  // File size targets (in KB)
  maxSizes: {
    thumbnail: 100,    // 100KB max for thumbnails
    hero: 300,         // 300KB max for hero images
    team: 150,         // 150KB max for team photos
    portfolio: 200     // 200KB max for portfolio images
  }
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Create subdirectories
const subdirs = ['weddings', 'commercial', 'team', 'portfolio'];
subdirs.forEach(dir => {
  const fullPath = path.join(config.outputDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    console.log(`Optimizing: ${inputPath}`);
    
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Determine target dimensions based on image type
    let targetWidth = options.width || config.dimensions.thumbnail.width;
    let targetHeight = options.height || config.dimensions.thumbnail.height;
    
    // Maintain aspect ratio if only one dimension is specified
    if (options.width && !options.height) {
      targetHeight = Math.round((options.width * metadata.height) / metadata.width);
    } else if (options.height && !options.width) {
      targetWidth = Math.round((options.height * metadata.width) / metadata.height);
    }
    
    // Resize and optimize
    await image
      .resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ 
        quality: config.quality,
        effort: 6
      })
      .toFile(outputPath);
    
    // Get file size
    const stats = fs.statSync(outputPath);
    const fileSizeKB = Math.round(stats.size / 1024);
    
    console.log(`✅ Optimized: ${outputPath} (${fileSizeKB}KB)`);
    
    return {
      success: true,
      size: fileSizeKB,
      dimensions: `${targetWidth}x${targetHeight}`
    };
    
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function processImages() {
  console.log('🚀 Starting image optimization...\n');
  
  const images = [
    // Wedding thumbnails
    {
      input: 'public/images/weddings/christian-hailee.jpg',
      output: 'public/images/optimized/weddings/christian-hailee.webp',
      type: 'thumbnail'
    },
    {
      input: 'public/images/weddings/kaitlin-andy.jpg',
      output: 'public/images/optimized/weddings/kaitlin-andy.webp',
      type: 'thumbnail'
    },
    {
      input: 'public/images/weddings/niki-matt.jpg',
      output: 'public/images/optimized/weddings/niki-matt.webp',
      type: 'thumbnail'
    },
    {
      input: 'public/images/weddings/sarah-david.jpg',
      output: 'public/images/optimized/weddings/sarah-david.webp',
      type: 'thumbnail'
    },
    
    // Commercial thumbnails
    {
      input: 'public/images/commercial/lodge.png',
      output: 'public/images/optimized/commercial/lodge.webp',
      type: 'thumbnail'
    },
    {
      input: 'public/images/commercial/stuttgart.png',
      output: 'public/images/optimized/commercial/stuttgart.webp',
      type: 'thumbnail'
    },
    {
      input: 'public/images/commercial/tim-regus.jpg',
      output: 'public/images/optimized/commercial/tim-regus.webp',
      type: 'thumbnail'
    },
    
    // Team photos
    {
      input: 'public/media/images/team/Dominic.png',
      output: 'public/images/optimized/team/dominic.webp',
      type: 'team',
      width: 300,
      height: 300
    },
    {
      input: 'public/media/images/team/Deisy.png',
      output: 'public/images/optimized/team/deisy.webp',
      type: 'team',
      width: 300,
      height: 300
    },
    
    // Portfolio images
    {
      input: 'public/media/images/portfolio/hero.jpg',
      output: 'public/images/optimized/portfolio/hero.webp',
      type: 'portfolio',
      width: 800,
      height: 450
    },
    {
      input: 'public/media/images/weddings/hero.jpg',
      output: 'public/images/optimized/portfolio/wedding-hero.webp',
      type: 'portfolio',
      width: 800,
      height: 450
    }
  ];
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const image of images) {
    if (fs.existsSync(image.input)) {
      // Get original file size
      const originalStats = fs.statSync(image.input);
      const originalSizeKB = Math.round(originalStats.size / 1024);
      totalOriginalSize += originalSizeKB;
      
      console.log(`📁 Original: ${image.input} (${originalSizeKB}KB)`);
      
      // Optimize image
      const result = await optimizeImage(
        image.input, 
        image.output, 
        { width: image.width, height: image.height }
      );
      
      if (result.success) {
        successCount++;
        totalOptimizedSize += result.size;
        const savings = Math.round(((originalSizeKB - result.size) / originalSizeKB) * 100);
        console.log(`💾 Savings: ${savings}% (${originalSizeKB}KB → ${result.size}KB)\n`);
      } else {
        errorCount++;
        console.log(`❌ Failed to optimize\n`);
      }
    } else {
      console.log(`⚠️  File not found: ${image.input}\n`);
    }
  }
  
  // Summary
  console.log('📊 Optimization Summary:');
  console.log(`✅ Successfully optimized: ${successCount} images`);
  console.log(`❌ Failed: ${errorCount} images`);
  console.log(`📦 Total original size: ${Math.round(totalOriginalSize / 1024)}MB`);
  console.log(`📦 Total optimized size: ${Math.round(totalOptimizedSize / 1024)}MB`);
  console.log(`💾 Total savings: ${Math.round(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100)}%`);
  
  // Generate updated mediaUrls
  await generateUpdatedMediaUrls();
}

async function generateUpdatedMediaUrls() {
  console.log('\n🔄 Generating updated mediaUrls.ts...');
  
  const updatedUrls = `// Media URLs configuration - Optimized for web

export const mediaUrls = {
  images: {
    team: {
      dominic: "/images/optimized/team/dominic.webp", // Dominic's photo
      deisy: "/images/optimized/team/deisy.webp", // Deisy's photo
    },
    weddings: {
      // Wedding thumbnails - optimized for web
      christianHailee: "/images/optimized/weddings/christian-hailee.webp", // Christian & Hailee (couple in fall setting)
      kaitlinAndy: "/images/optimized/weddings/kaitlin-andy.webp", // Kaitlin & Andy (getting ready)
      nikiMatt: "/images/optimized/weddings/niki-matt.webp", // Niki & Matt (couple under green leaves)
      sarahDavid: "/images/optimized/weddings/sarah-david.webp", // Sarah & David (dress in barn)
    },
    commercial: {
      // Commercial thumbnails - optimized for web
      lodge: "/images/optimized/commercial/lodge.webp", // The Lodge (exterior building with flags)
      stuttgart: "/images/optimized/commercial/stuttgart.webp", // Stuttgart (red classic car interior)
      timRegus: "/images/optimized/commercial/tim-regus.webp", // Tim Regus (modern living room with blue couch)
    },
    portfolio: {
      hero: "/images/optimized/portfolio/hero.webp", // Portfolio hero image
      weddingHero: "/images/optimized/portfolio/wedding-hero.webp", // Wedding hero image
    },
  },
  videos: {
    commercial: {
      lodge: "https://www.youtube.com/embed/qaGx_Fa9ufE", // The Lodge at Logan video
      stuttgart: "https://www.youtube.com/embed/isO7D5PLyRo", // Stuttgart Motors video
      timRegus: "https://www.youtube.com/embed/XqX9JotLUb0", // Tim Regus video
    },
    weddings: {
      christianHailee: "https://www.youtube.com/embed/nRq4EruDnTA", // Christian & Hailee video
      kaitlinAndy: "https://www.youtube.com/embed/ad7ZE_e42KE", // Kaitlin & Andy video
      nikiMatt: "https://www.youtube.com/embed/qPVHKmsbvYo", // Niki & Matt video
      sarahDavid: "https://www.youtube.com/embed/7KFEwpjIh8k", // Sarah & David video
    },
  },
};`;

  fs.writeFileSync('constants/mediaUrls-optimized.ts', updatedUrls);
  console.log('✅ Generated: constants/mediaUrls-optimized.ts');
  console.log('📝 You can replace the current mediaUrls.ts with this optimized version');
}

// Run the optimization
processImages().catch(console.error); 