import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

if (!process.env.OPENAI_API_KEY) {
  console.warn("Brak OPENAI_API_KEY. Ustaw zmienną środowiskową przed uruchomieniem.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate", async (req, res) => {
  try {
    const { name, job, email, phone, location, education, skills, exp } = req.body;

    if (!name || !job || !exp) {
      return res.status(400).json({
        error: "Imię i nazwisko, stanowisko oraz doświadczenie są wymagane."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Serwer nie ma ustawionego OPENAI_API_KEY."
      });
    }

    const prompt = `
Stwórz profesjonalne CV po polsku na podstawie poniższych danych.

ZASADY:
- Nie wymyślaj faktów, których użytkownik nie podał.
- Możesz poprawić język, uporządkować informacje i profesjonalnie je sformułować.
- Jeśli jakiejś sekcji brakuje, pomiń ją.
- Zwróć samo gotowe CV, bez komentarza od siebie.
- Użyj czytelnych nagłówków i punktów.

DANE:
Imię i nazwisko: ${name}
Stanowisko / zawód: ${job}
E-mail: ${email || "brak danych"}
Telefon: ${phone || "brak danych"}
Miejscowość: ${location || "brak danych"}
Wykształcenie: ${education || "brak danych"}
Umiejętności: ${skills || "brak danych"}
Doświadczenie: ${exp}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Jesteś profesjonalnym doradcą kariery i redaktorem CV."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const cv = response.choices?.[0]?.message?.content?.trim();

    if (!cv) {
      return res.status(500).json({ error: "AI nie zwróciło treści CV." });
    }

    res.json({ cv });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Wystąpił błąd podczas generowania CV."
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Generator CV działa na porcie ${PORT}`);
});
