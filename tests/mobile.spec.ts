import { expect, test } from '@playwright/test'

test('mobile navigation can close, navigate, and open again', async ({
  page,
}) => {
  await page.goto('/')

  const menuButton = page.locator('[data-mobile-nav-open]:visible')
  const dialog = page.locator('#mobile-nav-dialog')

  await menuButton.click()
  await expect(dialog).toBeVisible()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

  await dialog.getByRole('link', { name: 'Blog', exact: true }).click()
  await expect(page).toHaveURL(/\/blog$/)
  await expect(dialog).not.toBeVisible()

  await page.locator('[data-mobile-nav-open]:visible').click()
  await expect(page.locator('#mobile-nav-dialog')).toBeVisible()
})
