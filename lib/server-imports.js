// Server-safe centralized import utility
// This excludes client-side components and only includes server-side utilities

// Core utilities
export { safeJson } from './utils/safeJson.js'

// Database
export { prisma } from './prisma.js'

// Analytics
export { analytics } from './analytics.js'

// Bot system (server-side only)
export { BotManager } from './bots/core/BotManager.js'
export { BaseBot } from './bots/core/BaseBot.js'
export { BotScheduler } from './bots/core/BotScheduler.js'

// Bot handlers (server-side only)
export { DatabaseBot } from './bots/handlers/DatabaseBot.js'
export { ContentBot } from './bots/handlers/ContentBot.js'
export { LeadBot } from './bots/handlers/LeadBot.js'
export { WeddingDataBot } from './bots/handlers/WeddingDataBot.js'
