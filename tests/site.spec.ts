// The package's documented default export is also available as a named export.
// eslint-disable-next-line import/no-named-as-default
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('public site smoke tests', () => {
  test('homepage exposes core SEO metadata and analytics', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Independent web developer/)
    await expect(page.locator('main h1')).toContainText('Make the useful thing')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://loke.dev/'
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /Independent web developer/
    )
    await expect(
      page.locator(
        'script[data-project-id="f08c2acd-2566-41d9-9af5-c34505ca3a1c"]'
      )
    ).toHaveAttribute('src', 'https://api.muroanalytics.com/muro.js')
  })

  for (const route of ['/about', '/projects', '/tools', '/blog']) {
    test(`${route} returns a usable document`, async ({ page }) => {
      const response = await page.goto(route)

      expect(response?.ok()).toBeTruthy()
      await expect(page.locator('main')).toBeVisible()
      await expect(page.locator('main h1')).toBeVisible()
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    })
  }

  test('search rejects queries that are too short', async ({ page }) => {
    const response = await page.goto('/search?q=x')

    expect(response?.status()).toBe(400)
    await expect(page.getByRole('alert')).toContainText(
      'Query must be between 2 and 100 characters.'
    )
  })

  test('robots and sitemap expose crawlable site metadata', async ({
    request,
  }) => {
    const [robots, sitemap] = await Promise.all([
      request.get('/robots.txt'),
      request.get('/sitemap.xml'),
    ])

    expect(robots.ok()).toBeTruthy()
    expect(await robots.text()).toContain(
      'Sitemap: https://loke.dev/sitemap.xml'
    )
    expect(sitemap.ok()).toBeTruthy()
    expect(await sitemap.text()).toContain('<urlset')
  })

  test('homepage has no automated accessibility violations', async ({
    page,
  }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })
})
