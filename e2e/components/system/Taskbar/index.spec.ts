import { expect, test } from "@playwright/test";

test("has start button", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByLabel("Start")).toBeVisible();
});

test("has taskbar entry", async ({ page }) => {
  await page.goto("/?app=FileExplorer");

  const entries = page.locator("main>nav>ol>li");

  await expect(entries).toHaveCount(1);

  const entry = entries.getByLabel("My PC");

  await expect(entry).toBeVisible();
  await expect(entry.locator("img")).toHaveAttribute(
    "src",
    /\/pc\.(webp|png)$/
  );
});

test.describe("has clock", () => {
  const clockTextRegEx = /^(1[0-2]|0?[1-9])(?::[0-5]\d){2}\s?(AM|PM)$/;

  test("via canvas", async ({ browserName, page }) => {
    const unSupportedBrowsers = [
      "webkit", // No OffscreenCanvas support in Worker
    ];
    await page.goto("/");

    const clock = page.getByLabel("Clock");

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (unSupportedBrowsers.includes(browserName)) {
      await expect(clock).toContainText(clockTextRegEx);
    } else {
      await expect(clock).toBeEmpty();
      await expect(clock.locator("canvas")).toBeVisible();
    }
  });

  test("via text", async ({ page }) => {
    await page.addInitScript(() => {
      delete (window as Partial<Window & typeof globalThis>).OffscreenCanvas;
    });

    await page.goto("/");

    await expect(page.getByLabel("Clock")).toContainText(clockTextRegEx);
  });
});

test("has calendar", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Clock").click();

  await expect(page.getByLabel("Calendar")).toBeVisible();
});
