#!/usr/bin/env node

/**
 * BV Studios Website Stress Test
 * Tests all major functionality before production deployment
 */

const https = require('https')
const http = require('http')

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token'

console.log('🧪 Starting BV Studios Website Stress Test...')
console.log(`📍 Testing URL: ${BASE_URL}`)
console.log('')

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  total: 0
}

function logResult(testName, passed, details = '') {
  results.total++
  if (passed) {
    results.passed++
    console.log(`✅ ${testName}`)
  } else {
    results.failed++
    console.log(`❌ ${testName}${details ? ` - ${details}` : ''}`)
  }
}

// HTTP request helper
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)
    const isHttps = url.protocol === 'https:'
    const client = isHttps ? https : http
    
    const req = client.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        ...options.headers
      }
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data)
          resolve({ status: res.statusCode, data: jsonData })
        } catch {
          resolve({ status: res.statusCode, data })
        }
      })
    })
    
    req.on('error', reject)
    
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    
    req.end()
  })
}

// Test functions
async function testHomepage() {
  try {
    const response = await makeRequest('/')
    logResult('Homepage Load', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('Homepage Load', false, error.message)
  }
}

async function testAdminLogin() {
  try {
    const response = await makeRequest('/api/auth/admin-login', {
      method: 'POST',
      body: { username: 'admin', password: 'dominic20' }
    })
    logResult('Admin Login', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('Admin Login', false, error.message)
  }
}

async function testAdminDashboard() {
  try {
    const response = await makeRequest('/admin/dashboard')
    logResult('Admin Dashboard', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('Admin Dashboard', false, error.message)
  }
}

async function testContentManagement() {
  const contentRoutes = [
    '/admin/content/homepage',
    '/admin/content/wedding',
    '/admin/content/portfolio'
  ]
  
  for (const route of contentRoutes) {
    try {
      const response = await makeRequest(route)
      logResult(`Content Management: ${route}`, response.status === 200, `Status: ${response.status}`)
    } catch (error) {
      logResult(`Content Management: ${route}`, false, error.message)
    }
  }
}

async function testMediaManagement() {
  const mediaRoutes = [
    '/admin/media/upload-images',
    '/admin/media/manage-videos',
    '/admin/media/seo-settings'
  ]
  
  for (const route of mediaRoutes) {
    try {
      const response = await makeRequest(route)
      logResult(`Media Management: ${route}`, response.status === 200, `Status: ${response.status}`)
    } catch (error) {
      logResult(`Media Management: ${route}`, false, error.message)
    }
  }
}

async function testAPIEndpoints() {
  const apiEndpoints = [
    '/api/admin/users',
    '/api/admin/projects',
    '/api/admin/content',
    '/api/admin/backup',
    '/api/admin/upload',
    '/api/admin/storage',
    '/api/admin/seo'
  ]
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await makeRequest(endpoint)
      // API endpoints should return 401 (unauthorized) without proper auth, which is expected
      const expectedStatus = endpoint.includes('/admin/') ? 401 : 200
      logResult(`API Endpoint: ${endpoint}`, response.status === expectedStatus, `Status: ${response.status}`)
    } catch (error) {
      logResult(`API Endpoint: ${endpoint}`, false, error.message)
    }
  }
}

async function testWeddingBooking() {
  try {
    const response = await makeRequest('/wedding-booking')
    logResult('Wedding Booking Page', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('Wedding Booking Page', false, error.message)
  }
}

async function testUserAuth() {
  try {
    const response = await makeRequest('/auth')
    logResult('User Authentication', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('User Authentication', false, error.message)
  }
}

async function testDashboard() {
  try {
    const response = await makeRequest('/dashboard')
    logResult('User Dashboard', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('User Dashboard', false, error.message)
  }
}

async function testMyQuotes() {
  try {
    const response = await makeRequest('/my-quotes')
    logResult('My Quotes Page', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('My Quotes Page', false, error.message)
  }
}

async function testWeddingPackages() {
  try {
    const response = await makeRequest('/api/wedding/packages')
    logResult('Wedding Packages API', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('Wedding Packages API', false, error.message)
  }
}

async function testWeddingAddons() {
  try {
    const response = await makeRequest('/api/wedding/addons')
    logResult('Wedding Addons API', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('Wedding Addons API', false, error.message)
  }
}

async function testWeddingVenues() {
  try {
    const response = await makeRequest('/api/wedding/venues')
    logResult('Wedding Venues API', response.status === 200, `Status: ${response.status}`)
  } catch (error) {
    logResult('Wedding Venues API', false, error.message)
  }
}

// Main test runner
async function runStressTest() {
  console.log('🚀 Starting comprehensive stress test...\n')
  
  // Test core pages
  await testHomepage()
  await testUserAuth()
  await testDashboard()
  await testMyQuotes()
  await testWeddingBooking()
  
  // Test admin functionality
  await testAdminLogin()
  await testAdminDashboard()
  await testContentManagement()
  await testMediaManagement()
  
  // Test API endpoints
  await testAPIEndpoints()
  await testWeddingPackages()
  await testWeddingAddons()
  await testWeddingVenues()
  
  // Print results
  console.log('\n📊 Test Results Summary:')
  console.log(`✅ Passed: ${results.passed}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`📈 Total: ${results.total}`)
  console.log(`📊 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`)
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Website is ready for production.')
    process.exit(0)
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues before production deployment.')
    process.exit(1)
  }
}

// Run the stress test
runStressTest().catch(error => {
  console.error('💥 Stress test failed:', error)
  process.exit(1)
}) 