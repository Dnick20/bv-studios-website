#!/usr/bin/env node

/**
 * Add a new word to the spell checker configuration
 * Usage: node scripts/add-spell-check-word.js <word>
 */

import fs from 'fs';
import path from 'path';

const word = process.argv[2];

if (!word) {
  console.error('Usage: node scripts/add-spell-check-word.js <word>');
  console.error('Example: node scripts/add-spell-check-word.js "newterm"');
  process.exit(1);
}

// Read the current cspell.json
const cspellPath = path.join(process.cwd(), 'cspell.json');
const projectWordsPath = path.join(process.cwd(), 'cspell-project-words.txt');

try {
  // Read and parse cspell.json
  const cspellContent = fs.readFileSync(cspellPath, 'utf8');
  const cspellConfig = JSON.parse(cspellContent);
  
  // Check if word already exists
  if (cspellConfig.words.includes(word)) {
    console.log(`Word "${word}" already exists in spell checker configuration.`);
    process.exit(0);
  }
  
  // Add word to cspell.json
  cspellConfig.words.push(word);
  
  // Sort words alphabetically
  cspellConfig.words.sort();
  
  // Write back to cspell.json
  fs.writeFileSync(cspellPath, JSON.stringify(cspellConfig, null, 2));
  
  // Also add to project words file
  const projectWordsContent = fs.readFileSync(projectWordsPath, 'utf8');
  const lines = projectWordsContent.split('\n');
  
  // Find the appropriate section to add the word
  let added = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#') && lines[i].includes('Technical Terms')) {
      // Add after the section header
      lines.splice(i + 1, 0, word);
      added = true;
      break;
    }
  }
  
  if (!added) {
    // If no technical terms section, add to the end
    lines.push(word);
  }
  
  // Write back to project words file
  fs.writeFileSync(projectWordsPath, lines.join('\n'));
  
  console.log(`✅ Word "${word}" added to spell checker configuration.`);
  console.log(`📝 Added to both cspell.json and cspell-project-words.txt`);
  
} catch (error) {
  console.error('❌ Error updating spell checker configuration:', error.message);
  process.exit(1);
}
