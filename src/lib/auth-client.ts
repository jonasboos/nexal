"use client";

import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: baseURL,
  credentials: 'include', // Important for cookies to work
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
