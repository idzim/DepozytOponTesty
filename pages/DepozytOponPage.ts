// ...existing code...
import { Page, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class DepozytOponPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto(`/`);
    await this.page.waitForLoadState("networkidle");
  }

  async add() {
    await this.page.getByRole("link", { name: "Dodaj depozyt" }).click();
  }

  generateDepositData() {
    const unique = Date.now().toString().slice(-6);
    return {
      numerBox: `BOX-${unique}`,
      imieNazwisko: faker.person.fullName(),
      numerTelefonu: "+48" + faker.string.numeric(9),
      markaPojazdu: faker.vehicle.manufacturer(),
      rejestracjaPojazdu: `${faker.string
        .alphanumeric(3)
        .toUpperCase()}-${faker.number.int({ min: 100, max: 999 })}`,
      // oponaId: must come from existing select options on the page;
      // leave undefined so fillAddForm selects an existing option when available
      oponaId: `dummy`,
      ilosc: faker.number.int({ min: 1, max: 20 }),
      notatka: `Automatyczna notatka ${unique}`,
    };
  }

  async fillAddForm(
    deposit: ReturnType<DepozytOponPage["generateDepositData"]>
  ) {
    if (deposit.numerBox !== undefined) {
      await this.page.locator("#NumerBOX").fill(String(deposit.numerBox));
    }
    if (deposit.imieNazwisko !== undefined) {
      await this.page
        .locator('[name="ImieNazwisko"]')
        .fill(String(deposit.imieNazwisko));
    }
    if (deposit.numerTelefonu !== undefined) {
      await this.page
        .locator('[name="NumerTelefonu"]')
        .fill(String(deposit.numerTelefonu));
    }
    if (deposit.markaPojazdu !== undefined) {
      await this.page
        .locator('[name="MarkaPojazdu"]')
        .fill(String(deposit.markaPojazdu));
    }
    if (deposit.rejestracjaPojazdu !== undefined) {
      await this.page
        .locator('[name="RejestracjaPojazdu"]')
        .fill(String(deposit.rejestracjaPojazdu));
    }
    if (deposit.oponaId !== undefined) {
      const firstVal = await this.page.evaluate(() => {
        const sel = document.querySelector(
          "#OponaId"
        ) as HTMLSelectElement | null;
        if (!sel) return null;
        const opt = Array.from(sel.options).find(
          (o) => o.value && o.value.trim() !== ""
        );
        return opt ? opt.value : null;
      });
      if (firstVal) await this.page.locator("#OponaId").selectOption(firstVal);
    }
    if (deposit.ilosc !== undefined) {
      await this.page.locator('[name="Ilosc"]').fill(String(deposit.ilosc));
    }
    if (deposit.notatka !== undefined) {
      await this.page.locator('[name="Notatka"]').fill(String(deposit.notatka));
    }
  }

  async fillEditForm(
    deposit: ReturnType<DepozytOponPage["generateDepositData"]>
  ) {
    await this.fillAddForm(deposit);
  }

  async save() {
    await this.page.getByRole("button", { name: "Zapisz" }).click();
  }

  async clickOK() {
    const ok = this.page.getByRole("button", { name: "OK" });
    if (await ok.count()) {
      await ok.click();
    } else {
      const okText = this.page.locator('button:has-text("OK")');
      if (await okText.count()) await okText.first().click();
    }
  }

  async expectDepositRow(
    deposit: ReturnType<DepozytOponPage["generateDepositData"]>
  ) {
    const row = this.page.locator("tr", { hasText: deposit.numerBox });
    await expect(row).toBeVisible();
    if (deposit.imieNazwisko)
      await expect(row).toContainText(deposit.imieNazwisko);
    if (deposit.markaPojazdu)
      await expect(row).toContainText(deposit.markaPojazdu);
    if (deposit.rejestracjaPojazdu)
      await expect(row).toContainText(deposit.rejestracjaPojazdu);
    if (deposit.ilosc !== undefined)
      await expect(row).toContainText(String(deposit.ilosc));
  }

  async expectDepositNotPresent(numerBox: string) {
    const row = this.page.locator("tr", { hasText: numerBox });
    await expect(row).toHaveCount(0);
  }

  async openEditByNumber(numerBox: string) {
    const row = this.page.locator("tr", { hasText: numerBox });
    const editLink = row.getByRole("link", { name: "Edytuj" });
    if (await editLink.count()) {
      await editLink.click();
      return;
    }
    const editBtn = row.getByRole("button", { name: "Edytuj" });
    if (await editBtn.count()) {
      await editBtn.click();
      return;
    }
    const anyBtn = row.locator(
      'a:has-text("Edytuj"), button:has-text("Edit"), a:has-text("Edit")'
    );
    if (await anyBtn.count()) await anyBtn.first().click();
  }

  async deleteByNumber(numerBox: string) {
    const row = this.page.locator("tr", { hasText: numerBox });
    const delLink = row.getByRole("link", { name: "Usuń" });
    if (await delLink.count()) {
      await delLink.click();
    } else {
      const delBtn = row.getByRole("button", { name: "Usuń" });
      if (await delBtn.count()) await delBtn.click();
    }
    const confirm = this.page.getByRole("button", { name: "OK" });
    if (await confirm.count()) await confirm.click();
  }
}
