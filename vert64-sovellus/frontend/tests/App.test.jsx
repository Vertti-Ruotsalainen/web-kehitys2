import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import App from "../src/App"; // ✅ Tarkista polku!

describe("Käyttäjähallinta", () => {
  it("Näyttää sivun otsikon", () => {
    render(<App />);
    const heading = screen.getByText(/Käyttäjähallinta/i);
    expect(heading).toBeInTheDocument();
  });

  it("Lisää käyttäjän ja näyttää sen taulukossa", async () => {
    render(<App />);

    // Täytetään lomake
    fireEvent.change(screen.getByPlaceholderText("Käyttäjänimi"), { target: { value: "Testikäyttäjä" } });
    fireEvent.change(screen.getByPlaceholderText("Ikä"), { target: { value: "30" } });
    fireEvent.change(screen.getByPlaceholderText("Kaupunki"), { target: { value: "Helsinki" } });

    // Valitaan oikea "Lisää käyttäjä" -nappi
    const addButton = screen.getByRole("button", { name: "Lisää käyttäjä" });
    fireEvent.click(addButton);

    // Odotetaan, että käyttäjä ilmestyy taulukkoon
    await waitFor(() => {
      expect(screen.getByText("Testikäyttäjä")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("Helsinki")).toBeInTheDocument();
    });
  });

  it("Poistaa käyttäjän taulukosta", async () => {
    render(<App />);

    // Lisää käyttäjän ensin
    fireEvent.change(screen.getByPlaceholderText("Käyttäjänimi"), { target: { value: "Poistettava" } });
    fireEvent.change(screen.getByPlaceholderText("Ikä"), { target: { value: "25" } });
    fireEvent.change(screen.getByPlaceholderText("Kaupunki"), { target: { value: "Tampere" } });

    const addButton = screen.getByRole("button", { name: "Lisää käyttäjä" });
    fireEvent.click(addButton);

    // Odotetaan, että käyttäjä on lisätty
    await waitFor(() => {
      expect(screen.getByText("Poistettava")).toBeInTheDocument();
    });

    // **Valitaan vain sen rivin "Poista"-nappi, jossa on "Poistettava"**
    const userRow = screen.getByText("Poistettava").closest("tr"); // Hakee oikean rivin
    const deleteButton = userRow.querySelector("button"); // Löytää sen rivin "Poista"-napin
    fireEvent.click(deleteButton);

    // **Odota modalin avautumista**
    await waitFor(() => {
      expect(screen.getByText("Vahvista poisto")).toBeInTheDocument();
    });

    // **Modalin "Poista"-nappi löytyy aina modalin sisältä**
    const modal = screen.getByRole("dialog"); // Varmistetaan, että modal on näkyvissä
    const confirmDeleteButton = within(modal).getByRole("button", { name: "Poista" });

    fireEvent.click(confirmDeleteButton);

    // Varmistetaan, että käyttäjä poistuu taulukosta
    await waitFor(() => {
      expect(screen.queryByText("Poistettava")).not.toBeInTheDocument();
    });
  });
});
