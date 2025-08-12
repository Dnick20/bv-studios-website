# BV Studios Website Link Map

This document catalogs all current links across the BV Studios website and their intended targets.

## Navigation Links

### Main Navigation (components/Navigation.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| Home | Navigation.js | `/#home` | `/#home` | ✅ Working |
| Services | Navigation.js | `/#services` | `/#services` | ✅ Working |
| Weddings | Navigation.js | `/weddings` | `/weddings` | ✅ Working |
| Portfolio | Navigation.js | `/#portfolio` | `/#portfolio` | ✅ Working |
| About | Navigation.js | `/#about` | `/#about` | ✅ Working |
| Contact | Navigation.js | `/#contact` | `/#contact` | ✅ Working |
| My Quotes (auth) | Navigation.js | `/my-quotes` | `/my-quotes` | ✅ Working |
| Get Started (no auth) | AuthButton.js | `/auth` | `/auth/signin` | ⚠️ Needs fix |

### Mobile Navigation (components/navigation/MobileMenu.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| All nav items | MobileMenu.js | Same as main nav | Same as main nav | ✅ Working |
| My Quotes (auth) | MobileMenu.js | `/my-quotes` | `/my-quotes` | ✅ Working |
| Dashboard (auth) | MobileMenu.js | `/dashboard` | `/dashboard` | ✅ Working |
| Get Started (no auth) | MobileMenu.js | `/auth` | `/auth/signin` | ⚠️ Needs fix |

## Hero Section Links

### Hero CTAs (components/Hero.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| View Our Work | Hero.js | `#portfolio` | `#portfolio` | ✅ Working |
| Get Started | Hero.js | `#contact` | `#contact` | ✅ Working |

## Contact Form Links

### Contact Information (components/ContactForm.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| info@bvstudios.com | ContactForm.js | `mailto:info@bvstudios.com` | `mailto:info@bvstudios.com` | ✅ Working |
| (859) 555-0123 | ContactForm.js | `tel:+18595550123` | `tel:+18595550123` | ✅ Working |

## Wedding Page Links

### Wedding Hero Section (app/weddings/page.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| View Our Films | weddings/page.js | No href (button) | `#portfolio` or scroll | ⚠️ Needs link |
| Sign In to Book | weddings/page.js | `/auth` | `/auth/signin` | ⚠️ Needs fix |

### Wedding Package CTAs (app/weddings/page.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| Sign In to Book (Silver) | weddings/page.js | `/auth` | `/auth/signin` | ⚠️ Needs fix |
| Sign In to Book (Gold) | weddings/page.js | `/auth` | `/auth/signin` | ⚠️ Needs fix |
| Sign In to Book (Diamond) | weddings/page.js | `/auth` | `/auth/signin` | ⚠️ Needs fix |

### Wedding CTA Section (app/weddings/page.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| Sign In to Start Planning | weddings/page.js | `/auth` | `/auth/signin` | ⚠️ Needs fix |

## Auth Pages Links

### Auth Dashboard Dropdown (components/navigation/AuthButton.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| My Dashboard | AuthButton.js | `/dashboard` | `/dashboard` | ✅ Working |

### Signup Page Links (app/auth/signup/page.js)
| Element Text | File/Component | Current Target | Intended Target | Status |
|--------------|----------------|----------------|-----------------|--------|
| Sign in | signup/page.js | `/auth/signin` | `/auth/signin` | ✅ Working |

## Form Submission Issues

### Contact Form API (components/ContactForm.js)
| Element | Issue | Status |
|---------|-------|--------|
| Contact form submit | Only shows alert, no API call | ❌ Needs API route |

### Auth Signup Form (app/auth/signup/page.js)
| Element | Issue | Status |
|---------|-------|--------|
| Signup form submit | Calls `/api/auth/register` | ❌ Internal Server Error |

## Summary of Issues

### High Priority Fixes
1. **Auth links pointing to `/auth`** - Should point to `/auth/signin`
   - AuthButton.js "Get Started" button
   - MobileMenu.js "Get Started" button  
   - All wedding page "Sign In to Book" buttons (4 instances)
   - Wedding CTA "Sign In to Start Planning" button

2. **Contact form submission** - Needs proper API integration
   - Create `/api/contact` route
   - Wire form to submit to API instead of showing alert

3. **Auth signup error** - `/api/auth/register` returns Internal Server Error
   - Debug and fix the registration API route

### Medium Priority Fixes
4. **Wedding "View Our Films" button** - Missing href
   - Add proper navigation to portfolio section or scroll behavior

## Action Items
- [x] Document current link structure
- [ ] Fix all `/auth` links to point to `/auth/signin` 
- [ ] Create contact API route and wire form
- [ ] Debug and fix signup API error
- [ ] Add missing link to "View Our Films" button
- [ ] Test all navigation and form functionality