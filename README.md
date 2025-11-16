# Nexal - Next.js Starter Template

Ein vollständiges Next.js Starter-Template mit Authentifizierung, Datenbank, Stripe-Integration und Admin-Dashboard.

## 🚀 Features

- ✅ **Next.js 15** mit App Router und TypeScript
- 🔐 **Better-Auth** - Moderne Authentifizierung mit E-Mail/Passwort
- 🗄️ **Prisma ORM** - Type-safe Datenbankzugriff
- 💾 **MongoDB** - NoSQL Datenbank mit Docker-Setup
- 💳 **Stripe Integration** - Zahlungen und Abonnements
- 🎨 **Tailwind CSS** - Utility-First CSS Framework
- 👨‍💼 **Admin Dashboard** - User-, Produkt- und Coupon-Verwaltung
- 🐳 **Docker Support** - Einfaches Setup mit Docker Compose

## 📋 Voraussetzungen

- Node.js 18+ 
- Docker und Docker Compose
- Stripe Account (für Zahlungen)

## 🛠️ Installation

### 1. Repository klonen

```bash
git clone https://github.com/Jonasppxx/nexal.git
cd nexal
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Umgebungsvariablen einrichten

Erstelle eine `.env` Datei im Root-Verzeichnis:

```bash
# Database
DATABASE_URL="mongodb://admin:password@localhost:27017/nexal?authSource=admin&replicaSet=rs0"

# Better-Auth
BETTER_AUTH_SECRET="dein-super-geheimer-schlüssel-mindestens-32-zeichen"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe (optional, für Zahlungen)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Datenbank starten

```bash
docker-compose up -d
```

Dies startet MongoDB mit Replica Set Unterstützung.

### 5. Datenbank vorbereiten

```bash
npm run prisma:prepare
```

Dieser Befehl führt aus:
- `prisma generate` - Generiert den Prisma Client
- `prisma db push` - Erstellt die Datenbankstruktur

### 6. Admin-User erstellen

```bash
npm run init:admin
```

Erstellt einen Admin-User mit:
- Email: `admin@example.com`
- Passwort: `admin123`
- Role: `admin`

### 7. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung läuft nun auf [http://localhost:3000](http://localhost:3000)

## 📁 Projektstruktur

```
nexal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/         # Authentifizierung
│   │   │   ├── admin/        # Admin API Endpoints
│   │   │   ├── stripe/       # Stripe Integration
│   │   │   └── ...
│   │   ├── admin/            # Admin Dashboard
│   │   ├── login/            # Login Seite
│   │   └── ...
│   ├── components/            # React Komponenten
│   │   ├── auth/             # Auth Komponenten
│   │   ├── stripe/           # Stripe Komponenten
│   │   └── ...
│   ├── lib/                   # Utility Bibliotheken
│   │   ├── auth.ts           # Better-Auth Konfiguration
│   │   ├── stripe.ts         # Stripe Konfiguration
│   │   └── prisma/
│   └── prisma/
│       └── schema.prisma      # Datenbankschema
├── scripts/                   # Hilfs-Scripts
├── docker-compose.yml         # Docker Konfiguration
└── package.json
```

## 🔑 Authentifizierung

Das Template nutzt [Better-Auth](https://better-auth.com) für die Authentifizierung:

- E-Mail/Passwort Login
- Session Management
- Passwort-Hashing mit bcrypt
- Type-safe Auth Client

### Login

Besuche [http://localhost:3000/login](http://localhost:3000/login) und melde dich mit dem Admin-Account an.

## 👨‍💼 Admin Dashboard

Nach dem Login als Admin erreichst du das Dashboard unter `/admin`:

- **Users** - Benutzerverwaltung
- **Products** - Produkte und Abonnements verwalten
- **Coupons** - Rabattcodes erstellen und verwalten

## 💳 Stripe Integration

Das Template unterstützt:

- **Einmalige Zahlungen** - Produkte kaufen
- **Abonnements** - Monatliche/Jährliche Abos
- **Coupons** - Rabattcodes
- **Webhook Handling** - Automatische Zahlungsbestätigungen

Detaillierte Anleitung: siehe [STRIPE_SETUP.md](./STRIPE_SETUP.md)

## 🗄️ Datenbank Schema

### Hauptmodelle

- **User** - Benutzerkonten mit Rolle (user/admin)
- **Session** - Aktive Sessions
- **Account** - Auth Provider Accounts
- **Product** - Produkte und Abonnements
- **Purchase** - Einmalige Käufe
- **Subscription** - Aktive Abonnements
- **Coupon** - Rabattcodes
- **Post** - Beispiel Content Model

## 📜 Verfügbare Scripts

```bash
# Entwicklung
npm run dev              # Entwicklungsserver starten

# Datenbank
npm run prisma:prepare   # Prisma generieren & DB pushen

# Build
npm run build            # Production Build erstellen
npm run start            # Production Server starten

# Admin
npm run init:admin       # Admin User erstellen
npm run init:admin-api   # Admin via API erstellen

# Code Quality
npm run lint             # Code Linting
```

## 🐳 Docker

### MongoDB starten

```bash
docker-compose up -d
```

### MongoDB stoppen

```bash
docker-compose down
```

### Logs anzeigen

```bash
docker-compose logs -f mongodb
```

## 🌐 Deployment

### Vorbereitung

1. Setze `BETTER_AUTH_URL` auf deine Production URL
2. Nutze Production Stripe Keys (statt Test Keys)
3. Konfiguriere Stripe Webhooks für deine Domain
4. Sichere deine MongoDB Instanz
5. Nutze starke Secrets für `BETTER_AUTH_SECRET`

### Build erstellen

```bash
npm run build
```

### Production starten

```bash
npm start
```

## 🔒 Sicherheit

- ✅ Passwörter werden mit bcrypt gehasht
- ✅ Session-basierte Authentifizierung
- ✅ CSRF-Schutz durch Better-Auth
- ✅ Role-based Access Control (RBAC)
- ⚠️ Ändere alle Secrets für Production!
- ⚠️ Aktiviere HTTPS für Production

## 🤝 Beitragen

Contributions sind willkommen! Bitte erstelle ein Issue oder Pull Request.

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details.

## 👤 Autor

**jonasboos**

- GitHub: [@jonasboos](https://github.com/jonasboos)

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [Better-Auth](https://better-auth.com/)
- [Prisma](https://www.prisma.io/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

⭐ Wenn dir dieses Template gefällt, gib ihm einen Stern auf GitHub!
