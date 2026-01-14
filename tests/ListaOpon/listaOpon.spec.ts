import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { login } from "../../utils/auth";
import { faker } from "@faker-js/faker";
import { ListaOponPage } from "../../pages/ListaOponPage";

let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();

  await login(page);
});

test("TLO-01 - Dodanie opony", async () => {
  const listaOponPage = new ListaOponPage(page);
  await listaOponPage.open();
  await page.getByRole("link", { name: "Dodaj nową oponę" }).click();
  const tire = listaOponPage.generateTireData();
  await listaOponPage.fillAddForm(tire);
  await listaOponPage.save();

  // minimalna, sensowna asercja
  await expect(page.getByText(tire.kod)).toBeVisible();
});
test("TLO-02 - Edycja Opony", async () => {
  await page.goto(`/Opony`);
  await page.getByRole("link", { name: "Edytuj" }).first().click();
  await page.locator("#Typ").fill("Testowa opona+1");
  await page.locator("#Producent").fill("Test+1");
  await page.locator("#Rozmiar").fill("1234567+1");
  await page.locator("#Bieznik").fill("test+1");
  await page.locator("#Sezon").fill("zima+1");
  await page.locator("#RokProdukcji").fill("2025+1");
  await page.locator("#KodTowaru").fill("111111111111111111+1");
  await page.getByRole("button", { name: "Zapisz zmiany" }).click();

  //brak assercji
});
test("TLO-03 - Usunięcie Opony", async () => {
  await page.goto(`/Opony`);
  await page.getByRole("link", { name: "Usuń" }).first().click();
  await page.getByRole("button", { name: "Usuń" }).click();

  //brak assercji i wyboru konkretnego rekordu
});
test("TLO-04 - Walidacje pól wymaganych", async () => {
  await page.goto(`/Opony`);
  await page.getByRole("link", { name: "Dodaj nową oponę" }).click();
  await page.getByRole("button", { name: "Zapisz" }).click();
  //brak assercji
});
test("TLO-05 - Duplikaty", async () => {
  await page.goto(`/Opony`);
  await page.getByRole("link", { name: "Lista Opon" }).click();
  await page.getByRole("link", { name: "Dodaj nową oponę" }).click();
  await page.locator("#Typ").fill("Testowa Opona");
  await page.locator("#Producent").fill("Testowy");
  await page.locator("#Rozmiar").fill("14");
  await page.locator("#Bieznik").fill("15");
  await page.locator("#Sezon").fill("Zima");
  await page.locator("#RokProdukcji").fill("2018");
  await page.locator("#KodTowaru").fill("AutoUnikatowyKod");
  await page.getByRole("button", { name: "Zapisz" }).click();

  await page.getByRole("link", { name: "Lista Opon" }).click();
  await page.getByRole("link", { name: "Dodaj nową oponę" }).click();
  await page.locator("#Typ").fill("Testowa Opona");
  await page.locator("#Producent").fill("Testowy");
  await page.locator("#Rozmiar").fill("14");
  await page.locator("#Bieznik").fill("15");
  await page.locator("#Sezon").fill("Zima");
  await page.locator("#RokProdukcji").fill("2018");
  await page.locator("#KodTowaru").fill("AutoTest001");
  await page.getByRole("button", { name: "Zapisz" }).click();

  //brak assercji
});
test("TLO-06 - Walidacja typów danych", async () => {
  await page.goto(`/Opony`);
  await page.getByRole("link", { name: "Lista Opon" }).click();
  await page.getByRole("link", { name: "Dodaj nową oponę" }).click();
  await page.getByRole("link", { name: "Lista Opon" }).click();
  await page.getByRole("link", { name: "Dodaj nową oponę" }).click();
  await page.locator("#Typ").fill("Testowa Opona");
  await page.locator("#Producent").fill("Testowy");
  await page.locator("#Rozmiar").fill("14");
  await page.locator("#Bieznik").fill("15");
  await page.locator("#Sezon").fill("Zima");
  await page.locator("#RokProdukcji").fill("sadasfaag");
  await page.locator("#KodTowaru").fill("AutoTest001");
  await page.getByRole("button", { name: "Zapisz" }).click();
});
