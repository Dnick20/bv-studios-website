#!/bin/bash

# Image Optimizer Script for BV Studios Website
# This script optimizes images for web use

echo "🚀 BV Studios Image Optimizer"
echo "=============================="

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found - using automated optimization"
    USE_IMAGEMAGICK=true
else
    echo "⚠️  ImageMagick not found - will provide manual instructions"
    USE_IMAGEMAGICK=false
fi

# Create optimized directory structure
mkdir -p public/images/optimized/{weddings,commercial,team,portfolio}

echo ""
echo "📁 Creating optimized image directories..."

# Function to optimize image with ImageMagick
optimize_with_imagemagick() {
    local input=$1
    local output=$2
    local width=$3
    local height=$4
    local quality=$5
    
    if [ -f "$input" ]; then
        echo "🔄 Optimizing: $input"
        convert "$input" -resize "${width}x${height}^" -gravity center -crop "${width}x${height}+0+0" -quality "$quality" "$output"
        
        # Get file sizes
        original_size=$(du -k "$input" | cut -f1)
        optimized_size=$(du -k "$output" | cut -f1)
        savings=$((original_size - optimized_size))
        savings_percent=$((savings * 100 / original_size))
        
        echo "✅ Optimized: $output"
        echo "💾 Size: ${original_size}KB → ${optimized_size}KB (${savings_percent}% savings)"
        echo ""
    else
        echo "❌ File not found: $input"
        echo ""
    fi
}

# Function to provide manual optimization instructions
provide_manual_instructions() {
    local input=$1
    local output=$2
    local width=$3
    local height=$4
    
    if [ -f "$input" ]; then
        echo "📝 Manual optimization for: $input"
        echo "   Target: ${width}x${height}px"
        echo "   Output: $output"
        echo "   Tools: Use online tools like TinyPNG, Squoosh.app, or Photoshop"
        echo ""
    fi
}

# Wedding thumbnails (400x225 - 16:9 ratio)
echo "💒 Optimizing wedding thumbnails..."
if [ "$USE_IMAGEMAGICK" = true ]; then
    optimize_with_imagemagick "public/images/weddings/christian-hailee.jpg" "public/images/optimized/weddings/christian-hailee.webp" 400 225 80
    optimize_with_imagemagick "public/images/weddings/kaitlin-andy.jpg" "public/images/optimized/weddings/kaitlin-andy.webp" 400 225 80
    optimize_with_imagemagick "public/images/weddings/niki-matt.jpg" "public/images/optimized/weddings/niki-matt.webp" 400 225 80
    optimize_with_imagemagick "public/images/weddings/sarah-david.jpg" "public/images/optimized/weddings/sarah-david.webp" 400 225 80
else
    provide_manual_instructions "public/images/weddings/christian-hailee.jpg" "public/images/optimized/weddings/christian-hailee.webp" 400 225
    provide_manual_instructions "public/images/weddings/kaitlin-andy.jpg" "public/images/optimized/weddings/kaitlin-andy.webp" 400 225
    provide_manual_instructions "public/images/weddings/niki-matt.jpg" "public/images/optimized/weddings/niki-matt.webp" 400 225
    provide_manual_instructions "public/images/weddings/sarah-david.jpg" "public/images/optimized/weddings/sarah-david.webp" 400 225
fi

# Commercial thumbnails (400x225 - 16:9 ratio)
echo "🎬 Optimizing commercial thumbnails..."
if [ "$USE_IMAGEMAGICK" = true ]; then
    optimize_with_imagemagick "public/images/commercial/lodge.png" "public/images/optimized/commercial/lodge.webp" 400 225 80
    optimize_with_imagemagick "public/images/commercial/stuttgart.png" "public/images/optimized/commercial/stuttgart.webp" 400 225 80
    optimize_with_imagemagick "public/images/commercial/tim-regus.jpg" "public/images/optimized/commercial/tim-regus.webp" 400 225 80
else
    provide_manual_instructions "public/images/commercial/lodge.png" "public/images/optimized/commercial/lodge.webp" 400 225
    provide_manual_instructions "public/images/commercial/stuttgart.png" "public/images/optimized/commercial/stuttgart.webp" 400 225
    provide_manual_instructions "public/images/commercial/tim-regus.jpg" "public/images/optimized/commercial/tim-regus.webp" 400 225
fi

# Team photos (300x300 - square)
echo "👥 Optimizing team photos..."
if [ "$USE_IMAGEMAGICK" = true ]; then
    optimize_with_imagemagick "public/media/images/team/Dominic.png" "public/images/optimized/team/dominic.webp" 300 300 80
    optimize_with_imagemagick "public/media/images/team/Deisy.png" "public/images/optimized/team/deisy.webp" 300 300 80
else
    provide_manual_instructions "public/media/images/team/Dominic.png" "public/images/optimized/team/dominic.webp" 300 300
    provide_manual_instructions "public/media/images/team/Deisy.png" "public/images/optimized/team/deisy.webp" 300 300
fi

# Portfolio images (800x450 - 16:9 ratio)
echo "🎨 Optimizing portfolio images..."
if [ "$USE_IMAGEMAGICK" = true ]; then
    optimize_with_imagemagick "public/media/images/portfolio/hero.jpg" "public/images/optimized/portfolio/hero.webp" 800 450 80
    optimize_with_imagemagick "public/media/images/weddings/hero.jpg" "public/images/optimized/portfolio/wedding-hero.webp" 800 450 80
else
    provide_manual_instructions "public/media/images/portfolio/hero.jpg" "public/images/optimized/portfolio/hero.webp" 800 450
    provide_manual_instructions "public/media/images/weddings/hero.jpg" "public/images/optimized/portfolio/wedding-hero.webp" 800 450
fi

echo ""
echo "📊 Optimization Summary:"
echo "========================"

# Count files and calculate sizes
if [ "$USE_IMAGEMAGICK" = true ]; then
    optimized_count=$(find public/images/optimized -name "*.webp" | wc -l)
    echo "✅ Successfully optimized: $optimized_count images"
    
    # Calculate total sizes
    original_size=$(du -sk public/images public/media/images 2>/dev/null | awk '{sum += $1} END {print sum}')
    optimized_size=$(du -sk public/images/optimized 2>/dev/null | awk '{sum += $1} END {print sum}')
    
    if [ "$original_size" -gt 0 ] && [ "$optimized_size" -gt 0 ]; then
        savings=$((original_size - optimized_size))
        savings_percent=$((savings * 100 / original_size))
        echo "📦 Original size: ${original_size}KB"
        echo "📦 Optimized size: ${optimized_size}KB"
        echo "💾 Total savings: ${savings_percent}%"
    fi
else
    echo "📝 Manual optimization required"
    echo "💡 Use online tools like:"
    echo "   - TinyPNG (tinypng.com)"
    echo "   - Squoosh.app (squoosh.app)"
    echo "   - ImageOptim (imageoptim.com)"
fi

echo ""
echo "🔄 Generating updated mediaUrls.ts..."

# Create optimized mediaUrls
cat > constants/mediaUrls-optimized.ts << 'EOF'
// Media URLs configuration - Optimized for web

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
};
EOF

echo "✅ Generated: constants/mediaUrls-optimized.ts"
echo ""
echo "📋 Next Steps:"
echo "==============="
echo "1. If using manual optimization:"
echo "   - Use online tools to optimize images"
echo "   - Save optimized images to public/images/optimized/"
echo "   - Convert to WebP format for best compression"
echo ""
echo "2. Replace mediaUrls.ts with the optimized version:"
echo "   cp constants/mediaUrls-optimized.ts constants/mediaUrls.ts"
echo ""
echo "3. Test the website to ensure images load correctly"
echo ""
echo "🎯 Target file sizes:"
echo "   - Thumbnails: < 100KB each"
echo "   - Team photos: < 150KB each"
echo "   - Portfolio: < 200KB each"
echo ""
echo "✨ Your website will load much faster with optimized images!" 