import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const betterAuthUrl = process.env.BETTER_AUTH_URL || 'not set';
  
  return Response.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    appUrl,
    betterAuthUrl,
    apiAvailable: true,
    timestamp: new Date().toISOString(),
    endpoints: {
      signin: `${appUrl}/api/auth/sign-in/email`,
      signup: `${appUrl}/api/auth/sign-up`,
      checkEmail: `${appUrl}/api/auth/check-email`,
    },
  });
}
