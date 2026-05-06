"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";

const REFERRAL_INBOX = "intofitpt@gmail.com";

export type SubmitResult =
  | { ok: true; emailSent: boolean }
  | { ok: false; reason: string };

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function submitReferral(input: {
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  why: string;
  context: string;
}): Promise<SubmitResult> {
  const recipient_name = input.recipient_name.trim();
  const recipient_email = input.recipient_email.trim();
  const recipient_phone = input.recipient_phone.trim();
  const why = input.why.trim();
  const context = input.context.trim();

  if (!recipient_name) {
    return { ok: false, reason: "Add their name." };
  }
  if (!recipient_email && !recipient_phone) {
    return { ok: false, reason: "Add an email or phone so we can reach them." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", user.id)
    .single();

  // Persist the referral first so we never lose it, even if email fails.
  const { data: row, error: insertError } = await supabase
    .from("referrals")
    .insert({
      referrer_id: user.id,
      referrer_name: profile?.display_name ?? null,
      recipient_name,
      recipient_email: recipient_email || null,
      recipient_phone: recipient_phone || null,
      why: why || null,
      context: context || null,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    return {
      ok: false,
      reason: insertError?.message ?? "Couldn't save the referral.",
    };
  }

  // Try to send. Failures are non-blocking — the row already exists in DB.
  const subject = `New referral: ${recipient_name}`;
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#0E0E0E;max-width:560px">
      <h2 style="font-weight:500;margin:0 0 16px">New referral from THE FIRST 90</h2>
      <p style="margin:0 0 8px"><strong>From:</strong> ${escape(profile?.display_name ?? "(name not set)")}${profile?.email ? ` &lt;${escape(profile.email)}&gt;` : ""}</p>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
      <p style="margin:0 0 8px"><strong>Recipient:</strong> ${escape(recipient_name)}</p>
      ${recipient_email ? `<p style="margin:0 0 8px"><strong>Email:</strong> ${escape(recipient_email)}</p>` : ""}
      ${recipient_phone ? `<p style="margin:0 0 8px"><strong>Phone:</strong> ${escape(recipient_phone)}</p>` : ""}
      ${why ? `<p style="margin:16px 0 4px"><strong>Why they'd benefit:</strong></p><p style="margin:0 0 8px;white-space:pre-wrap">${escape(why)}</p>` : ""}
      ${context ? `<p style="margin:16px 0 4px"><strong>Context:</strong></p><p style="margin:0 0 8px;white-space:pre-wrap">${escape(context)}</p>` : ""}
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
      <p style="font-size:12px;color:#8B8680;margin:0">
        Submitted via The First 90 referral form. The referrer's account: ${escape(profile?.email ?? user.email ?? user.id)}.
      </p>
    </div>
  `;
  const text = [
    `New referral from THE FIRST 90`,
    ``,
    `From: ${profile?.display_name ?? "(name not set)"}${profile?.email ? ` <${profile.email}>` : ""}`,
    ``,
    `Recipient: ${recipient_name}`,
    recipient_email ? `Email: ${recipient_email}` : "",
    recipient_phone ? `Phone: ${recipient_phone}` : "",
    why ? `\nWhy they'd benefit:\n${why}` : "",
    context ? `\nContext:\n${context}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await sendEmail({
    to: REFERRAL_INBOX,
    subject,
    html,
    text,
    replyTo: profile?.email ?? user.email ?? undefined,
  });

  // Update the row with email status (fire-and-forget; ignore errors).
  if (result.ok) {
    await supabase
      .from("referrals")
      .update({ email_sent_at: new Date().toISOString() })
      .eq("id", row.id);
    return { ok: true, emailSent: true };
  }

  await supabase
    .from("referrals")
    .update({
      email_error: result.skipped
        ? `skipped: ${result.reason}`
        : `failed (${result.status}): ${result.reason}`,
    })
    .eq("id", row.id);

  // Still ok from the user's perspective — the referral is saved.
  return { ok: true, emailSent: false };
}
