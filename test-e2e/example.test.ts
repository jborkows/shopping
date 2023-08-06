import { test, expect } from "@playwright/test";

test("shows something", async ({ page }) => {
  await page.goto("/");

  await expect(page).not.toBeNull();

  await page.screenshot({ path: "/tmp/aaa.png", fullPage: true });
});
