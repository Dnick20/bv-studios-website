# Spell Checker Configuration

This project uses **Code Spell Checker (cSpell)** for spell checking in VS Code and other editors.

## Features

- ✅ Comprehensive spell checking for JavaScript, TypeScript, React, CSS, HTML, and Markdown files
- ✅ Project-specific word dictionary
- ✅ Automatic ignore patterns for common development files
- ✅ Support for compound words and technical terms
- ✅ Easy word addition via npm script

## Setup

### 1. Install the Extension

Make sure you have the **Code Spell Checker** extension installed in VS Code:

- Extension ID: `streetsidesoftware.code-spell-checker`
- This is already recommended in `.vscode/extensions.json`

### 2. Configuration Files

- **`cspell.json`** - Main configuration file with all settings
- **`cspell-project-words.txt`** - Project-specific words organized by category
- **`.vscode/settings.json`** - VS Code specific settings

### 3. Restart VS Code

After installation, restart VS Code to ensure the extension loads properly.

## Usage

### Adding New Words

When you encounter a new word that should be recognized:

```bash
# Using npm script (recommended)
npm run spell:add "newterm"

# Or directly with node
node scripts/add-spell-check-word.js "newterm"
```

### Manual Addition

You can also manually add words to:

- **`cspell-project-words.txt`** - For project-specific terms
- **`cspell.json`** - For global configuration

## Configuration Details

### Ignored Patterns

The spell checker automatically ignores:

- Build files (`.next/`, `dist/`, `build/`)
- Dependencies (`node_modules/`)
- Generated files (`*.min.js`, `*.bundle.js`)
- Media files (`public/images/`, `public/media/`)
- Database files (`prisma/dev.db*`)
- Log files (`*.log`)

### Language-Specific Settings

- **JavaScript/React**: Allows compound words, ignores camelCase patterns
- **CSS**: Allows compound words, ignores kebab-case patterns
- **HTML**: Allows compound words, ignores kebab-case patterns
- **Markdown**: Allows compound words, ignores common patterns

### Dictionaries

Uses multiple English dictionaries:

- English (US, UK, Canada, Australia, etc.)
- Technical terms
- Project-specific words

## Troubleshooting

### Spell Checker Not Working

1. **Check Extension**: Ensure Code Spell Checker is installed and enabled
2. **Restart VS Code**: Sometimes required after configuration changes
3. **Check Settings**: Verify `cSpell.enabled` is `true` in VS Code settings
4. **File Association**: Ensure files are properly associated with their language

### False Positives

If legitimate words are flagged as errors:

1. Add them using `npm run spell:add "word"`
2. Check if they're in the ignore patterns
3. Verify the file language is correctly detected

### Performance Issues

If spell checking is slow:

1. Check ignore patterns are comprehensive
2. Ensure large directories are excluded
3. Consider reducing dictionary count if not needed

## Common Commands

```bash
# Add a new technical term
npm run spell:add "webpack"

# Add a company name
npm run spell:add "acme"

# Add a file format
npm run spell:add "avif"

# Check current configuration
cat cspell.json | jq '.words | length'
```

## Best Practices

1. **Use the npm script** for adding words to maintain consistency
2. **Organize words** by category in `cspell-project-words.txt`
3. **Review ignored patterns** periodically to ensure they're still relevant
4. **Keep dictionaries minimal** - only include what you actually need
5. **Use compound words** for technical terms when appropriate

## Integration with Other Tools

- **ESLint**: Works alongside ESLint without conflicts
- **Prettier**: Compatible with Prettier formatting
- **Git Hooks**: Can be integrated with pre-commit hooks if needed
- **CI/CD**: Configuration files are committed to version control

## Support

If you encounter issues:

1. Check the [Code Spell Checker documentation](https://cspell.org/)
2. Review the configuration files in this project
3. Check VS Code extension settings
4. Verify file associations and language detection
