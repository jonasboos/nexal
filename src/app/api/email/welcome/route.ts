import { NextResponse } from 'next/server';
import { sendEmail } from '@/src/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email;
    const name = body?.name || '';

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const subject = 'Welcome to our app';
    const text = `Hi ${name || ''},\n\nWelcome! Thanks for signing up.\n\nBest regards,\nThe Team`;
    const html = `<p>Hi ${name || ''},</p><p>Welcome! Thanks for signing up.</p><p>Best regards,<br/>The Team</p>`;

    await sendEmail({ to: email, subject, text, html });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[api/email/welcome] error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
