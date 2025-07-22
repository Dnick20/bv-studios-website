#!/bin/bash

# Create the commercial directory if it doesn't exist
mkdir -p public/images/commercial

# Save Stuttgart thumbnail (red classic car interior)
curl -o public/images/commercial/stuttgart.jpg "https://raw.githubusercontent.com/Dnick20/bv-studios-website/main/public/images/commercial/stuttgart.jpg"

echo "Commercial thumbnail saved to public/images/commercial/" 