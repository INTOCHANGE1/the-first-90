"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { submitReferral, type SubmitResult } from "./actions";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; emailSent: boolean }
  | { kind: "error"; message: string };

export function ReferralForm() {
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [why, setWhy] = useState("");
  const [context, setContext] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  function reset() {
    setRecipientName("");
    setRecipientEmail("");
    setRecipientPhone("");
    setWhy("");
    setContext("");
    setStatus({ kind: "idle" });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    startTransition(async () => {
      const result: SubmitResult = await submitReferral({
        recipient_name: recipientName,
        recipient_email: recipientEmail,
        recipient_phone: recipientPhone,
        why,
        context,
      });
      if (result.ok) {
        setStatus({ kind: "sent", emailSent: result.emailSent });
      } else {
        setStatus({ kind: "error", message: result.reason });
      }
    });
  }

  if (status.kind === "sent") {
    return (
      <div className="flex flex-col gap-6 border-l-4 border-blood pl-6 py-4">
        <p className="font-serif italic text-2xl text-ink">Got it. Thank you.</p>
        <p className="text-base text-steel">
          {status.emailSent
            ? "We have his details. Someone from The New Age Man will reach out directly."
            : "His details are saved. We will reach out directly."}
        </p>
        <div>
          <Button variant="secondary" onClick={reset}>
            Refer another man
          </Button>
        </div>
      </div>
    );
  }

  const submitting = pending || status.kind === "submitting";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <MicroLabel>HIS NAME</MicroLabel>
        <Input
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="First and last"
          autoComplete="off"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <MicroLabel>EMAIL</MicroLabel>
          <Input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="him@example.com"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-2">
          <MicroLabel>PHONE</MicroLabel>
          <Input
            type="tel"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            placeholder="+61…"
            autoComplete="off"
          />
        </div>
      </div>
      <p className="text-xs text-ash -mt-3">
        At least one is required so we can reach him.
      </p>

      <div className="flex flex-col gap-2">
        <MicroLabel>WHY DO YOU THINK HE&rsquo;D BENEFIT?</MicroLabel>
        <Textarea
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="A line or two. The brief is enough."
          bloodAccent
        />
      </div>

      <div className="flex flex-col gap-2">
        <MicroLabel>ANYTHING WE SHOULD KNOW WHEN WE REACH OUT?</MicroLabel>
        <Textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Optional. The right approach for him."
        />
      </div>

      {status.kind === "error" && (
        <p className="text-sm text-blood">{status.message}</p>
      )}

      <div className="flex justify-end pt-4 border-t border-line">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send referral"}
        </Button>
      </div>
    </form>
  );
}
