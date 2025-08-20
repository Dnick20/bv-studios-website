# ✅ Claude Code Complete Checklist

## 🚀 Before EVERY Claude Code Request

### Step 1: Run Pre-Checks
```bash
# ALWAYS run these commands first
npm run claude:check          # Full duplicate analysis
npm run claude:search [term]  # Search for your specific feature
npm run claude:imports        # View available imports
```

### Step 2: Copy Results to Claude Code
Include this template in your request:
```
Pre-check completed:
- Ran `npm run claude:check` - [result]
- Ran `npm run claude:search [term]` - [found/not found]
- Available imports checked

Request: [Your specific request]
Requirements: Use existing patterns, extend rather than duplicate
```

## 📋 Component Creation Checklist

### ✅ Before Creating a Component
- [ ] Run `npm run claude:components` to see existing components
- [ ] Run `npm run claude:search ComponentName`
- [ ] Check if similar component exists
- [ ] Share findings with Claude Code

### ✅ Component Request Template
```
Creating: [ComponentName]
Pre-check: `npm run claude:search [name]` shows no duplicates
Location: components/[category]/[ComponentName].js
Similar components: [list any similar ones found]
Request: Create component that [functionality]
```

## 📋 API Route Creation Checklist

### ✅ Before Creating an API Route
- [ ] Check existing routes: `find ./app/api -name "route.js"`
- [ ] Run `npm run claude:search [endpoint-name]`
- [ ] Verify endpoint doesn't exist
- [ ] Check authentication patterns

### ✅ API Route Request Template
```
Creating: /api/[endpoint]
Pre-check: No existing route found
Auth required: [yes/no]
Similar routes: [list similar endpoints]
Request: Create API endpoint that [functionality]
```

## 📋 Page Creation Checklist

### ✅ Before Creating a Page
- [ ] Check existing pages: `find ./app -name "page.js" | grep -v api`
- [ ] Run `npm run claude:search [page-name]`
- [ ] Verify route doesn't exist
- [ ] Check layout requirements

### ✅ Page Request Template
```
Creating: /[page-route]
Pre-check: Route doesn't exist
Layout: [uses default/custom]
Similar pages: [list similar pages]
Request: Create page that [functionality]
```

## 📋 Feature Extension Checklist

### ✅ Before Extending Features
- [ ] Locate existing feature code
- [ ] Run `npm run claude:search [feature]`
- [ ] Identify all related files
- [ ] Document current implementation

### ✅ Extension Request Template
```
Extending: [Feature name]
Current location: [file paths]
Current functionality: [brief description]
Request: Add [new functionality]
Maintain: Existing patterns and imports
```

## 🔍 Quick Search Commands

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

# Database/Prisma
npm run claude:search prisma

# Components list
npm run claude:components

# Project structure
npm run claude:structure
```

## 🚨 Red Flags - STOP and Check

**Before asking Claude Code to create:**

### Authentication Logic
- [ ] Check existing auth: `npm run claude:search auth`
- [ ] Review `lib/auth.js`
- [ ] Check `app/auth/` pages
- [ ] Review `components/navigation/AuthButton.js`

### Form Components
- [ ] Check existing forms: `npm run claude:search form`
- [ ] Review `components/ContactForm.js`
- [ ] Check `components/PaymentForm.js`
- [ ] Look for form validation patterns

### API Routes
- [ ] Check existing endpoints: `find ./app/api -name "route.js"`
- [ ] Review authentication middleware
- [ ] Check error handling patterns
- [ ] Look for similar functionality

### Database Operations
- [ ] Check Prisma schema: `cat prisma/schema.prisma`
- [ ] Review `lib/prisma.js`
- [ ] Check existing queries
- [ ] Look for transaction patterns

### Admin Features
- [ ] Check admin dashboard: `npm run claude:search admin`
- [ ] Review `app/admin/` structure
- [ ] Check role-based access
- [ ] Look for existing admin components

## ✅ Success Checklist

After Claude Code creates/modifies code:

### Post-Implementation Checks
- [ ] Run `npm run check-duplicates`
- [ ] Run `npm run build`
- [ ] Run `npm run lint` (if configured)
- [ ] Run `npm test` (if tests exist)
- [ ] Verify imports use `lib/imports.js`
- [ ] Check for console.log statements
- [ ] Verify error handling
- [ ] Check for TODO comments

### Code Quality Checks
- [ ] No duplicate functionality created
- [ ] Uses existing patterns
- [ ] Imports from centralized location
- [ ] Follows naming conventions
- [ ] Includes proper error handling
- [ ] Has appropriate comments (if needed)

## 📊 Available Claude Code Commands

```bash
# Duplicate Prevention
npm run claude:check         # Full analysis
npm run claude:search        # Feature search
npm run claude:imports       # Show imports
npm run claude:structure     # Project overview
npm run claude:components    # List components

# Standard Commands
npm run check-duplicates     # Base duplicate check
npm run dev                  # Start development
npm run build               # Build project
npm run test                # Run tests
npm run validate            # Code validation
```

## 🎯 Golden Rules

1. **ALWAYS run pre-checks before requesting code**
2. **ALWAYS share check results with Claude Code**
3. **ALWAYS ask to extend vs create new**
4. **ALWAYS use centralized imports**
5. **ALWAYS verify no duplicates after**

## 📚 Documentation References

- `docs/CLAUDE_CODE_WORKFLOW.md` - Complete workflow guide
- `docs/QUICK_REFERENCE.md` - Quick commands
- `docs/DUPLICATE_PREVENTION_GUIDE.md` - Prevention strategies
- `docs/link-map.md` - Site navigation structure
- `README.md` - Project overview

## 💡 Pro Tips

1. **Batch Related Requests**: Group similar changes together
2. **Reference Existing Code**: Point Claude Code to similar implementations
3. **Use Specific Paths**: Provide exact file locations when referencing
4. **Check First, Code Second**: Analysis before implementation
5. **Document Changes**: Ask Claude Code to note what was changed

---

**Remember**: The goal is ZERO duplicates and MAXIMUM code reuse! 🎯