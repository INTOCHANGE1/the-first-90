"use client";

import { useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createFreeformEntry } from "./actions";

export function NewEntryButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      onClick={() => startTransition(() => createFreeformEntry())}
      disabled={pending}
    >
      <Plus className="w-4 h-4 mr-2 inline-block" />
      {pending ? "Creating…" : "New entry"}
    </Button>
  );
}
