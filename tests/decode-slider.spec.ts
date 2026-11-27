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

test("공유 카드·canonical·파비콘이 한 번의 슬래시로 나온다", async ({ page, request }) => {
  await page.goto("/");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toBe("https://portfolio.minjunkim-dev.workers.dev/og.png");
  expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe("https://portfolio.minjunkim-dev.workers.dev/");
  expect((await request.get("/og.png")).status()).toBe(200);
  expect((await request.get("/favicon.svg")).status()).toBe(200);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/favicon.svg");
});

test("404는 noindex이고 canonical·공유 카드가 없다", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
});

test("메뉴 링크의 누르는 영역이 44px 이상이다", async ({ page }) => {
  await page.goto("/");
  for (const link of await page.locator(".site-nav a").all()) {
    const box = await link.boundingBox();
    expect(box!.height + 0.5).toBeGreaterThanOrEqual(44);
  }
});
