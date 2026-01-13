import { test, expect } from "@playwright/test";
import { login } from "../../utils/auth";

test("Logowanie", async ({ page }) => {
  await login(page);
});
