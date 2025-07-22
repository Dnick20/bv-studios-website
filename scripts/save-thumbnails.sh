#!/bin/bash

# Create directories if they don't exist
mkdir -p public/images/weddings
mkdir -p public/images/commercial

# Wedding Thumbnails
echo "Saving wedding thumbnails..."

# Christian & Hailee (couple in fall setting)
base64 -d <<EOF > public/images/weddings/christian-hailee.jpg
$(base64 < public/images/weddings/christian-hailee.jpg)
EOF

# Kaitlin & Andy (couple under green leaves)
base64 -d <<EOF > public/images/weddings/kaitlin-andy.jpg
$(base64 < public/images/weddings/kaitlin-andy.jpg)
EOF

# Sarah & David (dress in barn)
base64 -d <<EOF > public/images/weddings/sarah-david.jpg
$(base64 < public/images/weddings/sarah-david.jpg)
EOF

# Niki & Matt (couple under green leaves)
base64 -d <<EOF > public/images/weddings/niki-matt.jpg
$(base64 < public/images/weddings/niki-matt.jpg)
EOF

# Commercial Thumbnails
echo "Saving commercial thumbnails..."

# Stuttgart (red classic car interior)
base64 -d <<EOF > public/images/commercial/stuttgart.jpg
$(base64 < public/images/commercial/stuttgart.jpg)
EOF

# The Lodge (exterior building with flags)
base64 -d <<EOF > public/images/commercial/lodge.jpg
$(base64 < public/images/commercial/lodge.jpg)
EOF

# Tim Regus (modern living room with blue couch)
base64 -d <<EOF > public/images/commercial/tim-regus.jpg
$(base64 < public/images/commercial/tim-regus.jpg)
EOF

echo "All thumbnails have been saved successfully!" 