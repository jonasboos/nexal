export function buildResetPasswordEmail({
  name,
  url,
  appName = 'Our App',
}: {
  name?: string | null;
  url?: string | null;
  appName?: string;
}) {
  const displayName = name || '';
  const subject = `${appName} — Passwort zurücksetzen`;

  const text = `Hallo ${displayName},\n\n` +
    `du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. Klicke auf den folgenden Link, um ein neues Passwort zu setzen:\n\n${url}\n\n` +
    `Wenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.\n\nBeste Grüße,\n${appName}`;

  const buttonStyle = `display:inline-block;padding:12px 20px;margin:10px 0;background:#2563eb;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;`;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111827;">
    <div style="max-width:580px;margin:0 auto;padding:24px;">
      <h2 style="color:#0f172a;margin:0 0 8px;">Passwort zurücksetzen</h2>
      <p style="margin:0 0 16px;color:#374151;">Hallo ${displayName || 'there'},</p>
      <p style="margin:0 0 16px;color:#374151;">Du hast kürzlich angefordert, dein Passwort zurückzusetzen. Klicke auf den Button unten, um ein neues Passwort zu setzen. Dieser Link ist nur für eine begrenzte Zeit gültig.</p>
      ${url ? `<p><a href="${url}" style="${buttonStyle}">Passwort zurücksetzen</a></p>` : ''}
      <p style="margin:16px 0;color:#374151;">Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:</p>
      <p style="word-break:break-all;color:#111827;font-size:13px;">${url || '—'}</p>
      <hr style="border:none;border-top:1px solid #e6e9ee;margin:20px 0;" />
      <p style="color:#9ca3af;font-size:13px;margin:0;">Wenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren. Diese E-Mail wurde von ${appName} gesendet.</p>
    </div>
  </body>
</html>`;

  return { subject, text, html };
}
