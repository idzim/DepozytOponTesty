import { test, expect, BrowserContext, Page } from "@playwright/test";
import { login } from "../../utils/auth";
import { DepozytOponPage } from "../../pages/depozytOponPage";

let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();

  await login(page);
});

test.describe("@depozytOpon - Depozyt Opon", () => {
  test("TDO-01 - Dodanie depozytu", async () => {
    const depozytPage = new DepozytOponPage(page);
    await depozytPage.open();
    await depozytPage.add();
    const deposit = depozytPage.generateDepositData();
    await depozytPage.fillAddForm(deposit);
    await depozytPage.save();
    await depozytPage.clickOK();

    // Asercja
    await depozytPage.expectDepositRow(deposit);
  });

  test("TDO-02 - Edycja depozytu", async () => {
    const depozytPage = new DepozytOponPage(page);

    // Dodanie depozytu
    await depozytPage.open();
    await depozytPage.add();
    const deposit = depozytPage.generateDepositData();
    await depozytPage.fillAddForm(deposit);
    await depozytPage.save();
    await depozytPage.clickOK();

    await depozytPage.expectDepositRow(deposit);

    // Edycja tej samej pozycji - aktualizujemy `imieNazwisko` i `numerTelefonu`
    const updated = {
      ...deposit,
      imieNazwisko: `${deposit.imieNazwisko} - EDIT`,
      numerTelefonu: deposit.numerTelefonu
        ? `${deposit.numerTelefonu}1`
        : "+48000000000",
    };

    await depozytPage.openEditByNumber(deposit.numerBox);
    await depozytPage.fillEditForm(updated);
    await depozytPage.save();
    await depozytPage.clickOK();

    // Asercja — sprawdzamy, że wiersz zawiera zaktualizowane imię i nazwisko
    await depozytPage.expectDepositRow(updated);
  });

  test("TDO-03 - Usunięcie depozytu", async () => {
    const depozytPage = new DepozytOponPage(page);

    // Dodanie depozytu
    await depozytPage.open();
    await depozytPage.add();
    const deposit = depozytPage.generateDepositData();
    await depozytPage.fillAddForm(deposit);
    await depozytPage.save();
    await depozytPage.clickOK();

    await depozytPage.expectDepositRow(deposit);

    // Usunięcie
    await depozytPage.deleteByNumber(deposit.numerBox);

    // Asercja
    await depozytPage.expectDepositNotPresent(deposit.numerBox);
  });

  test("TDO-04 - Walidacje pól wymaganych (NumerBox)", async () => {
    // Otwórz formularz dodawania i spróbuj zapisać bez numeru boxu
    await page.goto(`/DepozytOpon`);
    await page.getByRole("link", { name: "Dodaj nowy depozyt" }).click();
    await page.getByRole("button", { name: "Zapisz" }).click();

    // Asercja
    await expect(page.locator("id=NumerBox-error")).toBeVisible();
    await expect(page.locator("id=NumerBox-error")).toHaveText(
      "Numer Box jest wymagany"
    );
  });

  test("TDO-05 - Duplikaty (NumerBox)", async () => {
    const depozytPage = new DepozytOponPage(page);

    // Dodaj pierwszy depozyt z określonym numerem boxu
    await depozytPage.open();
    await depozytPage.add();
    const deposit = depozytPage.generateDepositData();
    await depozytPage.fillAddForm(deposit);
    await depozytPage.save();
    await depozytPage.clickOK();
    await depozytPage.expectDepositRow(deposit);

    // Spróbuj dodać depozyt z tym samym numerem (duplikat)
    await depozytPage.add();
    const duplicate = depozytPage.generateDepositData();
    duplicate.numerBox = deposit.numerBox;
    await depozytPage.fillAddForm(duplicate);
    await depozytPage.save();

    // Asercja - komunikat o duplikacie
    await expect(page.locator("span[data-valmsg-for]")).toHaveText(
      "Depozyt o podanym numerze BOX już istnieje"
    );
  });
});
