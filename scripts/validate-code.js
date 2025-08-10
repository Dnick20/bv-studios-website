#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
        // Legacy paths (kept for safety)
        'pages/api/auth/',
        'pages/auth/',
        'pages/_app.js',
        'pages/api/webhooks/stripe.js', // Uses Stripe session, not NextAuth
        'pages/api/wedding/quotes.js',
        // Current app-router auth and bots (intentional session usage)
        'app/',
        'app/auth/',
        'app/api/auth/',
        'components/',
        'lib/auth.js',
        'lib/bots/'
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
      const hasNextAuthImport = /import\s*\{?\s*useSession\s*\}?\s*from\s*['"]next-auth['"]/g.test(content);
      const hasGetServerSession = /\bgetServerSession\b/g.test(content);
      const hasCustomAuthImport = /import\s*\{\s*auth\s*\}\s*from\s*['"]@\/lib\/auth['"]/g.test(content);
      const hasAuthCall = /\bauth\s*\(/g.test(content);
      
      if (hasSessionReference && !(hasNextAuthImport || hasGetServerSession || hasCustomAuthImport || hasAuthCall)) {
        const matches = content.match(/\bsession\b(?!\s*=)/g);
        return matches ? matches.slice(0, 3) : null;
      }
      
      return null;
    },
    message: 'Found session reference without proper auth import. Add useSession(), getServerSession, or import { auth } from "@/lib/auth" and use auth() on the server.'
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

// Execute only when run directly (not when imported)
const isDirectRun = (() => {
  try {
    const thisFilePath = fileURLToPath(import.meta.url);
    return process.argv[1] && path.resolve(process.argv[1]) === thisFilePath;
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  main();
}

export { validateFile, VALIDATION_RULES };