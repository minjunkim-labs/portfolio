import { defineConfig, devices } from "@playwright/test";

// Tests the built site, not the dev server, so they see what Cloudflare serves.
// --ignore-lock: a preview already running elsewhere makes astro skip starting one.
export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://localhost:4329" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx astro build && npx astro preview --port 4329 --ignore-lock",
    url: "http://localhost:4329",
  },
});
