import { test, expect } from '@playwright/test'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

test.describe('BV Studios Website Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('should navigate to all main sections via navigation menu', async ({ page }) => {
    // Test Home navigation
    await page.click('text=Home')
    await expect(page.locator('#home')).toBeVisible()
    
    // Test Services navigation
    await page.click('text=Services')
    await expect(page.locator('#services')).toBeVisible()
    await expect(page.locator('text=Our Services')).toBeVisible()
    
    // Test Portfolio navigation
    await page.click('text=Portfolio')
    await expect(page.locator('#portfolio')).toBeVisible()
    await expect(page.locator('text=Our Portfolio')).toBeVisible()
    
    // Test About navigation
    await page.click('text=About')
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.locator('text=About BV Studios')).toBeVisible()
    
    // Test Contact navigation
    await page.click('text=Contact')
    await expect(page.locator('#contact')).toBeVisible()
    await expect(page.locator('text=Get In Touch')).toBeVisible()
  })

  test('should navigate to wedding page', async ({ page }) => {
    await page.click('text=Weddings')
    await page.waitForURL('**/weddings')
    await expect(page.locator('text=Wedding Films')).toBeVisible()
  })

  test('should show hero section CTAs work correctly', async ({ page }) => {
    // Test "View Our Work" button
    await page.click('text=View Our Work')
    await expect(page.locator('#portfolio')).toBeVisible()
    
    // Navigate back to home and test "Get Started" button
    await page.click('text=Home')
    await page.click('text=Get Started')
    await expect(page.locator('#contact')).toBeVisible()
  })

  test('should handle mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Click mobile menu button
    await page.click('[aria-label="Menu"], .md\\:hidden button')
    
    // Test mobile navigation items
    await page.click('text=Services')
    await expect(page.locator('#services')).toBeVisible()
    
    // Menu should close after clicking
    await expect(page.locator('.md\\:hidden .space-y-4')).not.toBeVisible()
  })

  test('should redirect auth links to signin page', async ({ page }) => {
    // Test main "Get Started" button
    await page.click('text=Get Started')
    await page.waitForURL('**/auth/signin')
    await expect(page.locator('text=Sign In')).toBeVisible()
  })

  test('should test 404 page', async ({ page }) => {
    await page.goto(`${BASE_URL}/non-existent-page`)
    await expect(page.locator('text=404')).toBeVisible()
    await expect(page.locator('text=Page Not Found')).toBeVisible()
    
    // Test "Back to Home" button
    await page.click('text=Back to Home')
    await page.waitForURL(BASE_URL)
    await expect(page.locator('text=BV Studios')).toBeVisible()
  })
})

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.click('text=Contact')
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button:has-text("Send Message")')
    
    // Check for HTML5 validation or custom error messages
    const nameField = page.locator('input[name="name"]')
    const emailField = page.locator('input[name="email"]')
    const messageField = page.locator('textarea[name="message"]')
    
    await expect(nameField).toHaveAttribute('required')
    await expect(emailField).toHaveAttribute('required')
    await expect(messageField).toHaveAttribute('required')
  })

  test('should submit contact form successfully', async ({ page }) => {
    // Fill out the form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('textarea[name="message"]', 'This is a test message.')
    
    // Submit form
    await page.click('button:has-text("Send Message")')
    
    // Wait for success message (alert or other feedback)
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Thank you')
      await dialog.accept()
    })
  })

  test('should show contact information', async ({ page }) => {
    await expect(page.locator('text=Contact Information')).toBeVisible()
    await expect(page.locator('a[href="mailto:info@bvstudios.com"]')).toBeVisible()
    await expect(page.locator('a[href="tel:+18595550123"]')).toBeVisible()
    await expect(page.locator('text=Lexington, Kentucky')).toBeVisible()
  })
})

test.describe('Wedding Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/weddings`)
  })

  test('should display wedding packages', async ({ page }) => {
    await expect(page.locator('text=Silver Collection')).toBeVisible()
    await expect(page.locator('text=Gold Collection')).toBeVisible()
    await expect(page.locator('text=Diamond Collection')).toBeVisible()
    
    // Check pricing
    await expect(page.locator('text=$2,200')).toBeVisible()
    await expect(page.locator('text=$3,100')).toBeVisible()
    await expect(page.locator('text=$4,500')).toBeVisible()
  })

  test('should have working CTA buttons', async ({ page }) => {
    // Test "View Our Films" button
    await page.click('text=View Our Films')
    await expect(page.locator('#portfolio')).toBeVisible()
    
    // Test "Sign In to Book" buttons (should go to signin page)
    await page.click('text=Sign In to Book >> nth=0')
    await page.waitForURL('**/auth/signin')
  })

  test('should show additional services', async ({ page }) => {
    await expect(page.locator('text=Additional Services')).toBeVisible()
    await expect(page.locator('text=Ceremony Film')).toBeVisible()
    await expect(page.locator('text=Engagement Film')).toBeVisible()
    await expect(page.locator('text=Drone Footage')).toBeVisible()
  })
})

test.describe('SEO and Meta Tags', () => {
  test('should have proper meta tags on home page', async ({ page }) => {
    await page.goto(BASE_URL)
    
    const title = await page.title()
    expect(title).toContain('BV Studios')
    expect(title).toContain('Video Production')
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /video production/i)
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /bluevstudio\.com/)
  })

  test('should have proper Open Graph tags', async ({ page }) => {
    await page.goto(BASE_URL)
    
    const ogTitle = page.locator('meta[property="og:title"]')
    const ogDescription = page.locator('meta[property="og:description"]')
    const ogUrl = page.locator('meta[property="og:url"]')
    
    await expect(ogTitle).toHaveAttribute('content', /BV Studios/)
    await expect(ogDescription).toHaveAttribute('content', /video production/i)
    await expect(ogUrl).toHaveAttribute('content', /bluevstudio\.com/)
  })
})