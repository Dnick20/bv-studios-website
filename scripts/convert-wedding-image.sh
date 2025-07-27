#!/bin/bash

echo "🖼️ Converting wedding image to .webp format..."

# Create the optimized directory if it doesn't exist
mkdir -p public/images/optimized/weddings

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found - converting image..."
    
    # Convert the image to .webp with optimization
    convert input-wedding-image.jpg \
        -resize 800x600^ \
        -gravity center \
        -extent 800x600 \
        -quality 85 \
        -strip \
        public/images/optimized/weddings/wedding-highlights-thumbnail.webp
    
    echo "✅ Image converted successfully!"
    echo "📁 Saved as: public/images/optimized/weddings/wedding-highlights-thumbnail.webp"
    
else
    echo "⚠️ ImageMagick not found. Please install it or convert manually:"
    echo ""
    echo "Manual conversion steps:"
    echo "1. Save the wedding image as 'input-wedding-image.jpg' in the project root"
    echo "2. Install ImageMagick: brew install imagemagick (macOS) or apt-get install imagemagick (Ubuntu)"
    echo "3. Run this script again"
    echo ""
    echo "Or use an online converter:"
    echo "- Upload the image to https://convertio.co/jpg-webp/"
    echo "- Download the .webp file"
    echo "- Save as: public/images/optimized/weddings/wedding-highlights-thumbnail.webp"
fi

echo ""
echo "After conversion, the image will be automatically used in the Portfolio component." 