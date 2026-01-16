import { Page, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class ListaOponPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto(`/Opony`);
  }

  generateTireData() {
    return {
      typ: `Opona ${faker.commerce.productName()}`,
      producent: faker.company.name(),
      rozmiar: faker.number.int({ min: 13, max: 22 }).toString(),
      bieznik: faker.number.int({ min: 1, max: 20 }).toString(),
      sezon: faker.helpers.arrayElement(["Zima", "Lato", "Całoroczne"]),
      rok: faker.number.int({ min: 2000, max: 2024 }).toString(),
      kod: `AUTO-${faker.string.alphanumeric(8)}`,
    };
  }

  async fillAddForm(tire: ReturnType<ListaOponPage["generateTireData"]>) {
    await this.page.locator("#Typ").fill(tire.typ);
    await this.page.locator("#Producent").fill(tire.producent);
    await this.page.locator("#Rozmiar").fill(tire.rozmiar);
    await this.page.locator("#Bieznik").fill(tire.bieznik);
    await this.page.locator("#Sezon").fill(tire.sezon);
    await this.page.locator("#RokProdukcji").fill(tire.rok);
    await this.page.locator("#KodTowaru").fill(tire.kod);
  }

  async fillEditForm(tire: ReturnType<ListaOponPage["generateTireData"]>) {
    await this.page.locator("#Typ").fill(tire.typ);
    await this.page.locator("#Producent").fill(tire.producent);
    await this.page.locator("#Rozmiar").fill(tire.rozmiar);
    await this.page.locator("#Bieznik").fill(tire.bieznik);
    await this.page.locator("#Sezon").fill(tire.sezon);
    await this.page.locator("#RokProdukcji").fill(tire.rok);
    await this.page.locator("#KodTowaru").fill(tire.kod);
  }

  async openEditByCode(kod: string) {
    const row = this.page.locator("tr", { hasText: kod });
    await row.getByRole("link", { name: "Edytuj" }).click();
  }

  async deleteTire(kod: string) {
    const row = this.page.locator("tr", { hasText: kod });

    await row.getByRole("link", { name: "Usuń" }).click();
    await this.page.getByRole("button", { name: "Usuń" }).click();
  }

  async add() {
    await this.page.getByRole("link", { name: "Dodaj nową oponę" }).click();
  }

  async save() {
    await this.page.getByRole("button", { name: "Zapisz" }).click();
  }

  async edit() {
    await this.page.getByRole("button", { name: "Edytuj" }).click();
  }

  async remove() {
    await this.page.getByRole("button", { name: "Usuń" }).click();
  }
  async clickOK() {
    await this.page.getByRole("button", { name: "OK" }).click();
  }

  async expectTireRow(tire: {
    kod: string;
    typ: string;
    producent: string;
    rozmiar: string;
    sezon: string;
  }) {
    const row = this.page.locator("tr", { hasText: tire.kod });

    await expect(row).toBeVisible();
    await expect(row).toContainText(tire.typ);
    await expect(row).toContainText(tire.producent);
    await expect(row).toContainText(tire.rozmiar);
    await expect(row).toContainText(tire.sezon);
  }

  async expectTireNotPresent(kod: string) {
    await expect(this.page.locator("tr", { hasText: kod })).toHaveCount(0);
  }
}
