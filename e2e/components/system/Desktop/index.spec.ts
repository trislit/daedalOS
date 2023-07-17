import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  ACCESSIBILITY_EXCEPTION_IDS,
  BACKGROUND_CANVAS_SELECTOR,
  CONTEXT_MENU_SELECTOR,
  DESKTOP_FILE_ENTRY_SELECTOR,
  DESKTOP_MENU_ITEMS,
  EXACT,
  RIGHT_CLICK,
  TASKBAR_ENTRY_SELECTOR,
} from "e2e/constants";

test.describe("desktop", () => {
  test.beforeEach(async ({ page }) => page.goto("/"));

  test("pass accessibility scan", async ({ page }) =>
    expect(
      (
        await new AxeBuilder({ page })
          .disableRules(ACCESSIBILITY_EXCEPTION_IDS)
          .analyze()
      ).violations
    ).toEqual([]));

  test("has background", async ({ page }) => {
    await expect(page.locator(BACKGROUND_CANVAS_SELECTOR)).toBeVisible();
  });

  test("has file entry", async ({ page }) => {
    await expect(
      page.locator(DESKTOP_FILE_ENTRY_SELECTOR).first()
    ).toBeVisible();
  });

  // TODO: has grid (move file on grid)

  test.describe("has context menu", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("main").click(RIGHT_CLICK);
    });

    test("with items", async ({ browserName, page }) => {
      const MENU_ITEMS = Object.entries(DESKTOP_MENU_ITEMS).map(
        ([label, shown]) => [
          label,
          typeof shown === "boolean" ? shown : shown(browserName),
        ]
      );
      const menuItems = page.locator(CONTEXT_MENU_SELECTOR);

      for (const [label, shown] of MENU_ITEMS) {
        // eslint-disable-next-line no-await-in-loop
        await expect(menuItems.getByLabel(label as string, EXACT))[
          shown ? "toBeVisible" : "toBeHidden"
        ]();
      }
    });

    test("can change background", async ({ page }) => {
      await page.getByLabel(/^Background$/).click();
      await page.getByLabel(/^APOD$/).click();

      await expect(page.locator(BACKGROUND_CANVAS_SELECTOR)).toBeHidden();

      // TODO: Expect html background change
    });

    test("can create folder", async ({ page }) => {
      await page.getByLabel(/^New$/).click();
      await page.getByLabel(/^Folder$/).click();

      await page.getByRole("main").click();

      await expect(page.getByLabel(/^New folder$/)).toBeVisible();
    });

    test("can create file", async ({ page }) => {
      await page.getByLabel(/^New$/).click();
      await page.getByLabel(/^Text Document$/).click();

      await page.getByRole("main").click();

      await expect(page.getByLabel(/^New Text Document.txt$/)).toBeVisible();
    });

    // TODO: can create shortcut (expect prepended name & icon)
    // TODO: can upload file
    // TODO: can open terminal
    // TODO: can view page source
    // TODO: can inspect page
  });

  test.describe("has keyboard shortcuts", () => {
    test("ctrl + shift + r (open run dialog)", async ({ page }) => {
      await page.getByRole("main").press("Control+Shift+KeyR");

      await expect(
        page.locator(TASKBAR_ENTRY_SELECTOR).getByLabel(/^Run$/)
      ).toBeVisible();
    });

    // TODO: Ctrl+Shift: D, E, ESCAPE, F10, F12, F5
    // TODO: F11, Arrows
  });
});
