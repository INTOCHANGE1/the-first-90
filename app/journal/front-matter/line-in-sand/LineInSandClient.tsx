"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pen, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  LINE_IN_THE_SAND,
  PAGE_KEYS,
  type LineInSandContent,
} from "@/lib/content/front-matter";

type Props = {
  initialContent: LineInSandContent;
  initialSignedAt: string | null;
  defaultName: string;
};

const NEXT_PAGE = "/journal/front-matter/who-becoming";

export function LineInSandClient({
  initialContent,
  initialSignedAt,
  defaultName,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [signedAt, setSignedAt] = useState<string | null>(initialSignedAt);
  const [editing, setEditing] = useState(!initialSignedAt);

  const today = new Date().toISOString().slice(0, 10);

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<LineInSandContent>(
      {
        no_longer: initialContent.no_longer ?? "",
        i_will: initialContent.i_will ?? "",
        leaving_behind: initialContent.leaving_behind ?? "",
        becoming: initialContent.becoming ?? "",
        signed_name:
          initialContent.signed_name ?? defaultName.split(" ")[0] ?? "",
        signed_date: initialContent.signed_date ?? today,
      },
      async (next) => {
        const { error } = await supabase.from("front_matter_entries").upsert(
          {
            user_id: (await supabase.auth.getUser()).data.user!.id,
            page_key: PAGE_KEYS.LINE_IN_SAND,
            content: next,
          },
          { onConflict: "user_id,page_key" },
        );
        if (error) throw error;
      },
    );

  // Re-bind autosave initial content when the user toggles back to edit mode
  // after a sign — the parent already has fresh server data.
  useEffect(() => {
    // No-op; autosave hook holds local state. This effect placeholder reminds
    // future maintainers that initialContent updates require a remount.
  }, [initialContent]);

  const allFilled = Boolean(
    data.no_longer?.trim() &&
      data.i_will?.trim() &&
      data.leaving_behind?.trim() &&
      data.becoming?.trim() &&
      data.signed_name?.trim() &&
      data.signed_date?.trim(),
  );

  if (!editing && signedAt) {
    return (
      <PrintedView
        content={data}
        onEdit={() => setEditing(true)}
      />
    );
  }

  async function signAndLock() {
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
        page_key: PAGE_KEYS.LINE_IN_SAND,
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
        {LINE_IN_THE_SAND.intro.map((p, i) => (
          <p
            key={i}
            className={
              i === LINE_IN_THE_SAND.intro.length - 1
                ? "text-ink text-lg font-medium"
                : "text-ink"
            }
          >
            {p}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {LINE_IN_THE_SAND.prompts.map((prompt) => (
          <div key={prompt.key} className="flex flex-col gap-2">
            <MicroLabel>{prompt.label}</MicroLabel>
            <Textarea
              value={data[prompt.key] ?? ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, [prompt.key]: e.target.value }))
              }
              onBlur={() => void flush()}
              bloodAccent
            />
          </div>
        ))}
      </div>

      <div className="border-t border-line pt-6 flex flex-col gap-4">
        <MicroLabel>SIGNATURE</MicroLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-ash">Signed (your name)</span>
            <Input
              value={data.signed_name ?? ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, signed_name: e.target.value }))
              }
              onBlur={() => void flush()}
              placeholder="Ben"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-ash">Date</span>
            <Input
              type="date"
              value={data.signed_date ?? ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, signed_date: e.target.value }))
              }
              onBlur={() => void flush()}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <Button onClick={signAndLock} disabled={!allFilled}>
          <Lock className="w-4 h-4 mr-2 inline-block" />
          Sign and lock
        </Button>
      </div>
    </div>
  );
}

function PrintedView({
  content,
  onEdit,
}: {
  content: LineInSandContent;
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

      <Printed label={LINE_IN_THE_SAND.prompts[0].label} body={content.no_longer} />
      <Printed label={LINE_IN_THE_SAND.prompts[1].label} body={content.i_will} />
      <Printed
        label={LINE_IN_THE_SAND.prompts[2].label}
        body={content.leaving_behind}
      />
      <Printed
        label={LINE_IN_THE_SAND.prompts[3].label}
        body={content.becoming}
      />

      <div className="border-t border-line pt-6 flex justify-between items-baseline">
        <div>
          <p className="text-xs text-ash uppercase tracking-[0.12em]">SIGNED</p>
          <p className="font-serif italic text-2xl text-ink mt-1">
            {content.signed_name}
          </p>
        </div>
        <div>
          <p className="text-xs text-ash uppercase tracking-[0.12em] text-right">
            DATE
          </p>
          <p className="font-serif italic text-2xl text-ink mt-1">
            {content.signed_date}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={() => router.push("/journal/front-matter/who-becoming")}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function Printed({
  label,
  body,
}: {
  label: string;
  body: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-ash uppercase tracking-[0.12em]">{label}</p>
      <p className="text-ink whitespace-pre-line">{body || "—"}</p>
    </div>
  );
}
