/**
 * Lightweight Resend client.
 *
 * Sends one email via the Resend HTTP API. No SDK dependency; just fetch.
 * If RESEND_API_KEY is not set, returns { skipped: true } so callers can
 * choose to swallow the absence (form submissions still write to DB).
 *
 * Set up:
 *   1. Sign up at https://resend.com (free tier, 3000 emails/month)
 *   2. Create an API key
 *   3. Add to .env.local:
 *        RESEND_API_KEY=re_xxxxxxxxxxxx
 *        RESEND_FROM=onboarding@resend.dev   # default; replace once a domain is verified
 *
 * Without a verified domain, Resend only allows sending from the default
 * `onboarding@resend.dev` address. To use a custom from-address (e.g.
 * journal@newageman.com), verify the domain in the Resend dashboard.
 */

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  /** Plain-text fallback for clients that don't render HTML. */
  text?: string;
  /** Defaults to "no-reply@thefirst90 <RESEND_FROM>". */
  from?: string;
  replyTo?: string;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; status: number; reason: string };

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      skipped: true,
      reason: "RESEND_API_KEY not set",
    };
  }

  const from =
    input.from ||
    process.env.RESEND_FROM ||
    "The First 90 <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.text ? { text: input.text } : {}),
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      ok: false,
      skipped: false,
      status: res.status,
      reason: body || res.statusText,
    };
  }

  const json = (await res.json()) as { id: string };
  return { ok: true, id: json.id };
}
