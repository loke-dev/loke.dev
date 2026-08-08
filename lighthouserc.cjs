const baseUrl = process.env.BASE_URL ?? 'https://loke.dev'

module.exports = {
  ci: {
    collect: {
      url: ['/', '/about', '/blog', '/projects', '/tools'].map(
        (route) => `${baseUrl}${route}`
      ),
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox',
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        // Third-party scripts can trigger deprecation warnings outside our control.
        // Keep the signal visible without blocking deploys on vendor code.
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.7 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './.lighthouse' },
  },
}
