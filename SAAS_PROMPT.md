# SAAS Prompt Template — für Antigravity / KI

Diese Datei enthält eine wiederverwendbare, ausführliche Prompt-Vorlage (auf Deutsch) für das aktuelle Next.js Projekt (nexal). Ziel: Du beschreibst später nur noch die _Funktion_ deiner SaaS (z. B. "ein Newsletter-Tool", "ein Projektmanagement-Tool für Teams"), die KI (Antigravity) erledigt den Rest — Backend, Frontend, Auth, Billing, Tests, Deployment.

---

## Kurzanleitung (Wie du die Vorlage nutzt)
1. Kopiere das komplette Markdown unten und sende es an die Antigravity-KI.
2. Ersetze den Abschnitt "SAAS_FUNKTIONALITÄT" (siehe Platzhalter) mit einer präzisen Beschreibung der einzigen Funktionalität, die dein SaaS haben soll.
3. Wähle in den Antworten jeweils "Code generieren" / "Implementieren" / "Run" etc., um konkrete Schritte ausführen zu lassen.

> Tipp: Je konkreter die `SAAS_FUNKTIONALITÄT` (Nutzerflüsse, Rollen, Berechtigungen, Datenschema), desto genauer und schneller resultiert der Implementierungscode.

---

## Master Prompt (Einfach kopieren und an Antigravity schicken)

Du bist eine Entwicklerinstanz mit TOOLS-Rechten für ein existing Next.js (app router) + Tailwind v4 + Prisma + Better-Auth + Stripe-Rechner (Projekt: `nexal`).

Deine Mission: Komplett, reproduzierbar und sofort einsetzbar ein multi-tenant-ready SaaS für folgende Funktionalität aufsetzen und implementieren.

WICHTIG (Vorbedingungen):
- Keep TypeScript and the current code style. The repo already has Tailwind v4, Next 16, `next-themes`, Prisma and `better-auth`.
- Reuse and extend existing components (`Navbar`, `ThemeProvider`, `src/lib/`, `src/app/*`) when possible — do not rewrite unrelated parts.
- Provide minimal friction for deployment to Vercel / Docker. Add README changes, migration steps and a Postgres-friendly schema.
- Security: Add safe defaults (sanitized inputs, CSRF mitigations, server-side validation on all inputs, guarded routes, RBAC where applicable).
- Billing: Use Stripe subscriptions (per-tenant). Implement checkout + webhooks to sync subscriptions with DB.
- Tests: Provide unit and integration tests for key flows (auth, billing, admin, tenant flows); add Playwright/E2E skeleton where feasible.

---

### SAAS_FUNKTIONALITÄT (ERSETZE DIESES KAPITEL)
Beschreibe hier präzise, welche Funktion dein SaaS bieten soll. Beispiel:

- "Ein fokussiertes Newsletter-SaaS: Nutzer können Newsletter-Kampagnen erstellen, Empfängerlisten importieren, automatische Versand-Workflows konfigurieren, und mit Stripe Abo-Modelle verwalten. Rollen: owner, admin, member."

ODER nur eine Zeile, z. B.: "Ein Projektmanagement-Board für kleine Teams mit Aufgaben, Kolonnen, Benutzerrollen, und Stripe-basierten Premium-Funktionen."

---

### Was du für die Auslieferung liefern musst (Back-to-back, komplett):
1. Projektplan in 6 Schritten (Design, DB Schema, Auth & RBAC, Billing, UI & UX, Tests & Deploy).
2. Alle neuen Dateien mit Pfaden + kurze Beschreibung (z. B. `src/app/saas/...`).
3. Prisma-Schema-Änderungen + eine benennbare Migration mit `prisma migrate` Schritten.
4. API-Routen (Route Handlers) für CRUD, Auth-geschützt; Admin-APIs für Billing / tenant-management.
5. Frontend: React + Tailwind components, reusing `ThemeToggle` & `Navbar`, responsive, accessible, TypeScript-ready.
6. Stripe-Integration: Checkout, Portal & webhook handler (verifiziere signatur), saubere user->subscription mapping in DB.
7. Multi-tenancy / per-tenant isolation (owner-per-tenant, scoped API queries, row-level restrictions by tenantId).
8. CI/CD: GitHub Actions (or Vercel) workflow to run tests & migrations and deploy on push to main.
9. Tests: Unit tests for critical logic and at least one E2E test for the signup + billing + first-tenant-usage flow.
10. README updates with environment variable list (.env.example), setup & deploy steps.
11. Security checks and recommended environment settings (CSP, other headers, rate limiting suggestions).

---

### Constraints / Stylistic Rules:
- Use consistent naming and folder structure that matches this repo.
- Keep UI minimal and focused — use existing design language (rounded cards, glassy navbar, dark theme support).
- Ensure all network calls are server-side where required (no secret keys exposed in client). Use server actions / route handlers for secure operations.
- Keep the final app accessible (a11y), using semantic HTML and aria attributes.
- For DB and queries use Prisma with prepared statements and guard against SQL injection.

---

## Plug-and-play — Direkt einsetzbar (WICHTIG)
Wenn du diese Prompt an die Antigravity-KI sendest, verlange genau dieses Verhalten. Alles muss 1:1 anwendbar sein — du darfst nach dem Patch / Commit nichts manuell löschen oder umbauen.

WICHTIGE REGELN (die KI muss diese strikt befolgen):
- Verwende und erweitere ausschließlich vorhandene Komponenten/Utilities, wenn möglich: `src/components/ThemeToggle.tsx`, `src/components/Navbar.tsx`, `src/components/stripe/*` (z. B. `ProductCheckout.tsx`, `SubscriptionPlans.tsx`, `SubscriptionsList.tsx`, `SubscriptionResult.tsx`, `CheckoutResult.tsx`, `PremiumContent.tsx`) und `src/app/globals.css` Theme-Variablen.
- Nutze die globalen CSS-Utilities (falls vorhanden): `bg-background`, `bg-card`, `border-card`, `text-foreground`, `text-muted`, `bg-glass`, `glass` — und keine harten, widersprüchlichen color overrides (z. B. keine unnötigen `bg-white`/`text-gray-900` ohne dark: Varianten).
- Alle Änderungen müssen als atomare Commits geliefert werden; die Antwort MUSS die exakte Dateiliste enthalten und die diff/patchs im Format: Pfad + vollständiger Dateinhalt (oder ein Git-style patch). Keine vagen Beschreibungen.
- Keine Datei löschen, außer es ist nötig — wenn gelöschte Dateien vorgeschlagen werden, erkläre warum. Priorität hat wiederverwendbarkeit & rückwärtskompatibilität.
- Der Code soll buildbar sein: für jeden Commit liefere Anweisungen zum Bauen und teste lokal mit `npm run build` und `npm run lint` (oder `npm test`). Die KI muss angeben, welche Kommandos sie lokal ausgeführt hat und das Ergebnis (Erfolgreich / Fehler + Fixes).

Dark/Light consistency check (mandatory):
- Alle neuen / geänderten Komponenten müssen Theme-Toggle aware sein (verwende `useTheme`/`ThemeProvider` wo nötig) und die oben genannten CSS-Utilities.
- UI-Elemente für Stripe müssen die bestehenden stripe components wiederverwenden oder sauber erweitern — KEINE neuen, redundanten Stripe UIs erstellen, wenn bereits komponenten vorhanden sind.

Test/CI requirements:
- Jede Implementierung muss mindestens eine Unit-Testdatei und eine einfache Integration/E2E-Szenario (Playwright/Testing-Library) mitliefern, die die Kern-Flows prüft (Signup -> Subscribe -> Webhook handling).

Fehlerbehandlung / diagnostics:
- Wenn ein vorgeschlagener Commit nicht sofort buildet, gib klare Anweisungen und kleine fixes (ein Commit pro fix). Ziel: spätestens nach 3 iterativen commits muss `npm run build` clean sein.


---

### Deliverable Response Format (detailliert, strukturierter output erwartet)
When you reply to this prompt, do not produce a short summary only. Provide this exact structure in the response:

1) High-level plan (6 steps) with brief reason + estimated work for each.
2) Files to add/change: list path + one-line description.
3) First code chunk (one complete, runnable component or route) and tests for that chunk.
4) Migration steps and example prisma schema changes.
5) Commands for local dev & run (what to run after you made the changes).
6) Next actions short checklist (what to run next to finish the next step).

---

### Follow-up prompts you (developer) will use after scoping:
- "Schritt 1: Generiere ERSTEN COMMIT — only files for database schema + migration + backend skeleton for SAAS_FUNKTIONALITÄT. Include prisma.schema, API route templates and tests."
- "Schritt 2: Implementiere das Frontend: Auth guarded pages, signup flow, settings, member management — build UI components and match design tokens."
- "Schritt 3: Stripe Integration: generate entire billing flow (checkout + webhooks) and tests; add dashboard for invoices."
- "Schritt 4: Multi-tenant & RBAC: implement tenant isolation, owner transfer, invite flow."
- "Schritt 5: Add CI/CD and e2e tests (Playwright) and finalize README + .env.example."

---

### Prompting tips for Antigravity (KI-Guide):
- Give complete context — include the repository name and current tech versions.
- Ask for 1 commit at a time in a reproducible order. Always ask the AI for the exact files & diffs for each commit.
- Don’t ask the AI to "do everything" all at once — instead, iterate: DB -> API -> Frontend -> Billing -> Tests -> Deploy.
- Always ask for tests and a final checklist to validate.

---

### Example 