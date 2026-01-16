import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { login } from "../../utils/auth";
import { ListaOponPage } from "../../pages/ListaOponPage";

let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();

  await login(page);
});

test.describe("@listaOpon - Lista Opon @regresja", () => {
  test("TLO-01 - Dodanie opony", async () => {
    const listaOponPage = new ListaOponPage(page);
    await listaOponPage.open();
    await listaOponPage.add();
    const tire = listaOponPage.generateTireData();
    await listaOponPage.fillAddForm(tire);
    await listaOponPage.save();
    await listaOponPage.clickOK();

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
    await listaOponPage.clickOK();

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
    await listaOponPage.clickOK();

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
    await listaOponPage.clickOK();

    await listaOponPage.expectTireRow(tire);

    // Usunięcie tej konkretnej opony
    await listaOponPage.deleteTire(tire.kod);

    // Opona nie istnieje na liście
    await listaOponPage.expectTireNotPresent(tire.kod);
  });
  test("TLO-04 - Walidacje pól wymaganych", async () => {
    await page.goto(`/Opony`);
    await page.getByRole("link", { name: "Dodaj nową oponę" }).click();
    await page.getByRole("button", { name: "Zapisz" }).click();

    //Asercja
    await expect(page.locator("id=KodTowaru-error")).toBeVisible();
    await expect(page.locator("id=KodTowaru-error")).toHaveText(
      "Kod Opony jest wymagany"
    );
  });
  test("TLO-05 - Duplikaty", async () => {
    const listaOponPage = new ListaOponPage(page);

    // Dodaj pierwszą oponę z określonym kodem
    await listaOponPage.open();
    await listaOponPage.add();
    const tire = listaOponPage.generateTireData();
    await listaOponPage.fillAddForm(tire);
    await listaOponPage.save();
    await listaOponPage.clickOK();
    //Asercja
    await listaOponPage.expectTireRow(tire);

    // Spróbuj dodać oponę z tym samym kodem (duplikat)
    await listaOponPage.add();
    const tireDuplicate = listaOponPage.generateTireData();
    tireDuplicate.kod = tire.kod;
    await listaOponPage.fillAddForm(tireDuplicate);
    await listaOponPage.save();

    // Asercja
    await expect(page.locator('span[data-valmsg-for="KodTowaru"]')).toHaveText(
      "Opona o podanym kodzie towaru już istnieje."
    );
  });
});
