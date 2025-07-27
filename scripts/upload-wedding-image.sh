#!/bin/bash

echo "🖼️ Wedding Image Upload Helper"
echo "================================"
echo ""

# Check if the image already exists
if [ -f "public/images/portfolio/wedding-highlights.webp" ]; then
    echo "✅ Wedding image already exists at: public/images/portfolio/wedding-highlights.webp"
    echo "📏 File size: $(ls -lh public/images/portfolio/wedding-highlights.webp | awk '{print $5}')"
    echo ""
    echo "The image should already be working on your website!"
    echo "Visit: https://bv-studios-website.vercel.app/test-image"
    exit 0
fi

echo "❌ Wedding image not found at: public/images/portfolio/wedding-highlights.webp"
echo ""
echo "📋 To upload your wedding image:"
echo ""
echo "1. 🖼️ Convert your image:"
echo "   - Go to: https://convertio.co/jpg-webp/"
echo "   - Upload your wedding photo"
echo "   - Download the .webp file"
echo ""
echo "2. 📁 Save the image:"
echo "   - Rename the downloaded file to: wedding-highlights.webp"
echo "   - Place it in: public/images/portfolio/"
echo ""
echo "3. 🚀 Upload to website:"
echo "   git add public/images/portfolio/wedding-highlights.webp"
echo "   git commit -m 'Add wedding highlights thumbnail'"
echo "   git push origin main"
echo ""
echo "4. ✅ Test the image:"
echo "   - Visit: https://bv-studios-website.vercel.app/test-image"
echo "   - Check if the image displays correctly"
echo ""
echo "💡 Alternative: Use the conversion script"
echo "   - Save your image as: input-wedding-image.jpg"
echo "   - Run: ./scripts/convert-wedding-image.sh"
echo ""
echo "The Portfolio component is ready to use your image once uploaded!" 