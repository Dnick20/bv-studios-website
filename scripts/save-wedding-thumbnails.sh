#!/bin/bash

# Create the weddings directory if it doesn't exist
mkdir -p public/images/weddings

# Save Christian & Hailee thumbnail
curl -o public/images/weddings/christian-hailee.jpg "https://raw.githubusercontent.com/Dnick20/bv-studios-website/main/public/images/weddings/christian-hailee.jpg"

echo "Wedding thumbnail saved to public/images/weddings/" 