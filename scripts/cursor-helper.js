#!/usr/bin/env node

/**
 * Cursor AI Helper Script
 * Provides intelligent search and context for Cursor AI development
 * Run with: npm run cursor:search [search-term]
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const searchTerm = process.argv[2]

if (!searchTerm) {
  console.log('🔍 Cursor AI Helper - Search for Existing Functionality')
  console.log('========================================================\n')
  console.log('Usage: npm run cursor:search [search-term]')
  console.log('Example: npm run cursor:search auth')
  console.log('Example: npm run cursor:search form')
  console.log('Example: npm run cursor:search payment')
  process.exit(0)
}

console.log(`🔍 Cursor AI: Searching for "${searchTerm}" in your codebase`)
console.log('========================================================\n')

// Search for components
console.log('🧩 COMPONENTS:')
try {
  const componentResults = execSync(`find ./components -name "*.js" -exec grep -l -i "${searchTerm}" {} \\;`, { encoding: 'utf8' }).split('\n').filter(Boolean)
  if (componentResults.length > 0) {
    componentResults.forEach(file => {
      const relativePath = file.replace('./components/', '')
      console.log(`   📁 ${relativePath}`)
    })
  } else {
    console.log('   No components found')
  }
} catch (error) {
  console.log('   No components found')
}

// Search for pages
console.log('\n📄 PAGES:')
try {
  const pageResults = execSync(`find ./app -name "*.js" -exec grep -l -i "${searchTerm}" {} \\;`, { encoding: 'utf8' }).split('\n').filter(Boolean)
  if (pageResults.length > 0) {
    pageResults.forEach(file => {
      const relativePath = file.replace('./app/', '')
      console.log(`   📄 ${relativePath}`)
    })
  } else {
    console.log('   No pages found')
  }
} catch (error) {
  console.log('   No pages found')
}

// Search for API routes
console.log('\n🔌 API ROUTES:')
try {
  const apiResults = execSync(`find ./app/api -name "*.js" -exec grep -l -i "${searchTerm}" {} \\;`, { encoding: 'utf8' }).split('\n').filter(Boolean)
  if (apiResults.length > 0) {
    apiResults.forEach(file => {
      const relativePath = file.replace('./app/api/', '')
      console.log(`   🔌 ${relativePath}`)
    })
  } else {
    console.log('   No API routes found')
  }
} catch (error) {
  console.log('   No API routes found')
}

// Search for utility functions
console.log('\n🛠️ UTILITIES:')
try {
  const utilResults = execSync(`find ./lib -name "*.js" -exec grep -l -i "${searchTerm}" {} \\;`, { encoding: 'utf8' }).split('\n').filter(Boolean)
  if (utilResults.length > 0) {
    utilResults.forEach(file => {
      const relativePath = file.replace('./lib/', '')
      console.log(`   🛠️ ${relativePath}`)
    })
  } else {
    console.log('   No utilities found')
  }
} catch (error) {
  console.log('   No utilities found')
}

// Search for specific function definitions
console.log('\n🔍 FUNCTION DEFINITIONS:')
try {
  const functionResults = execSync(`grep -r "function.*${searchTerm}" . --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v ".next" | head -5`, { encoding: 'utf8' }).split('\n').filter(Boolean)
  if (functionResults.length > 0) {
    functionResults.forEach(line => {
      console.log(`   ${line}`)
    })
    if (functionResults.length >= 5) {
      console.log('   ... (showing first 5 results)')
    }
  } else {
    console.log('   No function definitions found')
  }
} catch (error) {
  console.log('   No function definitions found')
}

// Search for imports
console.log('\n📦 IMPORTS:')
try {
  const importResults = execSync(`grep -r "import.*${searchTerm}" . --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v ".next" | head -5`, { encoding: 'utf8' }).split('\n').filter(Boolean)
  if (importResults.length > 0) {
    importResults.forEach(line => {
      console.log(`   ${line}`)
    })
    if (importResults.length >= 5) {
      console.log('   ... (showing first 5 results)')
    }
  } else {
    console.log('   No imports found')
  }
} catch (error) {
  console.log('   No imports found')
}

// Check centralized imports
console.log('\n📦 CENTRALIZED IMPORTS:')
try {
  const importsFile = './lib/imports.js'
  if (fs.existsSync(importsFile)) {
    const importsContent = fs.readFileSync(importsFile, 'utf8')
    const relevantExports = importsContent.split('\n').filter(line => 
      line.toLowerCase().includes(searchTerm.toLowerCase()) && line.includes('export')
    )
    
    if (relevantExports.length > 0) {
      console.log('   Available exports:')
      relevantExports.forEach(line => {
        console.log(`   ${line.trim()}`)
      })
    } else {
      console.log('   No relevant exports found in centralized imports')
    }
  } else {
    console.log('   Centralized imports file not found')
  }
} catch (error) {
  console.log('   Error reading centralized imports')
}

console.log('\n🎯 CURSOR AI RECOMMENDATIONS:')
console.log('================================')
console.log('1. Review the existing functionality above')
console.log('2. Consider extending existing components rather than creating new ones')
console.log('3. Use the centralized import system (lib/imports.js)')
console.log('4. Follow existing naming conventions and patterns')
console.log('5. Run "npm run check-duplicates" before implementing new features')

console.log('\n💡 PROMPT FOR CURSOR AI:')
console.log('========================')
console.log(`Based on the search results above for "${searchTerm}", please:`)
console.log('- Analyze existing functionality')
console.log('- Suggest whether to extend existing or create new')
console.log('- Provide implementation guidance')
console.log('- Ensure no duplication with existing code')

console.log('\n📖 For detailed guidance, see: docs/CURSOR_AI_WORKFLOW.md')
console.log('🔄 Run this script regularly to maintain code quality')
