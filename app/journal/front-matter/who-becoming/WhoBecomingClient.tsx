"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pen, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  WHO_IM_BECOMING,
  PAGE_KEYS,
  type WhoBecomingContent,
} from "@/lib/content/front-matter";

type Props = {
  initialContent: WhoBecomingContent;
  initialSignedAt: string | null;
};

export function WhoBecomingClient({
  initialContent,
  initialSignedAt,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [signedAt, setSignedAt] = useState<string | null>(initialSignedAt);
  const [editing, setEditing] = useState(!initialSignedAt);

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<WhoBecomingContent>(
      {
        i_am_a_man_who: initialContent.i_am_a_man_who ?? "",
        word_means: initialContent.word_means ?? "",
        presence_feels_like: initialContent.presence_feels_like ?? "",
        family_knows_me_as: initialContent.family_knows_me_as ?? "",
      },
      async (next) => {
        const { error } = await supabase.from("front_matter_entries").upsert(
          {
            user_id: (await supabase.auth.getUser()).data.user!.id,
            page_key: PAGE_KEYS.WHO_BECOMING,
            content: next,
          },
          { onConflict: "user_id,page_key" },
        );
        if (error) throw error;
      },
    );

  const allFilled = Boolean(
    data.i_am_a_man_who?.trim() &&
      data.word_means?.trim() &&
      data.presence_feels_like?.trim() &&
      data.family_knows_me_as?.trim(),
  );

  if (!editing && signedAt) {
    return <PrintedView content={data} onEdit={() => setEditing(true)} />;
  }

  async function commitAndLock() {
    if (!allFilled) return;
    await flush();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const now = new Date().toISOString();
    const { error } = await supabase.from("front_matter_entries").upsert(
      {
        user_id: user.id,
        page_key: PAGE_KEYS.WHO_BECOMING,
        content: data,
        signed_at: now,
      },
      { onConflict: "user_id,page_key" },
    );
    if (!error) {
      setSignedAt(now);
      setEditing(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {WHO_IM_BECOMING.intro.map((p, i) => (
          <p
            key={i}
            className={
              i === WHO_IM_BECOMING.intro.length - 1
                ? "text-ink text-lg font-medium"
                : "text-ink"
            }
          >
            {p}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {WHO_IM_BECOMING.prompts.map((prompt) => (
          <div key={prompt.key} className="flex flex-col gap-2">
            <MicroLabel>{prompt.label}</MicroLabel>
            <Textarea
              value={data[prompt.key] ?? ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, [prompt.key]: e.target.value }))
              }
              onBlur={() => void flush()}
              placeholder={prompt.placeholder}
              bloodAccent
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <Button onClick={commitAndLock} disabled={!allFilled}>
          <Lock className="w-4 h-4 mr-2 inline-block" />
          Commit and lock
        </Button>
      </div>
    </div>
  );
}

function PrintedView({
  content,
  onEdit,
}: {
  content: WhoBecomingContent;
  onEdit: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 relative">
      <button
        type="button"
        onClick={onEdit}
        className="absolute right-0 top-0 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-ash hover:text-ink"
      >
        <Pen className="w-3.5 h-3.5" />
        Edit
      </button>

      {WHO_IM_BECOMING.prompts.map((prompt) => (
        <div key={prompt.key} className="flex flex-col gap-2">
          <p className="text-xs text-ash uppercase tracking-[0.12em]">
            {prompt.label}
          </p>
          <p className="text-ink whitespace-pre-line">
            {content[prompt.key] || "—"}
          </p>
        </div>
      ))}

      <div className="flex justify-end pt-6 border-t border-line">
        <Button onClick={() => router.push("/journal")}>
          Continue to journal
        </Button>
      </div>
    </div>
  );
}
