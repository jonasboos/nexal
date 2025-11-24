SAAS_FUNCTIONALITY (EXAMPLE INCLUDED)

A lightweight project management SaaS for small teams:
Users can create boards, lists, and tasks; assign members; track progress; manage roles (owner, admin, member); and access premium features (e.g., unlimited boards) via Stripe subscriptions.

Requirements (Strict)

Use existing components and structure whenever possible (Navbar, ThemeToggle, stripe/*, src/lib/*, src/app/*).

Keep TypeScript and existing style conventions.

Must support multi-tenancy (tenantId scoping, owner role, permissions).

Stripe subscription billing per tenant: checkout, customer portal, webhooks with signature verification.

Secure by default: server-side validation, sanitized inputs, guarded routes, RBAC.

Add tests: unit + integration + minimal Playwright E2E (signup → subscribe → create first board).

Provide updates for README, .env.example, deployment steps.

Design consistent with existing Tailwind tokens (bg-background, bg-card, bg-glass, text-foreground, etc.) and dark mode support.

All code delivered as atomic commits with exact file contents or Git patches.

The project must build after every commit (npm run build); include output and fixes if needed.

What you must deliver

6-step high-level plan (Design → DB → Auth/RBAC → Billing → UI → Tests/Deploy).

List of new/changed files with short descriptions.

First code block: one complete runnable backend or UI component + tests.

Prisma schema changes + named migration steps.

Local development commands (migrate, build, test).

Next-action checklist for the following steps.