#!/bin/bash

# Create directories if they don't exist
mkdir -p public/images/weddings

# Source directory for wedding images
SOURCE_DIR="../wedding-photos"

# Copy images to public directory
cp "$SOURCE_DIR/christian-hailee.jpg" public/images/weddings/
cp "$SOURCE_DIR/kaitlin-andy.jpg" public/images/weddings/
cp "$SOURCE_DIR/niki-matt.jpg" public/images/weddings/
cp "$SOURCE_DIR/sarah-david.jpg" public/images/weddings/

echo "Wedding images have been copied successfully!" 