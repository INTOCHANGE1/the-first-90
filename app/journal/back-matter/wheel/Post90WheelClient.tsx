"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { WheelOfLife } from "@/components/journal/WheelOfLife";
import { WHEEL_SEGMENTS, type WheelRatings } from "@/lib/wheel";
import { FormFooter } from "@/components/journal/FormFooter";

export function Post90WheelClient({
  initialRatings,
}: {
  initialRatings: WheelRatings;
}) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<WheelRatings>(initialRatings, async (ratings) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("wheel_entries").upsert(
        { user_id: user.id, moment: "post_90", ratings },
        { onConflict: "user_id,moment" },
      );
      if (error) throw error;
    });

  const allRated = WHEEL_SEGMENTS.every(
    (s) => typeof data[s.key] === "number",
  );

  return (
    <div className="flex flex-col gap-8">
      <WheelOfLife ratings={data} onChange={(next) => setData(next)} />
      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/back-matter/wheel-debrief"
        canContinue={allRated}
      />
    </div>
  );
}
