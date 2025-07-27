#!/bin/bash

echo "🖼️ Converting wedding image to .webp format..."
echo ""

# Check if input file exists
if [ ! -f "input-wedding-image.jpg" ]; then
    echo "❌ Input file 'input-wedding-image.jpg' not found!"
    echo ""
    echo "📋 To convert your wedding image:"
    echo "1. Save the wedding image as 'input-wedding-image.jpg' in this directory"
    echo "2. Run this script again: ./scripts/convert-wedding-image.sh"
    echo ""
    echo "💡 Alternative: Use an online converter:"
    echo "- Go to https://convertio.co/jpg-webp/"
    echo "- Upload your wedding image"
    echo "- Download the .webp file"
    echo "- Save as: public/images/optimized/weddings/wedding-highlights-thumbnail.webp"
    echo ""
    exit 1
fi

# Create the optimized directory if it doesn't exist
mkdir -p public/images/optimized/weddings

# Check if ImageMagick is available
if command -v magick &> /dev/null; then
    echo "✅ ImageMagick found - converting image..."
    
    # Convert the image to .webp with optimization
    magick input-wedding-image.jpg \
        -resize 800x600^ \
        -gravity center \
        -extent 800x600 \
        -quality 85 \
        -strip \
        public/images/portfolio/wedding-highlights.webp
    
    echo "✅ Image converted successfully!"
    echo "📁 Saved as: public/images/portfolio/wedding-highlights.webp"
    
elif command -v convert &> /dev/null; then
    echo "✅ ImageMagick (legacy) found - converting image..."
    
    # Convert the image to .webp with optimization
    convert input-wedding-image.jpg \
        -resize 800x600^ \
        -gravity center \
        -extent 800x600 \
        -quality 85 \
        -strip \
        public/images/portfolio/wedding-highlights.webp
    
    echo "✅ Image converted successfully!"
    echo "📁 Saved as: public/images/portfolio/wedding-highlights.webp"
    
else
    echo "⚠️ ImageMagick not found. Please install it or convert manually:"
    echo ""
    echo "Install ImageMagick:"
    echo "- macOS: brew install imagemagick"
    echo "- Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "Or use an online converter:"
    echo "- Upload to https://convertio.co/jpg-webp/"
    echo "- Save as: public/images/portfolio/wedding-highlights.webp"
fi

echo ""
echo "After conversion, the image will be automatically used in the Portfolio component." 