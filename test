<div align="center">

# 🚀 Nexal

### Production-Ready Next.js Starter Template

*Von der Idee zum Live-Projekt in Minuten*

[![npm version](https://img.shields.io/npm/v/nexal.svg)](https://www.npmjs.com/package/nexal)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Schnellstart](#-schnellstart) • [Dokumentation](#-setup) • [Demo](#-login)

</div>

---

## ⚡ Schnellstart

```bash
npx nexal
```

**Das war's!** Ein vollständiges, produktionsreifes Next.js Projekt mit Auth, DB, Payments & Admin.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🏗️ **Foundation**
- ⚡ **Next.js 15** - App Router & Server Components
- 📘 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS** - Modern styling
- 🐳 **Docker** - Containerized database

</td>
<td width="50%">

### 🔐 **Backend**
- 🔒 **Better-Auth** - Secure authentication
- 🗄️ **Prisma ORM** - Type-safe database
- 💾 **MongoDB** - NoSQL with replica sets
- 💳 **Stripe** - Payments & subscriptions

</td>
</tr>
<tr>
<td width="50%">

### 👨‍💼 **Admin Dashboard**
- 👥 User management
- 📦 Product & subscription management
- 🎫 Coupon system
- 📊 Overview & analytics

</td>
<td width="50%">

### 🚀 **Ready to Deploy**
- ✅ Production optimized
- ✅ Security best practices
- ✅ SEO configured
- ✅ Performance optimized

</td>
</tr>
</table>

---

## 📦 Setup

### **Installation in 4 Schritten**

<table>
<tr>
<td>

**1️⃣ Initialisieren**
```bash
npx nexal
cd dein-projekt
```

</td>
<td>

**2️⃣ Environment**
```bash
# .env Datei bearbeiten
# Siehe unten für Details
```

</td>
</tr>
<tr>
<td>

**3️⃣ Datenbank**
```bash
docker-compose up -d
npm run prisma:prepare
```

</td>
<td>

**4️⃣ Starten**
```bash
npm run init:admin
npm run dev
```

</td>
</tr>
</table>

### **Environment Variables**

Erstelle eine `.env` Datei:

```env
# Database
DATABASE_URL="mongodb://admin:password@localhost:27017/nexal?authSource=admin&replicaSet=rs0"

# Auth
BETTER_AUTH_SECRET="your-super-secret-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

<details>
<summary><b>🌐 MongoDB Atlas statt Docker verwenden</b></summary>

```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority"
```
Dann kannst du `docker-compose up -d` überspringen.

</details>

<details>
<summary><b>🔑 Default Admin Credentials</b></summary>

Nach `npm run init:admin`:
- **Email:** `admin@example.com`
- **Password:** `admin123`

⚠️ **Bitte ändern nach dem ersten Login!**

</details>

---

## 🎯 Was bekommst du?

```
📦 Nexal Project
│
├── 🔐 Authentication
│   ├── Email/Password login
│   ├── Secure sessions
│   └── Protected routes
│
├── 👨‍💼 Admin Dashboard
│   ├── User management
│   ├── Products & subscriptions
│   └── Coupon system
│
├── 💳 Stripe Payments
│   ├── One-time payments
│   ├── Subscriptions
│   ├── Coupons
│   └── Webhooks
│
└── 🗄️ Database
    ├── Prisma ORM
    ├── MongoDB
    └── Migrations
```

**Perfekt für:**
- 🚀 Schnelle Prototypen
- 💼 SaaS-Anwendungen  
- 🛒 E-Commerce
- 📱 Full-Stack Apps

---

## 📂 Struktur

```
src/
├── app/
│   ├── api/          # API Routes
│   ├── admin/        # Admin Dashboard
│   └── login/        # Auth Pages
│
├── components/       # React Components
├── lib/             # Utils & Config
└── prisma/          # Database Schema
```

---

## 🔑 Login

**URL:** [localhost:3000/login](http://localhost:3000/login)

Default Admin:
- Email: `admin@example.com`  
- Password: `admin123`

---

## 👨‍💼 Admin Features

Nach dem Login unter `/admin`:

| Feature | Beschreibung |
|---------|--------------|
| **👥 Users** | Benutzerverwaltung & Rollen |
| **📦 Products** | Produkte & Abo-Pläne erstellen |
| **🎫 Coupons** | Rabattcodes verwalten |
| **📊 Overview** | Dashboard & Statistiken |

---

## 💳 Stripe Setup

<details>
<summary><b>Schritt-für-Schritt Anleitung</b></summary>

### 1. API Keys holen

- Gehe zu [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Kopiere **Publishable Key** (`pk_test_...`)
- Kopiere **Secret Key** (`sk_test_...`)
- Füge beide in `.env` ein

### 2. Webhooks einrichten

- Gehe zu [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- Füge Endpoint hinzu: `https://deine-domain.com/api/stripe/webhook`
- Events auswählen: `checkout.session.completed`, `customer.subscription.*`
- Webhook Secret kopieren → `.env`

Mehr Details: [STRIPE_SETUP.md](./STRIPE_SETUP.md)

</details>

---

## 📜 Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build für production
npm run start            # Start production server

# Database  
npm run prisma:prepare   # Generate client & push schema

# Admin
npm run init:admin       # Create admin user
npm run init:admin-api   # Create via API

# Utils
npm run lint             # Lint code
```

---

## 🐳 Docker

```bash
# Start MongoDB
docker-compose up -d

# Stop MongoDB  
docker-compose down

# View logs
docker-compose logs -f mongodb
```

---

## 🌐 Deployment

### Vorbereitung

- [ ] `BETTER_AUTH_URL` auf Production URL setzen
- [ ] Production Stripe Keys verwenden
- [ ] Stripe Webhooks für Domain konfigurieren
- [ ] MongoDB absichern (Atlas empfohlen)
- [ ] Starke Secrets generieren
- [ ] HTTPS aktivieren

### Deploy

```bash
npm run build
npm start
```

---

## 💡 Tipps & Tricks

<details>
<summary><b>Projekt ohne Stripe nutzen</b></summary>

Stripe ist optional! Lass die Keys einfach leer und entferne Stripe-Komponenten bei Bedarf.

</details>

<details>
<summary><b>Schema erweitern</b></summary>

1. Bearbeite `src/prisma/schema.prisma`
2. Run `npm run prisma:prepare`
3. Nutze neue Models in deinem Code

</details>

<details>
<summary><b>Neue API Route hinzufügen</b></summary>

Erstelle Datei in `src/app/api/dein-endpoint/route.ts`:

```ts
export async function GET() {
  return Response.json({ message: "Hello!" })
}
```

</details>

---

## 🔒 Sicherheit

| Feature | Status |
|---------|--------|
| Bcrypt Password Hashing | ✅ |
| Session Management | ✅ |
| CSRF Protection | ✅ |
| Role-Based Access | ✅ |

**Production Checklist:**
- ⚠️ Alle Secrets ändern
- ⚠️ HTTPS aktivieren
- ⚠️ Admin Passwort ändern
- ⚠️ Environment Variables sichern

---

<div align="center">

## 🤝 Contributing

Contributions welcome! Feel free to open issues or PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 👤 Author

**jonasboos**

[![GitHub](https://img.shields.io/badge/GitHub-jonasboos-black?logo=github)](https://github.com/jonasboos)

## 🙏 Built With

[Next.js](https://nextjs.org/) • [Better-Auth](https://better-auth.com/) • [Prisma](https://prisma.io/) • [Stripe](https://stripe.com/) • [Tailwind](https://tailwindcss.com/)

---

⭐ **Star this repo if you find it helpful!**

</div>
````
