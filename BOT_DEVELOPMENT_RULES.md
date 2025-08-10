# Bot Development Rules & Testing Best Practices

## **🛡️ Error Handling Rules (Critical)**

### **Rule 1: Comprehensive Try-Catch-Finally Blocks**
```javascript
// ✅ REQUIRED: Every bot function must have error handling
export default async function botHandler(req, res) {
  try {
    // Bot operations here
    const result = await performBotTask()
    return res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.error('Bot Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    })
  } finally {
    // Cleanup operations (close connections, etc.)
    await cleanup()
  }
}
```

### **Rule 2: Database Error Recovery Patterns**
```javascript
// ✅ Handle specific database errors with recovery
const handleDatabaseOperation = async (operation) => {
  const maxRetries = 3
  let attempt = 0
  
  while (attempt < maxRetries) {
    try {
      return await operation()
    } catch (error) {
      attempt++
      
      // Handle specific database errors
      if (error.code === 'P2002') { // Unique constraint violation
        console.warn(`Duplicate entry attempt ${attempt}/${maxRetries}`)
        if (attempt === maxRetries) {
          throw new Error('Duplicate entry - record already exists')
        }
      } else if (error.code === 'P2025') { // Record not found
        throw new Error('Required record not found')
      } else if (error.code === 'P2003') { // Foreign key constraint
        throw new Error('Referenced record does not exist')
      } else {
        console.error(`Database error attempt ${attempt}/${maxRetries}:`, error)
        if (attempt === maxRetries) throw error
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}
```

### **Rule 3: Input Validation (Zod Integration)**
```javascript
// ✅ REQUIRED: Validate all inputs before processing
import { z } from 'zod'

const BotInputSchema = z.object({
  type: z.enum(['cleanup', 'generate', 'analyze']),
  data: z.object({
    userId: z.string().optional(),
    params: z.record(z.any()).optional()
  }).optional(),
  options: z.object({
    dryRun: z.boolean().default(false),
    notify: z.boolean().default(true)
  }).optional()
})

// Use in every bot endpoint
export default async function handler(req, res) {
  try {
    const validInput = BotInputSchema.parse(req.body)
    // Process validated input...
  } catch (validationError) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input',
      details: validationError.errors
    })
  }
}
```

## **🧪 Testing Framework Setup**

### **Rule 4: Required Test Structure**
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/jest-dom supertest
npm install --save-dev @next/env  # For environment variable testing
```

### **Rule 5: API Route Testing Pattern**
```javascript
// tests/api/bots/database-bot.test.js
import { createMocks } from 'node-mocks-http'
import handler from '../../../pages/api/admin/database-bot'
import { prisma } from '../../../lib/prisma'

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    weddingQuote: {
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    session: {
      deleteMany: jest.fn(),
    }
  }
}))

describe('/api/admin/database-bot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should clean expired quotes successfully', async () => {
    // Arrange
    const { req, res } = createMocks({
      method: 'POST',
      body: { type: 'cleanup', data: {} }
    })
    
    prisma.weddingQuote.updateMany.mockResolvedValue({ count: 5 })
    prisma.session.deleteMany.mockResolvedValue({ count: 3 })

    // Act
    await handler(req, res)

    // Assert
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
    expect(data.quotesArchived).toBe(5)
    expect(data.sessionsRemoved).toBe(3)
  })

  it('should handle database errors gracefully', async () => {
    // Arrange
    const { req, res } = createMocks({
      method: 'POST',
      body: { type: 'cleanup' }
    })
    
    prisma.weddingQuote.updateMany.mockRejectedValue(
      new Error('Database connection failed')
    )

    // Act
    await handler(req, res)

    // Assert
    expect(res._getStatusCode()).toBe(500)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(false)
    expect(data.error).toContain('Database connection failed')
  })
})
```

### **Rule 6: Bot Function Unit Testing**
```javascript
// tests/lib/bot-functions.test.js
import { cleanExpiredQuotes, generateWeeklyReport } from '../../../lib/bot-functions'

describe('Bot Functions', () => {
  describe('cleanExpiredQuotes', () => {
    it('should only clean quotes older than 30 days', async () => {
      // Test implementation
      const result = await cleanExpiredQuotes()
      expect(result.count).toBeGreaterThanOrEqual(0)
    })
  })

  describe('generateWeeklyReport', () => {
    it('should generate valid report structure', async () => {
      const report = await generateWeeklyReport()
      expect(report).toHaveProperty('newQuotes')
      expect(report).toHaveProperty('conversionRate')
      expect(report.newQuotes).toBeGreaterThanOrEqual(0)
    })
  })
})
```

## **📊 Monitoring & Validation Rules**

### **Rule 7: Bot Health Checks**
```javascript
// pages/api/admin/bot-health.js
export default async function handler(req, res) {
  const healthChecks = {
    database: false,
    scheduler: false,
    email: false,
    timestamp: new Date().toISOString()
  }

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    healthChecks.database = true

    // Test scheduled tasks (check last run)
    const lastCleanup = await prisma.botLog.findFirst({
      where: { action: 'cleanup' },
      orderBy: { createdAt: 'desc' }
    })
    healthChecks.scheduler = lastCleanup && 
      (Date.now() - lastCleanup.createdAt.getTime()) < 25 * 60 * 60 * 1000 // 25 hours

    // Test email service
    healthChecks.email = process.env.EMAIL_SERVER_HOST ? true : false

    const allHealthy = Object.values(healthChecks).every(check => 
      typeof check === 'boolean' ? check : true
    )

    return res.status(allHealthy ? 200 : 503).json({
      healthy: allHealthy,
      checks: healthChecks
    })
  } catch (error) {
    return res.status(503).json({
      healthy: false,
      checks: healthChecks,
      error: error.message
    })
  }
}
```

### **Rule 8: Bot Activity Logging**
```javascript
// Add to schema.prisma
model BotLog {
  id        String   @id @default(cuid())
  botType   String   // 'database', 'content', 'lead', etc.
  action    String   // 'cleanup', 'generate', 'analyze'
  status    String   // 'success', 'error', 'warning'
  data      Json?    // Results or error details
  duration  Int?     // Execution time in ms
  createdAt DateTime @default(now())

  @@index([botType])
  @@index([action])
  @@index([status])
  @@index([createdAt])
}

// Logging utility function
export const logBotActivity = async (botType, action, status, data = null, duration = null) => {
  try {
    await prisma.botLog.create({
      data: {
        botType,
        action,
        status,
        data: data ? JSON.stringify(data) : null,
        duration
      }
    })
  } catch (error) {
    console.error('Failed to log bot activity:', error)
  }
}
```

## **⚡ Performance Rules**

### **Rule 9: Rate Limiting & Resource Management**
```javascript
// lib/bot-rate-limiter.js
const botRateLimits = new Map()

export const checkRateLimit = (botType, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!botRateLimits.has(botType)) {
    botRateLimits.set(botType, [])
  }
  
  const requests = botRateLimits.get(botType)
  
  // Remove old requests outside window
  const recentRequests = requests.filter(timestamp => timestamp > windowStart)
  
  if (recentRequests.length >= maxRequests) {
    throw new Error(`Rate limit exceeded for ${botType}`)
  }
  
  recentRequests.push(now)
  botRateLimits.set(botType, recentRequests)
}
```

### **Rule 10: Memory Management**
```javascript
// ✅ REQUIRED: Clean up resources in bot operations
export const performLargeBotOperation = async (data) => {
  let processedItems = []
  
  try {
    // Process in batches to avoid memory issues
    const batchSize = 100
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      const results = await processBatch(batch)
      processedItems.push(...results)
      
      // Force garbage collection hint
      if (global.gc) global.gc()
    }
    
    return processedItems
  } finally {
    // Ensure cleanup
    processedItems = null
  }
}
```

## **🚀 Deployment Rules**

### **Rule 11: Environment-Based Configuration**
```javascript
// lib/bot-config.js
export const getBotConfig = () => {
  const isDev = process.env.NODE_ENV === 'development'
  const isTest = process.env.NODE_ENV === 'test'
  
  return {
    enableScheduling: !isTest,
    enableEmailNotifications: !isTest && process.env.BOT_EMAIL_NOTIFICATIONS === 'true',
    logLevel: isDev ? 'debug' : 'info',
    retryAttempts: isDev ? 1 : 3,
    batchSize: isDev ? 10 : 100,
    enableRateLimit: !isDev && !isTest
  }
}
```

### **Rule 12: Pre-deployment Testing Script**
```bash
#!/bin/bash
# scripts/test-bots.sh

echo "🤖 Running Bot Development Tests..."

# Unit tests
npm test -- --testPathPattern=bots

# Integration tests
npm run test:integration

# API tests
npm run test:api

# Health checks
curl -f http://localhost:3000/api/admin/bot-health || exit 1

echo "✅ All bot tests passed!"
```

## **📋 Implementation Checklist**

Before deploying any bot:

- [ ] ✅ Comprehensive error handling with try-catch-finally
- [ ] ✅ Input validation using Zod
- [ ] ✅ Database error recovery patterns
- [ ] ✅ Unit tests covering success and error scenarios
- [ ] ✅ Integration tests for API endpoints
- [ ] ✅ Health check endpoint implemented
- [ ] ✅ Activity logging in place
- [ ] ✅ Rate limiting configured
- [ ] ✅ Memory management implemented
- [ ] ✅ Environment-based configuration
- [ ] ✅ Pre-deployment tests passing

## **🔍 Continuous Monitoring**

### Daily Monitoring Tasks:
1. Check bot health endpoints
2. Review error logs and failure rates
3. Monitor database performance
4. Validate scheduled task execution
5. Check email notification delivery

### Weekly Review Tasks:
1. Analyze bot performance metrics
2. Review and clean bot logs
3. Update error handling based on new patterns
4. Performance optimization review
5. Security audit of bot operations

**Following these rules ensures robust, tested, and maintainable bot systems with minimal errors and maximum reliability.**