"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SaveStatus } from "@/components/ui/SaveIndicator";

type Updater<T> = T | ((prev: T) => T);

export type UseAutosaveOptions = {
  /** Milliseconds of inactivity before a save fires. Default: 800. */
  debounceMs?: number;
  /** Pass false to disable autosave entirely (e.g. printed/locked views). */
  enabled?: boolean;
};

export type UseAutosaveReturn<T> = {
  data: T;
  setData: (next: Updater<T>) => void;
  status: SaveStatus;
  lastSavedAt: Date | null;
  /** Force-save right now; resolves once the save settles. */
  flush: () => Promise<void>;
};

const RETRY_DELAYS_MS = [1000, 3000, 9000];

/**
 * Drives autosave for a writing surface.
 *
 * Pattern: every setData schedules a debounced save. flush() can be called on
 * blur or before navigation to commit immediately. If a save fails, we retry
 * silently with exponential backoff up to 3 times before surfacing 'error'.
 *
 * The save function is given the latest snapshot at fire time, not the value
 * captured when setData was called, so rapid typing collapses to one save.
 */
export function useAutosave<T>(
  initialData: T,
  saveFn: (data: T) => Promise<void>,
  options: UseAutosaveOptions = {},
): UseAutosaveReturn<T> {
  const { debounceMs = 800, enabled = true } = options;

  const [data, setDataState] = useState<T>(initialData);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const dataRef = useRef(data);
  const saveFnRef = useRef(saveFn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    saveFnRef.current = saveFn;
  }, [saveFn]);

  const performSave = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    dirtyRef.current = false;
    setStatus("saving");

    let attempt = 0;
    while (true) {
      try {
        await saveFnRef.current(dataRef.current);
        setLastSavedAt(new Date());
        setStatus("saved");
        inFlightRef.current = false;
        // If something dirtied state during the save, kick another round.
        if (dirtyRef.current) {
          dirtyRef.current = false;
          schedule(0);
        }
        return;
      } catch (error) {
        if (attempt >= RETRY_DELAYS_MS.length) {
          console.error("[useAutosave] save failed after retries", error);
          setStatus("error");
          inFlightRef.current = false;
          return;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAYS_MS[attempt]),
        );
        attempt++;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schedule = useCallback(
    (delayMs: number) => {
      if (!enabled) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void performSave();
      }, delayMs);
    },
    [enabled, performSave],
  );

  const setData = useCallback(
    (next: Updater<T>) => {
      setDataState((prev) => {
        const value =
          typeof next === "function"
            ? (next as (prev: T) => T)(prev)
            : next;
        dataRef.current = value;
        if (inFlightRef.current) {
          dirtyRef.current = true;
        } else {
          schedule(debounceMs);
        }
        return value;
      });
    },
    [debounceMs, schedule],
  );

  const flush = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (inFlightRef.current) {
      // Mark dirty so the in-flight save schedules a follow-up if needed.
      dirtyRef.current = true;
      return;
    }
    await performSave();
  }, [performSave]);

  // On unmount, fire any pending save synchronously so we don't lose words.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        if (enabled && !inFlightRef.current) {
          void performSave();
        }
      }
    };
  }, [enabled, performSave]);

  return { data, setData, status, lastSavedAt, flush };
}
