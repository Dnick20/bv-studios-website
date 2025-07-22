#!/bin/bash

# Create necessary directories
mkdir -p public/images/weddings
mkdir -p public/images/commercial

echo "=== Creating Wedding Images Directory ==="
# Wedding Images
mkdir -p public/images/weddings
touch public/images/weddings/christian-hailee.jpg
touch public/images/weddings/sarah-david.jpg
touch public/images/weddings/niki-matt.jpg
touch public/images/weddings/kaitlin-andy.jpg

echo "=== Creating Commercial Images Directory ==="
# Commercial Images
mkdir -p public/images/commercial
touch public/images/commercial/tim-regus.jpg
touch public/images/commercial/lodge.jpg
touch public/images/commercial/stuttgart.jpg

echo "Image directories and placeholders created. Please add the actual images to:"
echo ""
echo "Wedding Images:"
echo "- public/images/weddings/christian-hailee.jpg (Couple in fall setting)"
echo "- public/images/weddings/sarah-david.jpg (Dress in barn)"
echo "- public/images/weddings/niki-matt.jpg (Couple under green leaves)"
echo "- public/images/weddings/kaitlin-andy.jpg (Getting ready)"
echo ""
echo "Commercial Images:"
echo "- public/images/commercial/tim-regus.jpg (Modern living room)"
echo "- public/images/commercial/lodge.jpg (Exterior with flags)"
echo "- public/images/commercial/stuttgart.jpg (Classic car interior)" 