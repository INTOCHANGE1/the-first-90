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
import { LEGACY } from "@/lib/content/phase-3";

type Shape = {
  children_remember: string;
  partner_say: string;
  brotherhood_say: string;
  bigger_work: string;
  ten_year_legacy: string;
};

type Props = {
  initial: Shape;
  initialSignedAt: string | null;
};

export function LegacyClient({ initial, initialSignedAt }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [signedAt, setSignedAt] = useState<string | null>(initialSignedAt);
  const [editing, setEditing] = useState(!initialSignedAt);

  const { data, setData, status, lastSavedAt, flush } = useAutosave<Shape>(
    initial,
    async (next) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase
        .from("legacy_entries")
        .upsert({ user_id: user.id, ...next }, { onConflict: "user_id" });
      if (error) throw error;
    },
  );

  const allFilled = LEGACY.prompts.every((p) => (data[p.key] ?? "").trim());

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
    // We use legacy_entries.updated_at as a "saved" record; the lock state
    // is tracked separately on the front_matter_entries table for legacy.
    const now = new Date().toISOString();
    const { error } = await supabase.from("front_matter_entries").upsert(
      {
        user_id: user.id,
        page_key: "legacy",
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
        {LEGACY.intro.map((p, i) => (
          <p
            key={i}
            className={
              i === LEGACY.intro.length - 1
                ? "text-ink text-lg font-medium"
                : "text-ink"
            }
          >
            {p}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {LEGACY.prompts.map((prompt) => (
          <div key={prompt.key} className="flex flex-col gap-2">
            <MicroLabel>{prompt.label}</MicroLabel>
            <Textarea
              value={data[prompt.key] ?? ""}
              onChange={(e) =>
                setData((p) => ({ ...p, [prompt.key]: e.target.value }))
              }
              onBlur={() => void flush()}
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
  content: Shape;
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
      {LEGACY.prompts.map((prompt) => (
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
        <Button onClick={() => router.push("/journal/phase/3/habit-grid")}>
          Continue
        </Button>
      </div>
    </div>
  );
}
