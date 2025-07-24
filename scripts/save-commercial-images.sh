#!/bin/bash

# Create commercial images directory
mkdir -p public/images/commercial

echo "=== Saving Commercial Images ==="

# Create empty image files
touch public/images/commercial/stuttgart.jpg
touch public/images/commercial/lodge.jpg
touch public/images/commercial/tim-regus.jpg

echo "Commercial image placeholders created at:"
echo "- public/images/commercial/stuttgart.jpg (Stuttgart - Classic Car Interior)"
echo "- public/images/commercial/lodge.jpg (The Lodge - Exterior)"
echo "- public/images/commercial/tim-regus.jpg (Tim Regus - Modern Living Room)"
echo ""
echo "Please add the actual images to these locations." 