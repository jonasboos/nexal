import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma/prisma";
import { sendEmail } from "./email";
import { buildResetPasswordEmail } from "./email-templates/reset-password";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true if you want to require email verification
    async sendResetPassword(arg1, arg2) {
      // better-auth may call this with either (url, user) or a single payload object
      // containing { user, url, token } depending on version/context. Handle both.
      let url: string | undefined;
      let userAny: any = null;
      let token: string | undefined;

      if (arg1 && typeof arg1 === 'object' && (arg1.user || arg1.url || arg1.token)) {
        // payload object case
        url = arg1.url;
        userAny = arg1.user || arg1;
        token = arg1.token;
      } else {
        // (url, user) case
        url = arg1 as string | undefined;
        userAny = arg2 as any;
      }

      // Try many possible shapes where email/user may be located.
      let email = null as string | null;
      let userId = null as string | null;

      // direct on userAny
      if (userAny) {
        email = userAny?.email ?? null;
        userId = userAny?.id ?? null;
      }

      // nested under user
      if (!email && userAny?.user) {
        email = userAny.user.email ?? null;
        userId = userAny.user.id ?? userId;
      }

      // sometimes payload is double-wrapped: url: { user: {...}, url, token }
      if (!email && typeof arg1 === 'object' && arg1?.url && typeof arg1.url === 'object') {
        const nested = arg1.url as any;
        email = nested?.user?.email ?? nested?.email ?? email;
        userId = nested?.user?.id ?? userId;
        // if url string is nested under nested.url
        if (!url && typeof nested?.url === 'string') url = nested.url;
      }

      // fallback: arg2 might contain user info
      if (!email && arg2 && typeof arg2 === 'object') {
        email = (arg2 as any)?.email ?? (arg2 as any)?.user?.email ?? null;
        userId = (arg2 as any)?.id ?? (arg2 as any)?.user?.id ?? userId;
      }
      console.debug('[auth] sendResetPassword called', { url: url ? 'present' : 'missing', token: token ? 'present' : 'missing', email: email ? 'present' : 'missing', userId });

      if (!email) {
        console.warn('[auth] sendResetPassword: no email found on user, skipping send', { userId });
        return;
      }

      try {
        // Build a nicer, localized reset-password email
        const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Nexal';
        const { subject, text, html } = buildResetPasswordEmail({
          name: userAny?.name ?? userAny?.user?.name ?? null,
          url: url ?? undefined,
          appName,
        });

        const res = await sendEmail({
          to: email,
          subject,
          text,
          html,
        });
        console.debug('[auth] sendResetPassword: sendEmail resolved', { userId, to: email, status: res?.$metadata?.httpStatusCode || 'unknown' });
      } catch (err) {
        console.error('[auth] sendResetPassword: sendEmail error', { userId, email, error: err });
        throw err;
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "default-secret-change-in-production",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
