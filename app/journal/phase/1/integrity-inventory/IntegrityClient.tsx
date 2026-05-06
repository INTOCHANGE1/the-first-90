"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Textarea } from "@/components/ui/Textarea";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FormFooter } from "@/components/journal/FormFooter";
import { INTEGRITY_INVENTORY } from "@/lib/content/phase-1";

type Shape = {
  broken_to_self: string;
  broken_to_partner: string;
  broken_to_children: string;
  broken_to_work: string;
  reflection: string;
};

export function IntegrityClient({ initial }: { initial: Shape }) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } = useAutosave<Shape>(
    initial,
    async (next) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("integrity_inventory_entries").upsert(
        { user_id: user.id, ...next },
        { onConflict: "user_id" },
      );
      if (error) throw error;
    },
  );

  const filled = INTEGRITY_INVENTORY.prompts.some(
    (p) => (data[p.key] ?? "").trim(),
  ) || !!data.reflection.trim();

  return (
    <div className="flex flex-col gap-8">
      {INTEGRITY_INVENTORY.prompts.map((prompt) => (
        <div key={prompt.key} className="flex flex-col gap-3">
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

      <section className="flex flex-col gap-3 pt-4 border-t border-line">
        <MicroLabel>{INTEGRITY_INVENTORY.reflectionLabel}</MicroLabel>
        <Textarea
          value={data.reflection ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, reflection: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/phase/1/man-comparison"
        canContinue={filled}
      />
    </div>
  );
}
