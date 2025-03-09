import { test, expect } from "@playwright/test";

test("Lisää käyttäjän ja tarkistaa, että se ilmestyy taulukkoon", async ({ page }) => {
  await page.goto("http://localhost:3001"); // ⚠️ Tarkista oikea osoite!

  await page.fill("input[placeholder='Käyttäjänimi']", "E2E-testi");
  await page.fill("input[placeholder='Ikä']", "35");
  await page.fill("input[placeholder='Kaupunki']", "Espoo");
  await page.click("button:has-text('Lisää käyttäjä')");

  // Varmistetaan, että käyttäjä ilmestyy taulukkoon
  await expect(page.locator("table")).toContainText("E2E-testi");
});

test("Poistaa käyttäjän ja varmistaa, että se ei ole enää taulukossa", async ({ page }) => {
  await page.goto("http://localhost:3001"); // ⚠️ Tarkista oikea osoite!

  await page.fill("input[placeholder='Käyttäjänimi']", "PoistettavaE2E");
  await page.fill("input[placeholder='Ikä']", "40");
  await page.fill("input[placeholder='Kaupunki']", "Turku");
  await page.click("button:has-text('Lisää käyttäjä')");

  // Odota, että käyttäjä ilmestyy taulukkoon
  await expect(page.locator("table")).toContainText("PoistettavaE2E");

  // Klikkaa ensimmäistä "Poista" nappia
  await page.click("tbody tr:has-text('PoistettavaE2E') button:has-text('Poista')");

  // Vahvista poisto modalista
  await page.click("div[role='dialog'] button:has-text('Poista')");

  // Varmista, että käyttäjää ei enää ole
  await expect(page.locator("table")).not.toContainText("PoistettavaE2E");
});
