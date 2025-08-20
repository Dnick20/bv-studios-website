// Centralized import utility to eliminate deep relative imports
// This provides consistent import paths and makes refactoring easier

// Core utilities
export { safeJson } from './utils/safeJson.js'

// Database
export { prisma } from './prisma.js'

// Analytics
export { analytics } from './analytics.js'

// Bot system
export { BotManager } from './bots/core/BotManager.js'
export { BaseBot } from './bots/core/BaseBot.js'
export { BotScheduler } from './bots/core/BotScheduler.js'

// Components
export { default as Navigation } from '../components/Navigation.js'
export { default as AdminLayout } from '../components/AdminLayout.js'
export { default as AnalyticsDashboard } from '../components/AnalyticsDashboard.js'
export { default as WeddingQuoteManager } from '../components/WeddingQuoteManager.js'

// Bot handlers
export { default as DatabaseBot } from './bots/handlers/DatabaseBot.js'
export { default as ContentBot } from './bots/handlers/ContentBot.js'
export { default as LeadBot } from './bots/handlers/LeadBot.js'
export { default as WeddingDataBot } from './bots/handlers/WeddingDataBot.js'
