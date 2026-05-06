"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import {
  WheelOfLife,
  WHEEL_SEGMENTS,
  type WheelRatings,
} from "@/components/journal/WheelOfLife";
import { FormFooter } from "@/components/journal/FormFooter";

type Props = {
  initialRatings: WheelRatings;
};

export function WheelClient({ initialRatings }: Props) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<WheelRatings>(initialRatings, async (ratings) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("wheel_entries").upsert(
        {
          user_id: user.id,
          moment: "phase_1_start",
          ratings,
        },
        { onConflict: "user_id,moment" },
      );
      if (error) throw error;
    });

  const allRated = WHEEL_SEGMENTS.every(
    (s) => typeof data[s.key] === "number",
  );

  return (
    <div className="flex flex-col gap-8">
      <WheelOfLife
        ratings={data}
        onChange={(next) => setData(next)}
      />
      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/phase/1/wheel-debrief"
        canContinue={allRated}
      />
    </div>
  );
}
