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

  async save() {
    await this.page.getByRole("button", { name: "Zapisz" }).click();
  }
}
