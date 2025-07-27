# Upload Wedding Image Instructions

## 🖼️ To Use Your Wedding Image as Thumbnail:

### **Step 1: Convert Image to .webp**
1. **Save your wedding image** as a .jpg or .png file
2. **Convert to .webp** using one of these methods:

#### **Option A: Online Converter (Easiest)**
1. Go to https://convertio.co/jpg-webp/
2. Upload your wedding image
3. Download the .webp file
4. Rename it to: `wedding-highlights.webp`

#### **Option B: Using the Script**
1. Save your image as `input-wedding-image.jpg` in the project root
2. Run: `./scripts/convert-wedding-image.sh`

### **Step 2: Place the Image**
1. **Save the .webp file** as: `wedding-highlights.webp`
2. **Place it in:** `public/images/portfolio/`
3. **Full path should be:** `public/images/portfolio/wedding-highlights.webp`

### **Step 3: Verify**
The Portfolio component is already configured to use this image at:
```
/images/portfolio/wedding-highlights.webp
```

## 🎯 **Expected Result:**
Once uploaded, the Wedding Highlights portfolio item will display your beautiful wedding image as the thumbnail.

## 📁 **File Structure:**
```
public/
└── images/
    └── portfolio/
        └── wedding-highlights.webp  ← Your image goes here
```

## ✅ **Done!**
After placing the image, it will automatically appear in the Portfolio section on the homepage. 