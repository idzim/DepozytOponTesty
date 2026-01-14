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
  await listaOponPage.add();
  const tire = listaOponPage.generateTireData();
  await listaOponPage.fillAddForm(tire);
  await listaOponPage.save();

  //Asercja
  await listaOponPage.expectTireRow(tire);
});
test("TLO-02 - Edycja Opony", async () => {
  const listaOponPage = new ListaOponPage(page);

  // Dodanie opony
  await listaOponPage.open();
  await listaOponPage.add();
  const tire = listaOponPage.generateTireData();

  await listaOponPage.fillAddForm(tire);
  await listaOponPage.save();

  await listaOponPage.expectTireRow(tire);

  // Edycja tej samej opony
  const updatedTire = {
    ...tire,
    typ: `${tire.typ} - EDIT`,
    producent: `${tire.producent} - EDIT`,
  };

  await listaOponPage.openEditByCode(tire.kod);
  await listaOponPage.fillEditForm(updatedTire);
  await listaOponPage.save();

  // Asercja
  await listaOponPage.expectTireRow(updatedTire);
});
test("TLO-03 - Usunięcie opony", async () => {
  const listaOponPage = new ListaOponPage(page);

  // Dodanie opony
  await listaOponPage.open();
  await listaOponPage.add();
  const tire = listaOponPage.generateTireData();

  await listaOponPage.fillAddForm(tire);
  await listaOponPage.save();

  await listaOponPage.expectTireRow(tire);

  // Usunięcie tej konkretnej oponyH
  await listaOponPage.deleteTire(tire.kod);

  // Opona nie istnieje na liście
  await listaOponPage.expectTireNotPresent(tire.kod);
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
