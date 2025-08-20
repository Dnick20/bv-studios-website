#!/usr/bin/env node

/**
 * Claude Code Helper Script
 * Provides comprehensive analysis for duplicate prevention
 */

import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

const SEARCH_TERM = process.argv[2]

if (!SEARCH_TERM) {
  console.log('Usage: npm run claude:search [search-term]')
  console.log('Example: npm run claude:search auth')
  process.exit(1)
}

console.log(`🔍 Claude Code: Searching for "${SEARCH_TERM}"...\n`)

// Search patterns
const searchPatterns = [
  {
    name: 'Components',
    pattern: `grep -r --include="*.js" --include="*.jsx" "${SEARCH_TERM}" ./components 2>/dev/null || echo "No matches in components"`,
    description: 'Looking for existing components...'
  },
  {
    name: 'API Routes', 
    pattern: `grep -r --include="*.js" "${SEARCH_TERM}" ./app/api 2>/dev/null || echo "No matches in API routes"`,
    description: 'Checking API routes...'
  },
  {
    name: 'Pages',
    pattern: `grep -r --include="*.js" "${SEARCH_TERM}" ./app --exclude-dir=api 2>/dev/null || echo "No matches in pages"`,
    description: 'Scanning pages...'
  },
  {
    name: 'Utilities',
    pattern: `grep -r --include="*.js" "${SEARCH_TERM}" ./lib 2>/dev/null || echo "No matches in lib"`,
    description: 'Checking utilities...'
  },
  {
    name: 'File Names',
    pattern: `find . -name "*${SEARCH_TERM}*" -not -path "./node_modules/*" 2>/dev/null || echo "No files matching name"`,
    description: 'Finding files with matching names...'
  }
]

async function runSearch() {
  for (const search of searchPatterns) {
    console.log(`📂 ${search.description}`)
    
    try {
      const result = await new Promise((resolve, reject) => {
        exec(search.pattern, (error, stdout, stderr) => {
          if (error && error.code !== 1) { // grep returns 1 when no matches found
            reject(error)
          } else {
            resolve(stdout.trim())
          }
        })
      })
      
      if (result && result !== `No matches in ${search.name.toLowerCase()}` && result !== 'No files matching name') {
        console.log(`✅ Found in ${search.name}:`)
        console.log(result)
      } else {
        console.log(`❌ No matches in ${search.name.toLowerCase()}`)
      }
    } catch (error) {
      console.log(`⚠️  Error searching ${search.name}: ${error.message}`)
    }
    
    console.log('')
  }
  
  // Check imports
  console.log('📦 Checking centralized imports...')
  try {
    const importsContent = await fs.readFile('./lib/imports.js', 'utf8')
    if (importsContent.toLowerCase().includes(SEARCH_TERM.toLowerCase())) {
      console.log(`✅ Found "${SEARCH_TERM}" in centralized imports`)
      
      // Extract the relevant lines
      const lines = importsContent.split('\n')
      const relevantLines = lines.filter(line => 
        line.toLowerCase().includes(SEARCH_TERM.toLowerCase())
      )
      
      if (relevantLines.length > 0) {
        console.log('Relevant import lines:')
        relevantLines.forEach(line => console.log(`  ${line.trim()}`))
      }
    } else {
      console.log(`❌ "${SEARCH_TERM}" not found in centralized imports`)
    }
  } catch (error) {
    console.log('⚠️  Could not read lib/imports.js')
  }
  
  console.log('\n🎯 Claude Code Recommendations:')
  console.log(`1. If matches found above, extend existing functionality`)
  console.log(`2. If no matches, safe to create new "${SEARCH_TERM}" feature`)
  console.log(`3. Use imports from lib/imports.js when possible`)
  console.log(`4. Follow patterns from similar existing code`)
  console.log(`\n📋 Next Steps:`)
  console.log(`1. Share these results with Claude Code`)
  console.log(`2. Reference existing code patterns in your request`)
  console.log(`3. Ask Claude Code to extend rather than duplicate`)
}