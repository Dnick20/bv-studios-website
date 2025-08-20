# Quick Reference - Duplicate Prevention

## 🚀 Claude Code Quick Commands

### Before Every Request
```bash
npm run claude:check          # Full duplicate analysis
npm run claude:search [term]  # Search for specific functionality
npm run claude:imports        # Show available imports
```

### Essential Workflow
1. **Check**: `npm run claude:check`
2. **Search**: `npm run claude:search auth` (replace 'auth' with your feature)
3. **Share**: Copy results to Claude Code
4. **Request**: Ask Claude Code to extend existing vs create new

## 📋 Quick Templates

### New Component Request
```
Pre-check: `npm run claude:search ComponentName` shows [results]
Request: Create ComponentName that [functionality]
Requirements: Use lib/imports.js, follow existing patterns
```

### Feature Extension
```
Found existing [feature] in [location]
Extend to add [new functionality]
Maintain existing patterns and imports
```

## 🔍 Quick Searches

```bash
# Find components
find ./components -name "*auth*"

# Find API routes  
find ./app/api -name "*user*"

# Check imports
grep -r "import.*Navigation" .

# Find similar functions
grep -r "function.*handleSubmit" .
```

## 📁 Key Locations

- **Components**: `./components/`
- **Pages**: `./app/`
- **API**: `./app/api/`
- **Utils**: `./lib/`
- **Imports**: `./lib/imports.js`

## ⚡ Fast Checks

```bash
# Authentication
npm run claude:search auth

# Forms
npm run claude:search form

# Admin features  
npm run claude:search admin

# Wedding features
npm run claude:search wedding

# Payment features
npm run claude:search payment
```

## 🎯 Success Pattern

1. ✅ Run duplicate check
2. ✅ Share results with Claude Code  
3. ✅ Reference existing patterns
4. ✅ Extend rather than create new
5. ✅ Use centralized imports
6. ✅ Verify no new duplicates

## 🚨 Red Flags

Stop and check if creating:
- Authentication logic (check existing auth system)
- Form validation (check existing forms)
- API routes (check existing endpoints)
- Utility functions (check lib/ directory)
- Similar component names

## 📊 Available Scripts

```bash
npm run claude:check      # Full analysis
npm run claude:search     # Feature search  
npm run claude:imports    # Show imports
npm run claude:structure  # Project overview
npm run claude:components # List components
npm run check-duplicates  # Base duplicate check
npm run validate         # Code validation
npm run test            # Run tests
npm run build           # Build check
```