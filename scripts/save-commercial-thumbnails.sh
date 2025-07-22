#!/bin/bash

# Create the commercial directory if it doesn't exist
mkdir -p public/images/commercial

# Save Stuttgart thumbnail (red classic car interior)
curl -o public/images/commercial/stuttgart.jpg "https://raw.githubusercontent.com/Dnick20/bv-studios-website/main/public/images/commercial/stuttgart.jpg"

# Save The Lodge thumbnail (exterior building with flags)
curl -o public/images/commercial/lodge.jpg "https://raw.githubusercontent.com/Dnick20/bv-studios-website/main/public/images/commercial/lodge.jpg"

echo "Commercial thumbnails saved to public/images/commercial/" 