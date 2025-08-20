# 🚀 Cursor AI Integration Guide

## 🎯 **Overview**

This guide explains how to use Cursor AI effectively with our duplicate prevention system to maintain a clean, efficient codebase.

## 🔍 **Pre-Development Workflow**

### **1. Always Check for Duplicates First**

```bash
# Quick duplicate check
npm run cursor:check

# Search for specific functionality
npm run cursor:search [feature-name]
```

### **2. Example Workflow**

```bash
# Before creating a new authentication component
npm run cursor:search auth

# Before adding payment functionality
npm run cursor:search payment

# Before creating forms
npm run cursor:search form
```

## 🛠️ **Available Cursor AI Commands**

### **Core Commands**
```bash
npm run cursor:check          # Full duplicate analysis
npm run cursor:search [term]  # Intelligent search
npm run cursor:imports        # View available imports
npm run cursor:structure      # Project overview
npm run cursor:components     # List components
```

### **Command Examples**
```bash
# Search for authentication features
npm run cursor:search auth

# Search for form components
npm run cursor:search form

# Search for payment functionality
npm run cursor:search payment

# Search for admin features
npm run cursor:search admin
```

## 💡 **Cursor AI Prompt Templates**

### **New Feature Request**
```
I want to create [FeatureName] that [description].

Pre-check results:
[paste output from npm run cursor:search [term]]

Please analyze existing functionality and suggest:
1. Whether to extend existing or create new
2. Implementation approach
3. How to avoid duplication
4. Where to place the new code
```

### **Component Extension Request**
```
I found existing [ComponentName] in [location].

Current functionality: [describe what it does]
New requirements: [describe what to add]

Please help me extend the existing component rather than creating a duplicate.
```

### **Code Review Request**
```
Please review this code for:
1. Duplication with existing functionality
2. Proper use of centralized imports
3. Following existing patterns
4. Naming conventions

Code to review:
[paste your code]
```

## 🔄 **Development Workflow with Cursor AI**

### **Phase 1: Research & Analysis**
```bash
# 1. Check for duplicates
npm run cursor:check

# 2. Search for existing functionality
npm run cursor:search [your-feature]

# 3. Review centralized imports
npm run cursor:imports
```

### **Phase 2: Share with Cursor AI**
```
Copy the search results and ask Cursor AI:

"Based on these search results for [feature], should I:
- Extend existing [ComponentName]?
- Create a new component?
- Use existing utilities from lib/imports.js?

Please provide implementation guidance."
```

### **Phase 3: Implementation**
- Follow Cursor AI's recommendations
- Use centralized imports from `lib/imports.js`
- Follow existing naming conventions
- Maintain consistent patterns

### **Phase 4: Verification**
```bash
# 1. Build to check for errors
npm run build

# 2. Run duplicate check
npm run check-duplicates

# 3. Test functionality
npm run dev
```

## 📋 **Best Practices for Cursor AI**

### **✅ DO:**
- Always run `npm run cursor:search` before asking for help
- Share search results with Cursor AI
- Ask for analysis of existing vs. new implementation
- Request guidance on avoiding duplication
- Ask for proper import patterns

### **❌ DON'T:**
- Ask Cursor AI to create components without checking existing ones
- Ignore duplicate warnings
- Create new utilities when existing ones exist
- Use deep relative imports instead of centralized ones

## 🎯 **Common Cursor AI Scenarios**

### **Scenario 1: New Authentication Feature**
```bash
# 1. Search for existing auth
npm run cursor:search auth

# 2. Ask Cursor AI:
"Found these auth components: [paste results]
I need to add [new-auth-feature].
Should I extend existing or create new?"
```

### **Scenario 2: Form Component**
```bash
# 1. Search for forms
npm run cursor:search form

# 2. Ask Cursor AI:
"Found these form components: [paste results]
I need a form for [purpose].
How can I extend existing or create efficiently?"
```

### **Scenario 3: API Route**
```bash
# 1. Search for API routes
npm run cursor:search api

# 2. Ask Cursor AI:
"Found these API routes: [paste results]
I need an endpoint for [functionality].
Where should I place it and how to structure it?"
```

## 🔧 **Troubleshooting with Cursor AI**

### **Build Errors**
```
I'm getting this build error:
[paste error]

Search results for related functionality:
[paste npm run cursor:search results]

Please help me fix this and avoid similar issues.
```

### **Import Issues**
```
I'm having trouble with imports:
[paste error]

Available centralized imports:
[paste npm run cursor:imports results]

Please help me use the correct import pattern.
```

### **Duplicate Detection**
```
Duplicate checker found issues:
[paste npm run check-duplicates results]

Please help me resolve these and prevent future duplicates.
```

## 📚 **Learning Resources**

### **Documentation**
- `docs/DUPLICATE_PREVENTION_GUIDE.md` - Complete prevention guide
- `docs/QUICK_REFERENCE.md` - Quick commands reference
- `lib/imports.js` - Centralized import system

### **Regular Maintenance**
```bash
# Weekly
npm run cursor:check

# Before new features
npm run cursor:search [feature]

# Before commits
npm run check-duplicates
```

## 🎉 **Success Metrics**

### **✅ Good Signs**
- `npm run cursor:check` shows no duplicates
- Cursor AI suggests extending existing components
- Centralized imports are used consistently
- Build passes without errors
- Code follows existing patterns

### **⚠️ Warning Signs**
- Duplicate component names
- Deep relative imports
- Similar functionality in multiple places
- Build errors related to imports
- Cursor AI suggests creating new when existing exists

## 🚀 **Getting Started**

1. **Install dependencies**: `npm install`
2. **Run first check**: `npm run cursor:check`
3. **Search for your feature**: `npm run cursor:search [term]`
4. **Share results with Cursor AI**
5. **Follow AI recommendations**
6. **Verify with duplicate check**

---

**Remember**: Cursor AI is your partner in maintaining a clean, efficient codebase. Always check for existing functionality first! 🔍✨
