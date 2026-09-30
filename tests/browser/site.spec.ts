import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [375, 768, 1024, 1440]) test(`responsive layout ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  for (const url of ["/", "/projects", "/contact", "/about"]) {
    await page.goto(url); await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
test("mobile menu traps focus, closes and restores trigger", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); await page.goto("/contact");
  const trigger = page.getByRole("button", { name: "Open navigation menu" }); await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navigation", exact: true }); await expect(dialog).toBeVisible();
  for (let i = 0; i < 10; i++) { await page.keyboard.press("Tab"); expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true); }
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
});
test("projects page shows an intentional unpublished state", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByText("The collection is not published yet.")).toBeVisible();
  await expect(page.locator(".project-filters")).toHaveCount(0);
});
test("all enabled project enquiry actions remain reachable", async ({ page }) => {
  await page.goto("/kitchen-sink");
  for (const name of ["Enquire now", "Schedule a site visit", "Request a callback", "Download brochure"]) {
    await page.getByRole("button", { name, exact: true }).click();
    const dialog = page.getByRole("dialog", { name, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Full name")).toBeVisible();
    if (name === "Schedule a site visit") await expect(dialog.getByLabel("Preferred visit date")).toBeVisible();
    if (name === "Schedule a site visit" || name === "Request a callback") await expect(dialog.getByLabel("Preferred time")).toBeVisible();
    await page.keyboard.press("Escape");
  }
});
test("homepage site visit preserves scheduling intent through submission", async ({ page }) => {
  await page.route("**/api/lead", async route => {
    const body = route.request().postDataJSON();
    expect(body.formType).toBe("site-visit");
    expect(body.preferredDate).toBe("2099-01-01");
    expect(body.preferredTime).toBe("Morning (9am – 12pm)");
    await route.fulfill({ status: 200, json: { success: true } });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Schedule a Site Visit", exact: true }).click();
  await expect(page).toHaveURL(/\/contact\?intent=site-visit#enquiry/);
  await expect(page.getByLabel("How can we help?")).toHaveValue("site-visit");
  await page.getByLabel("Full name").fill("Test Person");
  await page.getByLabel("Phone number").fill("9876543210");
  await page.getByLabel("Preferred visit date").fill("2099-01-01");
  await page.getByRole("combobox", { name: "Preferred time", exact: true }).selectOption("Morning (9am – 12pm)");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Request site visit", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Your request is saved.");
});
test("desktop categories occupy three equal columns", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const widths = await page.locator(".categories-scroll").evaluate(el => ({
    row: el.getBoundingClientRect().width,
    gap: parseFloat(getComputedStyle(el).columnGap),
    items: Array.from(el.children).map(child => child.getBoundingClientRect().width),
    images: Array.from(el.querySelectorAll('.category-col img')).map(image => image.getBoundingClientRect().height),
  }));
  expect(widths.items).toHaveLength(3);
  for (const width of widths.items) expect(Math.abs(width - (widths.row - widths.gap * 2) / 3)).toBeLessThan(1);
  expect(Math.max(...widths.images) - Math.min(...widths.images)).toBeLessThan(1);
});
test("gallery opens, browses, zooms, closes", async ({ page }) => {
  await page.goto("/kitchen-sink");
  const trigger = page.locator("#gallery button").first(); await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Gallery", exact: true }); await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Next", exact: true }).click(); await expect(dialog.getByText("2 / 2")).toBeVisible();
  await dialog.getByRole("button", { name: "Zoom in", exact: true }).click(); await expect(dialog.getByRole("button", { name: "Zoom out", exact: true })).toBeEnabled();
  await page.keyboard.press("ArrowLeft"); await expect(dialog.getByText("1 / 2")).toBeVisible();
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
});
test("brochure requires a form and reveals link only after success", async ({ page }) => {
  await page.route("**/api/lead", async route => { const body = route.request().postDataJSON(); expect(body.formType).toBe("brochure"); await route.fulfill({ status: 200, json: { success: true, brochureUrl: "/preview/layout.svg" } }); });
  await page.goto("/kitchen-sink"); await page.getByRole("button", { name: "Download brochure", exact: true }).click();
  const dialog = page.getByRole("dialog"); await expect(dialog.getByRole("link", { name: "Download brochure" })).toHaveCount(0);
  await dialog.getByLabel("Full name").fill("Test Person"); await dialog.getByLabel("Phone number").fill("9876543210"); await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Request brochure" }).click(); await expect(dialog.getByRole("link", { name: "Download brochure" })).toBeVisible();
});
test("failed lead stays on form with an error", async ({ page }) => {
  await page.route("**/api/lead", route => route.fulfill({ status: 503, json: { success: false, error: "Could not save request" } }));
  await page.goto("/contact"); await page.getByLabel("Full name").fill("Test Person"); await page.getByLabel("Phone number").fill("9876543210"); await page.getByRole("checkbox").check(); await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("form [role=alert]")).toContainText("Could not save request"); await expect(page.getByLabel("Full name")).toHaveValue("Test Person");
});
for (const route of ["/", "/contact", "/about"]) test(`accessibility ${route}`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto(route);
  const results = await new AxeBuilder({ page }).analyze(); expect(results.violations.filter(v => ["critical", "serious"].includes(v.impact || "")).map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, reason: n.failureSummary })) }))).toEqual([]);
});
test("preview cannot be indexed and unknown project returns 404", async ({ request }) => {
  const robots = await request.get("/robots.txt"); expect(await robots.text()).toContain("Disallow: /");
  expect((await request.get("/projects/does-not-exist")).status()).toBe(404);
});
test("map loads only after explicit interaction", async ({ page }) => {
  await page.route("https://www.google.com/maps**", route => route.fulfill({ contentType: "text/html", body: "<p>Map test</p>" }));
  await page.goto("/kitchen-sink"); await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Load Map", exact: true }).click(); await expect(page.locator("iframe")).toHaveCount(1);
});
test("screenshots for desktop and mobile review", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/contact"); await page.screenshot({ path: "artifacts/contact-desktop.png" });
  await page.goto("/kitchen-sink"); await page.locator("#floor-plans").scrollIntoViewIfNeeded(); await expect(page.locator("#floor-plans img")).toHaveJSProperty("complete", true); await expect(page.locator("#floor-plans img")).not.toHaveJSProperty("naturalWidth", 0); await page.screenshot({ path: "artifacts/plans-desktop.png" });
  await page.setViewportSize({ width: 375, height: 812 }); await page.goto("/projects"); await expect(page.getByText("The collection is not published yet.")).toBeVisible(); await page.screenshot({ path: "artifacts/projects-mobile.png" });
});
