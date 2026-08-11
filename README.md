# Generator CV

Projekt: formularz danych -> OpenAI -> gotowe CV -> PDF.

## Uruchomienie lokalnie

1. Zainstaluj Node.js 18+.
2. W terminalu:
   npm install
3. Ustaw klucz OpenAI:
   - Windows PowerShell: $env:OPENAI_API_KEY="TWÓJ_KLUCZ"
   - macOS/Linux: export OPENAI_API_KEY="TWÓJ_KLUCZ"
4. Uruchom:
   npm start
5. Otwórz:
   http://localhost:3000

## Wdrożenie za darmo na Render

1. Wrzuć cały projekt na GitHub.
2. W Render wybierz New -> Web Service.
3. Podłącz repozytorium.
4. Build Command: npm install
5. Start Command: npm start
6. Instance Type: Free
7. Dodaj Environment Variable:
   OPENAI_API_KEY = Twój klucz OpenAI
8. Wdróż.

Uwaga: darmowy web service na Render usypia się po okresie bez ruchu, więc pierwsze wejście po przerwie może potrwać około minuty.
