"use client";

import { useMemo, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { deleteFreeformEntry } from "../actions";

type Shape = {
  title: string;
  content: string;
};

export function FreeformEditor({
  id,
  initial,
}: {
  id: string;
  initial: Shape;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [deleting, startDelete] = useTransition();

  const { data, setData, status, lastSavedAt, flush } = useAutosave<Shape>(
    initial,
    async (next) => {
      const { error } = await supabase
        .from("freeform_entries")
        .update({
          title: next.title.trim() || null,
          content: next.content,
        })
        .eq("id", id);
      if (error) throw error;
    },
  );

  function confirmDelete() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Delete this entry? This cannot be undone.")
    ) {
      return;
    }
    startDelete(() => deleteFreeformEntry(id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <MicroLabel>TITLE (OPTIONAL)</MicroLabel>
        <Input
          value={data.title}
          onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
          onBlur={() => void flush()}
          placeholder="A line that names this page."
        />
      </div>

      <div className="flex flex-col gap-2">
        <MicroLabel>WRITE</MicroLabel>
        <Textarea
          value={data.content}
          onChange={(e) =>
            setData((p) => ({ ...p, content: e.target.value }))
          }
          onBlur={() => void flush()}
          placeholder="Write what's true."
          bloodAccent
          className="min-h-[320px]"
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <button
          type="button"
          onClick={confirmDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-ash hover:text-blood transition-colors disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
