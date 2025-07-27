# 🖼️ Online Image Optimization Guide

## 🚀 Quick Optimization Tools

### 1. **Squoosh.app** (Recommended)
- **URL:** https://squoosh.app
- **Best for:** WebP conversion and quality control
- **Steps:**
  1. Drag and drop your image
  2. Set dimensions (see target sizes below)
  3. Choose WebP format
  4. Adjust quality to 80-85%
  5. Download optimized image

### 2. **TinyPNG**
- **URL:** https://tinypng.com
- **Best for:** Quick PNG/JPG compression
- **Steps:**
  1. Upload image
  2. Download compressed version
  3. Note: Doesn't convert to WebP

### 3. **ImageOptim** (Mac App)
- **URL:** https://imageoptim.com
- **Best for:** Batch processing
- **Steps:**
  1. Download and install
  2. Drag images to app
  3. Automatic optimization

## 📏 Target Image Sizes

### 💒 Wedding Thumbnails (400x225px)
- **Files to optimize:**
  - `christian-hailee.jpg` → `christian-hailee.webp`
  - `kaitlin-andy.jpg` → `kaitlin-andy.webp`
  - `niki-matt.jpg` → `niki-matt.webp`
  - `sarah-david.jpg` → `sarah-david.webp`
- **Target size:** < 100KB each
- **Save to:** `public/images/optimized/weddings/`

### 🎬 Commercial Thumbnails (400x225px)
- **Files to optimize:**
  - `lodge.png` → `lodge.webp`
  - `stuttgart.png` → `stuttgart.webp`
  - `tim-regus.jpg` → `tim-regus.webp`
- **Target size:** < 100KB each
- **Save to:** `public/images/optimized/commercial/`

### 👥 Team Photos (300x300px)
- **Files to optimize:**
  - `Dominic.png` → `dominic.webp`
  - `Deisy.png` → `deisy.webp`
- **Target size:** < 150KB each
- **Save to:** `public/images/optimized/team/`

### 🎨 Portfolio Images (800x450px)
- **Files to optimize:**
  - `hero.jpg` → `hero.webp`
  - `weddings/hero.jpg` → `wedding-hero.webp`
- **Target size:** < 200KB each
- **Save to:** `public/images/optimized/portfolio/`

## 🔄 After Optimization

1. **Replace mediaUrls.ts:**
   ```bash
   cp constants/mediaUrls-optimized.ts constants/mediaUrls.ts
   ```

2. **Test the website:**
   ```bash
   npm run dev
   ```

3. **Check file sizes:**
   ```bash
   ls -lh public/images/optimized/
   ```

## 💡 Optimization Tips

- **WebP format** provides 25-35% smaller files than JPEG
- **Quality 80-85%** maintains visual quality while reducing size
- **Proper dimensions** prevent loading unnecessarily large images
- **Progressive loading** can be added for better UX

## 📊 Expected Results

| Image Type | Original Size | Optimized Size | Savings |
|------------|---------------|----------------|---------|
| Wedding Thumbnails | ~2-9MB each | ~50-100KB each | 90-95% |
| Commercial Thumbnails | ~1-9MB each | ~50-100KB each | 90-95% |
| Team Photos | ~2-18MB each | ~100-150KB each | 90-95% |
| Portfolio Images | ~1-2MB each | ~150-200KB each | 85-90% |

**Total savings:** ~75MB → ~1MB (98% reduction!) 