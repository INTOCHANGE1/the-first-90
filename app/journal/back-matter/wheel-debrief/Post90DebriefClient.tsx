"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  POST_90_WHEEL_DEBRIEF,
  type Post90DebriefShape,
} from "@/lib/content/back-matter";

type Props = {
  initial: Post90DebriefShape;
};

export function Post90DebriefClient({ initial }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<Post90DebriefShape>(
      {
        grown: initial.grown ?? ["", "", ""],
        still_work: initial.still_work ?? ["", "", ""],
        biggest_shift: initial.biggest_shift ?? "",
        next_focus: initial.next_focus ?? "",
      },
      async (debrief) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("not signed in");
        const { error } = await supabase.from("wheel_entries").upsert(
          {
            user_id: user.id,
            moment: "post_90",
            debrief,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,moment" },
        );
        if (error) throw error;
      },
    );

  function setGrown(i: number, value: string) {
    setData((p) => {
      const arr = [...(p.grown ?? ["", "", ""])];
      arr[i] = value;
      return { ...p, grown: arr };
    });
  }
  function setStillWork(i: number, value: string) {
    setData((p) => {
      const arr = [...(p.still_work ?? ["", "", ""])];
      arr[i] = value;
      return { ...p, still_work: arr };
    });
  }

  const filled =
    (data.grown ?? []).some((v) => v.trim()) ||
    (data.still_work ?? []).some((v) => v.trim()) ||
    !!data.biggest_shift?.trim();

  async function continueToComparison() {
    await flush();
    router.push("/journal/back-matter/wheel-comparison");
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <MicroLabel>{POST_90_WHEEL_DEBRIEF.prompts.grown}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.grown?.[i] ?? ""}
              onChange={(e) => setGrown(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{POST_90_WHEEL_DEBRIEF.prompts.still_work}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.still_work?.[i] ?? ""}
              onChange={(e) => setStillWork(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{POST_90_WHEEL_DEBRIEF.prompts.biggest_shift}</MicroLabel>
        <Textarea
          value={data.biggest_shift ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, biggest_shift: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{POST_90_WHEEL_DEBRIEF.prompts.next_focus}</MicroLabel>
        <Textarea
          value={data.next_focus ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, next_focus: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <Button onClick={continueToComparison} disabled={!filled}>
          See before & after
        </Button>
      </div>
    </div>
  );
}
