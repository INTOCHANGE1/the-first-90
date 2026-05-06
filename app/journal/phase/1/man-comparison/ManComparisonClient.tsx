"use client";

import { useMemo } from "react";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FormFooter } from "@/components/journal/FormFooter";
import { MAN_COMPARISON } from "@/lib/content/phase-1";

type Shape = {
  been: string[];
  becoming: string[];
};

const MAX_LINES = 10;

export function ManComparisonClient({
  initial,
}: {
  initial: Shape;
}) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } = useAutosave<Shape>(
    {
      been: initial.been.length ? initial.been : [""],
      becoming: initial.becoming.length ? initial.becoming : [""],
    },
    async (next) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("man_comparison_entries").upsert(
        {
          user_id: user.id,
          been: next.been.filter((s) => s.trim()),
          becoming: next.becoming.filter((s) => s.trim()),
        },
        { onConflict: "user_id" },
      );
      if (error) throw error;
    },
  );

  function setLine(
    column: "been" | "becoming",
    index: number,
    value: string,
  ) {
    setData((prev) => {
      const arr = [...prev[column]];
      arr[index] = value;
      return { ...prev, [column]: arr };
    });
  }

  function addLine(column: "been" | "becoming") {
    setData((prev) =>
      prev[column].length >= MAX_LINES
        ? prev
        : { ...prev, [column]: [...prev[column], ""] },
    );
  }

  function removeLine(column: "been" | "becoming", index: number) {
    setData((prev) => ({
      ...prev,
      [column]: prev[column].filter((_, i) => i !== index),
    }));
  }

  const filled =
    data.been.some((s) => s.trim()) || data.becoming.some((s) => s.trim());

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-ash">{MAN_COMPARISON.hint}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Column
          label={MAN_COMPARISON.beenLabel}
          values={data.been}
          onChange={(i, v) => setLine("been", i, v)}
          onAdd={() => addLine("been")}
          onRemove={(i) => removeLine("been", i)}
          flush={flush}
        />
        <Column
          label={MAN_COMPARISON.becomingLabel}
          values={data.becoming}
          onChange={(i, v) => setLine("becoming", i, v)}
          onAdd={() => addLine("becoming")}
          onRemove={(i) => removeLine("becoming", i)}
          flush={flush}
          accent
        />
      </div>

      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/phase/1/perfect-morning"
        canContinue={filled}
      />
    </div>
  );
}

function Column({
  label,
  values,
  onChange,
  onAdd,
  onRemove,
  flush,
  accent,
}: {
  label: string;
  values: string[];
  onChange: (i: number, v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  flush: () => Promise<void>;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <MicroLabel>{label}</MicroLabel>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder="…"
              bloodAccent={accent}
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Remove line"
                className="text-ash hover:text-blood transition-colors p-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      {values.length < MAX_LINES && (
        <button
          type="button"
          onClick={onAdd}
          className="self-start inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ash hover:text-ink"
        >
          <Plus className="w-3.5 h-3.5" />
          Add line
        </button>
      )}
    </div>
  );
}
