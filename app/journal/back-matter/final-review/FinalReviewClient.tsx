"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  FINAL_REVIEW,
  type FinalReviewContent,
} from "@/lib/content/back-matter";

type Props = {
  initial: FinalReviewContent;
  alreadyComplete: boolean;
};

export function FinalReviewClient({ initial, alreadyComplete }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<FinalReviewContent>(initial, async (next) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase
        .from("final_reviews")
        .upsert({ user_id: user.id, ...next }, { onConflict: "user_id" });
      if (error) throw error;
    });

  const filled = FINAL_REVIEW.prompts.some(
    (p) => (data[p.key] ?? "").trim(),
  );

  async function commit() {
    await flush();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("final_reviews").upsert(
      {
        user_id: user.id,
        ...data,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    router.push("/journal/back-matter/wheel");
  }

  return (
    <div className="flex flex-col gap-8">
      {FINAL_REVIEW.prompts.map((prompt) => (
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

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <Button onClick={commit} disabled={!filled}>
          {alreadyComplete ? "Update review" : "Lock review · open the wheel"}
        </Button>
      </div>
    </div>
  );
}
