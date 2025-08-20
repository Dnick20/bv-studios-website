# Claude Code Duplicate Prevention Workflow

This guide shows how to use the BV Studios Duplicate Prevention System with Claude Code effectively.

## 🚀 Quick Start

### Before Every Code Request

```bash
# 1. Run comprehensive duplicate check
npm run claude:check

# 2. Check specific functionality (replace 'auth' with your feature)
npm run claude:search auth

# 3. View available imports
npm run claude:imports
```

### Share Results with Claude Code

Copy the output and include it in your request:

```
"I've run duplicate checks with these results:
[paste output]

Now I need to [your request]. Please use existing patterns and avoid duplicates."
```

## 📋 Claude Code Request Templates

### Template 1: New Component Request
```markdown
**Pre-Check Completed**: `npm run claude:check` - No duplicates found for [ComponentName]

**Request**: Create a new [ComponentName] component that [functionality]

**Requirements**:
- Use imports from `lib/imports.js`
- Follow existing patterns in `components/`
- Check if similar functionality exists before creating
- Maintain consistent styling with current components

**Existing Context**: [Share any related components found]
```

### Template 2: Feature Extension Request
```markdown
**Pre-Check Completed**: Found existing [FeatureName] in [location]

**Request**: Extend the existing [FeatureName] to add [new functionality]

**Current Implementation**: [Share relevant code or file paths]

**Requirements**:
- Extend existing code rather than creating new
- Maintain backward compatibility
- Use existing import patterns
```

### Template 3: API Route Request
```markdown
**Pre-Check Completed**: `npm run claude:search api` shows existing routes: [list found routes]

**Request**: Create API route for [functionality]

**Requirements**:
- Check if similar endpoint exists in `app/api/`
- Use existing patterns from similar routes
- Import from `lib/imports.js` for database/auth
- Follow existing error handling patterns
```

## 🛠️ Enhanced npm Scripts

Add these to your workflow:

```bash
# Comprehensive pre-check for Claude Code
npm run claude:check

# Search for specific functionality
npm run claude:search [term]

# View centralized imports
npm run claude:imports

# Show project structure
npm run claude:structure

# Quick component search
npm run claude:components
```

## 📁 File Analysis Commands

### Before Creating Components
```bash
# Check for existing components
find ./components -name "*.js" | grep -i [ComponentName]

# Check for similar functionality
grep -r "function.*[FunctionName]" ./components

# View component imports
grep -r "import.*[ComponentName]" .
```

### Before Creating API Routes
```bash
# Check existing API routes
find ./app/api -name "route.js" | xargs grep -l [keyword]

# Check for similar endpoints
grep -r "export.*POST\|GET\|PUT\|DELETE" ./app/api
```

### Before Creating Pages
```bash
# Check existing pages
find ./app -name "page.js" | grep -v api

# Check for similar page functionality
grep -r "export default function.*Page" ./app
```

## 🎯 Claude Code Integration Workflow

### Step 1: Analysis Phase
```bash
# Run full analysis
npm run claude:check
npm run claude:search [your-feature]
```

### Step 2: Context Sharing
Share with Claude Code:
- Duplicate check results
- Existing similar functionality
- Current import patterns
- Project structure context

### Step 3: Request with Context
```
"Based on duplicate analysis showing [results], please [your request] 
while using existing patterns from [specific files/components]."
```

### Step 4: Verification
After Claude Code provides solution:
```bash
# Verify no new duplicates created
npm run check-duplicates

# Confirm imports are properly centralized
npm run claude:imports | grep [new-component]
```

## 📖 Common Scenarios

### Scenario 1: Adding Authentication Feature
```bash
# Check existing auth
npm run claude:search auth
grep -r "NextAuth\|signIn\|signOut" .

# Share with Claude Code
"I found existing auth in lib/auth.js, components/navigation/AuthButton.js, 
and app/auth/. I need to add [specific auth feature]. Please extend existing 
patterns rather than creating new auth logic."
```

### Scenario 2: Creating Admin Feature
```bash
# Check existing admin functionality
find ./app/admin -name "*.js"
grep -r "admin\|Admin" ./components

# Share context
"Existing admin system found in app/admin/ with AdminLayout.js component. 
Need to add [admin feature]. Please follow existing admin patterns."
```

### Scenario 3: Adding Wedding Feature
```bash
# Check wedding-related code
npm run claude:search wedding
find . -path "*/node_modules" -prune -o -name "*wedding*" -print

# Share results
"Found comprehensive wedding system: WeddingQuoteManager, WeddingPortfolio, 
wedding API routes. Need to add [wedding feature]. Please integrate with 
existing wedding system."
```

## ⚡ Quick Reference Commands

```bash
# Essential pre-checks
npm run claude:check                    # Full duplicate check
npm run claude:search [term]           # Search for specific functionality
npm run claude:imports                 # View available imports

# File discovery
find ./components -name "*[Term]*"     # Find components
find ./app/api -name "route.js"        # Find API routes
find ./app -name "page.js"             # Find pages

# Pattern analysis
grep -r "export default" ./components  # Component patterns
grep -r "import.*from.*lib/imports"    # Import patterns
grep -r "className.*[style]"           # Styling patterns
```

## 🔧 Integration with Existing Tools

### Works with Current Scripts:
- `npm run check-duplicates` - Base duplicate detection
- `npm run validate` - Code validation
- `npm run test` - Playwright testing
- `npm run build` - Build verification

### Enhanced for Claude Code:
- Pre-request analysis
- Context sharing
- Pattern discovery
- Post-creation verification

## 📝 Best Practices

### 1. Always Start with Analysis
Never ask Claude Code to create something without running duplicate checks first.

### 2. Share Complete Context
Include file paths, existing patterns, and import structure in your requests.

### 3. Reference Existing Patterns
Point Claude Code to similar existing code for consistency.

### 4. Verify Results
Run duplicate checks after Claude Code creates new code.

### 5. Update Centralized Imports
Ensure new components are added to `lib/imports.js` when appropriate.

## 🚨 Red Flags - Stop and Check

If you see any of these, run duplicate checks:
- Creating similar component names
- Implementing authentication logic
- Adding API routes for existing features
- Creating utility functions
- Adding form validation
- Implementing analytics tracking

## 📊 Success Metrics

Your workflow is working when:
- ✅ No duplicate functionality created
- ✅ Consistent import patterns maintained
- ✅ Existing code extended rather than replaced
- ✅ Clean, maintainable codebase preserved
- ✅ Build and tests pass after changes