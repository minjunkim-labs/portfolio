import { expect, test } from "@playwright/test";

test("iPhone 버튼이 수정 전후를 바꾸고, 키보드로도 되돌린다", async ({ page }) => {
  await page.goto("/");
  const screen = page.locator("#replay-screen");
  const state = page.locator("#replay-state");
  // The button renames itself, so find it by id and check its name in each state.
  const toggle = page.locator("#replay-toggle");

  await expect(screen).not.toHaveClass(/(^|\s)fixed(\s|$)/);
  await expect(state).toHaveText("스플래시에서 멈춤");
  await expect(state).toHaveAttribute("aria-live", "polite");
  await expect(toggle).toHaveAccessibleName("수정 후 보기");

  await toggle.click();
  await expect(screen).toHaveClass(/(^|\s)fixed(\s|$)/);
  await expect(state).toHaveText("첫 callback 뒤 초기화를 다시 실행");
  await expect(toggle).toHaveText("수정 전 보기");

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(screen).not.toHaveClass(/(^|\s)fixed(\s|$)/);
  await expect(state).toHaveText("스플래시에서 멈춤");
  await expect(toggle).toHaveText("수정 후 보기");

  await page.keyboard.press("Space");
  await expect(screen).toHaveClass(/(^|\s)fixed(\s|$)/);
});
