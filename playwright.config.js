import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    workers: 1,
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
        { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome' } },
        { name: 'edge', use: { browserName: 'chromium', channel: 'msedge' } },
        ...(process.env.PLAYWRIGHT_ALL_ENGINES ? [
            { name: 'firefox', use: { browserName: 'firefox' } },
            { name: 'webkit', use: { browserName: 'webkit' } }
        ] : [])
    ],
    use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173', viewport: { width: 1440, height: 1000 } },
    webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
        command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: false
    }
});
