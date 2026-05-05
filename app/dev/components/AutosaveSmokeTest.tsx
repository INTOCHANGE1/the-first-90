"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/SectionHeading";

/**
 * Hits a real DB write to prove the autosave hook is wired correctly.
 *
 * Strategy: upserts a single freeform_entries row titled "__dev_autosave_test__"
 * for the current user. RLS keeps the row scoped to them. Phase 8 will surface
 * freeform entries to the user; for now this is just a typing surface to
 * verify the engine.
 */
export function AutosaveSmokeTest() {
  const supabase = useMemo(() => createClient(), []);
  const [rowId, setRowId] = useState<string | null>(null);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  // Bootstrap: find or create the dev test row.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBootstrapError("Sign in to test autosave.");
        return;
      }

      const { data: existing } = await supabase
        .from("freeform_entries")
        .select("id, content")
        .eq("user_id", user.id)
        .eq("title", "__dev_autosave_test__")
        .maybeSingle();

      if (cancelled) return;

      if (existing) {
        setRowId(existing.id);
        setInitial(existing.content ?? "");
      } else {
        const { data: created, error } = await supabase
          .from("freeform_entries")
          .insert({
            user_id: user.id,
            title: "__dev_autosave_test__",
            content: "",
          })
          .select("id")
          .single();
        if (error || !created) {
          setBootstrapError(error?.message ?? "Couldn't create test row.");
          return;
        }
        setRowId(created.id);
        setInitial("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const [initial, setInitial] = useState<string | null>(null);

  if (bootstrapError) {
    return (
      <p className="text-sm text-blood">{bootstrapError}</p>
    );
  }
  if (rowId === null || initial === null) {
    return <p className="text-sm text-ash">Pulling test row…</p>;
  }

  return (
    <Inner supabase={supabase} rowId={rowId} initial={initial} />
  );
}

function Inner({
  supabase,
  rowId,
  initial,
}: {
  supabase: ReturnType<typeof createClient>;
  rowId: string;
  initial: string;
}) {
  const { data, setData, status, lastSavedAt, flush } = useAutosave(
    initial,
    async (content) => {
      const { error } = await supabase
        .from("freeform_entries")
        .update({ content })
        .eq("id", rowId);
      if (error) throw error;
    },
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <MicroLabel>Autosave smoke test</MicroLabel>
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
      </div>
      <Textarea
        value={data}
        onChange={(e) => setData(e.target.value)}
        onBlur={() => void flush()}
        placeholder="Type here. Watch the indicator above."
      />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => void flush()}>
          Flush now
        </Button>
        <Button
          variant="secondary"
          onClick={() => setData((prev) => prev + "\n— burst — ")}
        >
          Burst-edit
        </Button>
      </div>
      <p className="text-xs text-ash">
        Stored as a hidden freeform_entries row titled
        &ldquo;__dev_autosave_test__&rdquo;. Cleared per user; safe to leave.
      </p>
    </div>
  );
}
