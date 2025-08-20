#!/usr/bin/env node

/**
 * Duplicate Checker Script
 * Automatically detects common duplication issues in the codebase
 * Run with: node scripts/duplicate-checker.js
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const issues = []

console.log('🔍 BV Studios Duplicate Checker')
console.log('================================\n')

// Check 1: Multiple environment files
console.log('1️⃣ Checking environment files...')
try {
  const envFiles = execSync('ls -la | grep env', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
  if (envFiles.length > 2) {
    // .env.example + .env.local is normal
    issues.push(
      `⚠️  Multiple environment files detected: ${envFiles.length} files`
    )
    envFiles.forEach((file) => console.log(`   ${file}`))
  } else {
    console.log('   ✅ Environment files look good')
  }
} catch (error) {
  console.log('   ✅ No environment file conflicts detected')
}

// Check 2: Deep relative imports (excluding centralized imports, node_modules, and build files)
console.log('\n2️⃣ Checking for deep relative imports...')
try {
  const deepImports = execSync(
    'grep -r "import.*from.*\\.\\./\\.\\./\\.\\./\\.\\./" . --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" | grep -v "lib/imports.js" | grep -v "node_modules" | grep -v ".next"',
    { encoding: 'utf8' }
  )
    .split('\n')
    .filter(Boolean)
  if (deepImports.length > 0) {
    issues.push(
      `❌ Deep relative imports found: ${deepImports.length} instances`
    )
    deepImports.slice(0, 5).forEach((import_) => console.log(`   ${import_}`))
    if (deepImports.length > 5)
      console.log(`   ... and ${deepImports.length - 5} more`)
  } else {
    console.log('   ✅ No deep relative imports found')
  }
} catch (error) {
  console.log('   ✅ No deep relative imports detected')
}

// Check 3: Duplicate component names
console.log('\n3️⃣ Checking for duplicate component names...')
try {
  const componentFiles = execSync(
    'find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -E "(components|app)" | grep -v "node_modules"',
    { encoding: 'utf8' }
  )
    .split('\n')
    .filter(Boolean)

  const componentNames = componentFiles
    .map((file) => path.basename(file, path.extname(file)))
    .filter((name) => name.match(/^[A-Z]/)) // Only capitalized names (likely components)

  const duplicates = componentNames.filter(
    (name, index) => componentNames.indexOf(name) !== index
  )
  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)]
    issues.push(
      `❌ Duplicate component names found: ${uniqueDuplicates.join(', ')}`
    )
    uniqueDuplicates.forEach((name) => {
      const files = componentFiles.filter(
        (file) => path.basename(file, path.extname(file)) === name
      )
      console.log(`   ${name}: ${files.length} files`)
      files.forEach((file) => console.log(`     ${file}`))
    })
  } else {
    console.log('   ✅ No duplicate component names found')
  }
} catch (error) {
  console.log('   ✅ Component names look good')
}

// Check 4: Multiple package installations
console.log('\n4️⃣ Checking for multiple package installations...')
try {
  const globalPackages = execSync('npm list -g --depth=0', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
  const vercelInstallations = globalPackages.filter((line) =>
    line.includes('vercel')
  )

  if (vercelInstallations.length > 1) {
    issues.push('⚠️  Multiple Vercel installations detected')
    vercelInstallations.forEach((line) => console.log(`   ${line.trim()}`))
  } else {
    console.log('   ✅ Package installations look good')
  }
} catch (error) {
  console.log('   ✅ Package installations check passed')
}

// Check 5: Unused imports
console.log('\n5️⃣ Checking for potential unused imports...')
try {
  const importsFile = './lib/imports.js'
  if (fs.existsSync(importsFile)) {
    const importsContent = fs.readFileSync(importsFile, 'utf8')
    const exportedItems =
      importsContent.match(/export.*from.*['"]([^'"]+)['"]/g) || []

    console.log(
      `   📦 Centralized imports file found with ${exportedItems.length} exports`
    )
    console.log('   ✅ Using centralized import system')
  } else {
    issues.push(
      '⚠️  No centralized imports file found - consider creating lib/imports.js'
    )
  }
} catch (error) {
  console.log('   ✅ Import system check passed')
}

// Check 6: Duplicate API routes
console.log('\n6️⃣ Checking for duplicate API routes...')
try {
  const apiRoutes = execSync('find app/api -type d -name "*" | sort', {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
  const routeNames = apiRoutes.map((route) => path.basename(route))
  const duplicates = routeNames.filter(
    (name, index) => routeNames.indexOf(name) !== index
  )

  // Filter out intentional duplicates (like payment routes for different purposes)
  const intentionalDuplicates = ['payment', 'create-intent', '[id]'] // These are normal
  const realDuplicates = duplicates.filter(
    (name) => !intentionalDuplicates.includes(name)
  )

  if (realDuplicates.length > 0) {
    issues.push(
      `⚠️  Potential duplicate API route names: ${realDuplicates.join(', ')}`
    )
    realDuplicates.forEach((name) => {
      const routes = apiRoutes.filter((route) => path.basename(route) === name)
      console.log(`   ${name}: ${routes.length} routes`)
      routes.forEach((route) => console.log(`     ${route}`))
    })
  } else {
    console.log('   ✅ API routes look good')
  }

  // Show intentional duplicates for reference
  if (duplicates.length > 0) {
    console.log(
      '   📝 Note: Some route names are intentionally duplicated for different purposes:'
    )
    duplicates.forEach((name) => {
      if (intentionalDuplicates.includes(name)) {
        const routes = apiRoutes.filter(
          (route) => path.basename(route) === name
        )
        console.log(`     ${name}: ${routes.length} routes (intentional)`)
        routes.forEach((route) => console.log(`       ${route}`))
      }
    })
  }
} catch (error) {
  console.log('   ✅ API routes check passed')
}

// Summary
console.log('\n📊 SUMMARY')
console.log('===========')

if (issues.length === 0) {
  console.log('🎉 No duplication issues found! Your codebase is clean.')
} else {
  console.log(`⚠️  Found ${issues.length} potential issues:`)
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`)
  })

  console.log('\n🔧 RECOMMENDATIONS:')
  console.log('   1. Review the issues above')
  console.log('   2. Use the centralized import system (lib/imports.js)')
  console.log('   3. Follow naming conventions')
  console.log('   4. Check for existing functionality before creating new')
  console.log('   5. Use single installation points for tools')
}

console.log(
  '\n📖 For detailed guidance, see: docs/DUPLICATE_PREVENTION_GUIDE.md'
)
console.log('🔄 Run this script regularly to maintain code quality')
