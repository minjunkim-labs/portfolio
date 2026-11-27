import { expect, test } from "@playwright/test";

test("이미지 크기 슬라이더가 계산된 메모리를 바꾼다", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator("#decode-size");
  await expect(slider).toHaveAccessibleName("디코딩할 이미지 크기");
  await expect(page.locator("#decode-px")).toHaveText("9432×17328px");
  await expect(page.locator("#decode-mem")).toHaveText("약 653MB");
  await expect(page.locator("#decode-verdict")).toHaveText("앱이 강제 종료됐던 크기");

  await slider.fill("0");
  await expect(page.locator("#decode-px")).toHaveText("642×1179px");
  await expect(page.locator("#decode-mem")).toHaveText("약 3MB");
  await expect(page.locator("#decode-verdict")).toHaveText("고친 뒤 크기");

  // Keyboard: End jumps back to the original size.
  await slider.focus();
  await page.keyboard.press("End");
  await expect(page.locator("#decode-mem")).toHaveText("약 653MB");
});
