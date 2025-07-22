#!/bin/bash

# Create the weddings directory if it doesn't exist
mkdir -p public/images/weddings

# Save Christian & Hailee thumbnail
curl -o public/images/weddings/christian-hailee.jpg "https://raw.githubusercontent.com/Dnick20/bv-studios-website/main/public/images/weddings/christian-hailee.jpg"

# Save Sarah & David thumbnail (dress in barn)
curl -o public/images/weddings/sarah-david.jpg "https://raw.githubusercontent.com/Dnick20/bv-studios-website/main/public/images/weddings/sarah-david.jpg"

# Save Kaitlin & Andy thumbnail (couple under green leaves)
curl -o public/images/weddings/kaitlin-andy.jpg "https://raw.githubusercontent.com/Dnick20/bv-studios-website/main/public/images/weddings/kaitlin-andy.jpg"

echo "Wedding thumbnails saved to public/images/weddings/" 