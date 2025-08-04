#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Code Validation Script
 * Prevents common errors and ensures code consistency
 */

const VALIDATION_RULES = [
  {
    name: 'No undefined session references',
    validate: (content, filePath) => {
      // Skip files that legitimately use session
      const excludePaths = [
        'pages/api/auth/',
        'contexts/AuthContext.js',
        'app/auth/',
        'pages/auth/',
        'pages/api/wedding/quotes.js',
        'pages/_app.js',
        'pages/api/webhooks/stripe.js' // Uses Stripe session, not NextAuth
      ];
      
      if (excludePaths.some(path => filePath.includes(path))) {
        return null;
      }
      
      // Remove comments and strings to avoid false positives
      const cleanContent = content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/['"`].*?['"`]/g, '""'); // Remove strings
      
      // Look for session references without proper imports
      const hasSessionReference = /\bsession\b(?!\s*=)/g.test(cleanContent);
      const hasNextAuthImport = /import.*useSession.*from.*next-auth/g.test(content);
      const hasGetServerSession = /getServerSession/g.test(content);
      
      if (hasSessionReference && !hasNextAuthImport && !hasGetServerSession) {
        const matches = content.match(/\bsession\b(?!\s*=)/g);
        return matches ? matches.slice(0, 3) : null;
      }
      
      return null;
    },
    message: 'Found session reference without proper NextAuth import. Add useSession() hook or getServerSession import.'
  },

  // Dependency validation disabled - too many false positives with monorepo packages
  // {
  //   name: 'No missing dependencies', 
  //   // ... validation logic
  // }
];

function findFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, .git
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
          traverse(fullPath);
        }
      } else {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function shouldExcludeFile(filePath, excludePatterns) {
  return excludePatterns.some(pattern => {
    if (typeof pattern === 'string') {
      return filePath.includes(pattern);
    }
    return pattern.test(filePath);
  });
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  
  for (const rule of VALIDATION_RULES) {
    if (rule.exclude && shouldExcludeFile(filePath, rule.exclude)) {
      continue;
    }
    
    if (rule.validate) {
      const result = rule.validate(content, filePath);
      if (result) {
        errors.push({
          rule: rule.name,
          message: `${rule.message}: ${Array.isArray(result) ? result.join(', ') : result}`,
          file: filePath
        });
      }
    } else if (rule.pattern) {
      const matches = content.match(rule.pattern);
      if (matches) {
        errors.push({
          rule: rule.name,
          message: rule.message,
          file: filePath,
          matches: matches.slice(0, 3) // Show first 3 matches
        });
      }
    }
  }
  
  return errors;
}

function main() {
  console.log('🔍 Running code validation...\n');
  
  const files = findFiles('.');
  let totalErrors = 0;
  
  for (const file of files) {
    const errors = validateFile(file);
    if (errors.length > 0) {
      console.log(`❌ ${file}:`);
      errors.forEach(error => {
        console.log(`   ${error.rule}: ${error.message}`);
        if (error.matches) {
          console.log(`   Matches: ${error.matches.join(', ')}`);
        }
      });
      console.log('');
      totalErrors += errors.length;
    }
  }
  
  if (totalErrors === 0) {
    console.log('✅ All validation checks passed!');
  } else {
    console.log(`❌ Found ${totalErrors} validation errors.`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateFile, VALIDATION_RULES };