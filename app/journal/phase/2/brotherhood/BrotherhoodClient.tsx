"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pen, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PAGE_KEYS } from "@/lib/content/front-matter";
import {
  BROTHERHOOD,
  type BrotherhoodContent,
} from "@/lib/content/phase-2";

type Props = {
  initialContent: BrotherhoodContent;
  initialSignedAt: string | null;
};

const EMPTY_BROTHER = { name: "", contact: "", permission: "" };

export function BrotherhoodClient({
  initialContent,
  initialSignedAt,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [signedAt, setSignedAt] = useState<string | null>(initialSignedAt);
  const [editing, setEditing] = useState(!initialSignedAt);

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<BrotherhoodContent>(
      {
        brothers: padBrothers(initialContent.brothers),
      },
      async (next) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("not signed in");
        const { error } = await supabase.from("front_matter_entries").upsert(
          {
            user_id: user.id,
            page_key: PAGE_KEYS.BROTHERHOOD,
            content: next,
          },
          { onConflict: "user_id,page_key" },
        );
        if (error) throw error;
      },
    );

  function setBrother(i: number, key: keyof typeof EMPTY_BROTHER, value: string) {
    setData((prev) => {
      const arr = padBrothers(prev.brothers);
      arr[i] = { ...arr[i], [key]: value };
      return { ...prev, brothers: arr };
    });
  }

  const allFilled = (data.brothers ?? []).every(
    (b) => b.name?.trim() && b.permission?.trim(),
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
        page_key: PAGE_KEYS.BROTHERHOOD,
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
        {BROTHERHOOD.intro.map((p, i) => (
          <p key={i} className="text-ink">
            {p}
          </p>
        ))}
      </div>

      <p className="font-serif italic text-lg text-ink">
        {BROTHERHOOD.preList}
      </p>

      <div className="flex flex-col gap-8">
        {(data.brothers ?? []).map((b, i) => (
          <BrotherSection
            key={i}
            index={i}
            brother={b}
            onChange={(key, value) => setBrother(i, key, value)}
            onBlur={flush}
          />
        ))}
      </div>

      <p className="font-serif italic text-xl text-ink">
        {BROTHERHOOD.closer}
      </p>

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

function BrotherSection({
  index,
  brother,
  onChange,
  onBlur,
}: {
  index: number;
  brother: { name?: string; contact?: string; permission?: string };
  onChange: (key: "name" | "contact" | "permission", value: string) => void;
  onBlur: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <MicroLabel>BROTHER {index + 1}</MicroLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          value={brother.name ?? ""}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={() => void onBlur()}
          placeholder="Name"
        />
        <Input
          value={brother.contact ?? ""}
          onChange={(e) => onChange("contact", e.target.value)}
          onBlur={() => void onBlur()}
          placeholder="Phone or email"
        />
      </div>
      <span className="text-xs text-ash mt-2">
        What I am giving him permission to call me out on
      </span>
      <Textarea
        value={brother.permission ?? ""}
        onChange={(e) => onChange("permission", e.target.value)}
        onBlur={() => void onBlur()}
        bloodAccent
      />
    </div>
  );
}

function PrintedView({
  content,
  onEdit,
}: {
  content: BrotherhoodContent;
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
      {(content.brothers ?? []).map((b, i) => (
        <div key={i} className="flex flex-col gap-1">
          <p className="text-xs text-ash uppercase tracking-[0.12em]">
            BROTHER {i + 1}
          </p>
          <p className="font-serif italic text-2xl text-ink mt-1">
            {b.name || "—"}
          </p>
          {b.contact && <p className="text-sm text-steel">{b.contact}</p>}
          <p className="text-ink whitespace-pre-line mt-2">
            {b.permission || "—"}
          </p>
        </div>
      ))}
      <div className="flex justify-end pt-6 border-t border-line">
        <Button onClick={() => router.push("/journal/phase/2/habit-grid")}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function padBrothers(
  arr: BrotherhoodContent["brothers"] | undefined,
): NonNullable<BrotherhoodContent["brothers"]> {
  const out = arr ? [...arr] : [];
  while (out.length < 3) out.push({ ...EMPTY_BROTHER });
  return out.slice(0, 3);
}
