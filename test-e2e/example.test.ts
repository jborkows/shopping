import { test, expect } from "@playwright/test";

test("shows something", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page).not.toBeNull();
  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
