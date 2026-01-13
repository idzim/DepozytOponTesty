import { Page, expect } from "@playwright/test";

export async function login(page: Page) {
  await page.goto(`${process.env.DEPOZYT_URL}`);
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(`${process.env.USER02}`);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(`${process.env.PASSWORD}`);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
}
