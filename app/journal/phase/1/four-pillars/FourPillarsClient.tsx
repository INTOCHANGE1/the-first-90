"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Textarea } from "@/components/ui/Textarea";
import { H3, MicroLabel } from "@/components/ui/SectionHeading";
import { FormFooter } from "@/components/journal/FormFooter";
import { FOUR_PILLARS_AUDIT } from "@/lib/content/phase-1";

type Pillars = {
  self_text: string;
  partner_text: string;
  children_text: string;
  work_text: string;
  reflection: string;
};

export function FourPillarsClient({
  initial,
}: {
  initial: Pillars;
}) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } = useAutosave<Pillars>(
    initial,
    async (next) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("four_pillars_entries").upsert(
        { user_id: user.id, moment: "audit", ...next },
        { onConflict: "user_id,moment" },
      );
      if (error) throw error;
    },
  );

  const keyByPillar: Record<string, keyof Pillars> = {
    self: "self_text",
    partner: "partner_text",
    children: "children_text",
    work: "work_text",
  };

  const filled =
    FOUR_PILLARS_AUDIT.pillars.some(
      (p) => data[keyByPillar[p.key]]?.trim(),
    ) || !!data.reflection.trim();

  return (
    <div className="flex flex-col gap-8">
      {FOUR_PILLARS_AUDIT.pillars.map((pillar) => {
        const dbKey = keyByPillar[pillar.key];
        return (
          <section key={pillar.key} className="flex flex-col gap-3">
            <H3>{pillar.heading}</H3>
            <p className="text-sm text-steel">{pillar.label}</p>
            <Textarea
              value={data[dbKey] ?? ""}
              onChange={(e) =>
                setData((p) => ({ ...p, [dbKey]: e.target.value }))
              }
              onBlur={() => void flush()}
              bloodAccent
            />
          </section>
        );
      })}

      <section className="flex flex-col gap-3 pt-4 border-t border-line">
        <MicroLabel>{FOUR_PILLARS_AUDIT.reflectionLabel}</MicroLabel>
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
        nextHref="/journal/phase/1/integrity-inventory"
        canContinue={filled}
      />
    </div>
  );
}
