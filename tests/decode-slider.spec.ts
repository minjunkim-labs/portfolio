import { expect, test } from "@playwright/test";

test("이미지 크기 슬라이더가 계산된 메모리를 바꾼다", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator("#decode-size");
  await expect(slider).toHaveAccessibleName("이미지 크기");
  await expect(page.locator("#decode-px")).toHaveText("9432×17328px");
  await expect(page.locator("#decode-mem")).toHaveText("약 653MB");
  await expect(page.locator("#decode-verdict")).toHaveText("앱이 강제 종료됐던 크기");

  await slider.fill("0");
  await expect(page.locator("#decode-px")).toHaveText("642×1179px");
  await expect(page.locator("#decode-mem")).toHaveText("약 3MB");
  await expect(page.locator("#decode-verdict")).toHaveText("고친 뒤 크기");

  // Mid value follows the formula: long side 1179 * (17328/1179)^0.5 = 4520, width 2460, 2460*4520*4 bytes.
  await slider.fill("50");
  await expect(page.locator("#decode-px")).toHaveText("2460×4520px");
  await expect(page.locator("#decode-mem")).toHaveText("약 44MB");

  // Keyboard: End jumps back to the original size.
  await slider.focus();
  await page.keyboard.press("End");
  await expect(page.locator("#decode-mem")).toHaveText("약 653MB");
});

test("PC 너비에서도 제목이 글자 하나씩 세로로 꺾이지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const h1 = await page.locator("h1").boundingBox();
  const phone = await page.locator(".phone").boundingBox();
  expect(h1!.width).toBeGreaterThan(400);
  expect(h1!.height).toBeLessThan(250);
  expect(phone!.x).toBeGreaterThan(h1!.x + h1!.width - 1);
});
