#!/bin/bash

# Create necessary directories
mkdir -p public/images/weddings
mkdir -p public/images/commercial

# Function to save and optimize an image
save_image() {
    local source=$1
    local destination=$2
    local description=$3
    
    echo "Saving: $description"
    cp "$source" "$destination"
    echo "✓ Saved to: $destination"
}

echo "=== Saving Wedding Images ==="

# Christian & Hailee (couple in fall setting)
save_image "temp/christian-hailee.jpg" "public/images/weddings/christian-hailee.jpg" "Christian & Hailee - Fall Setting"

# Sarah & David (dress in barn)
save_image "temp/sarah-david.jpg" "public/images/weddings/sarah-david.jpg" "Sarah & David - Dress in Barn"

# Niki & Matt (couple under green leaves)
save_image "temp/niki-matt.jpg" "public/images/weddings/niki-matt.jpg" "Niki & Matt - Under Green Leaves"

# Kaitlin & Andy (getting ready)
save_image "temp/kaitlin-andy.jpg" "public/images/weddings/kaitlin-andy.jpg" "Kaitlin & Andy - Getting Ready"

echo "=== Saving Commercial Images ==="

# Tim Regus (modern living room)
save_image "temp/tim-regus.jpg" "public/images/commercial/tim-regus.jpg" "Tim Regus - Modern Living Room"

# The Lodge (exterior)
save_image "temp/lodge.jpg" "public/images/commercial/lodge.jpg" "The Lodge - Exterior"

# Stuttgart (classic car)
save_image "temp/stuttgart.jpg" "public/images/commercial/stuttgart.jpg" "Stuttgart - Classic Car"

echo "All images have been saved successfully!" 