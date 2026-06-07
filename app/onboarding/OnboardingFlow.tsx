"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TimezonePicker } from "@/components/forms/TimezonePicker";
import { LETTER } from "@/lib/content/front-matter";
import { guessTimezone, isValidTimezone } from "@/lib/utils/timezone";
import { saveOnboardingProfile } from "./actions";

type InitialState = {
  displayName: string;
  timezone: string;
};

type Step = 0 | 1 | 2 | 3;
const TOTAL_STEPS = 4;

export function OnboardingFlow({ initial }: { initial: InitialState }) {
  const [step, setStep] = useState<Step>(0);
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [timezone, setTimezone] = useState(
    initial.timezone || guessTimezone(),
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function next() {
    if (step < TOTAL_STEPS - 1) setStep((step + 1) as Step);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("display_name", displayName.trim());
        fd.set("timezone", timezone);
        await saveOnboardingProfile(fd);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Couldn't save your details.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <ProgressBar
        current={step + 1}
        total={TOTAL_STEPS}
        label="ONBOARDING"
      />

      {step === 0 && <WelcomeStep onNext={next} />}
      {step === 1 && (
        <NameStep
          name={displayName}
          onName={setDisplayName}
          onNext={next}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <TimezoneStep
          timezone={timezone}
          onTimezone={setTimezone}
          onNext={next}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <PickUpThePenStep
          name={displayName}
          onSubmit={submit}
          onBack={() => setStep(2)}
          pending={pending}
          error={error}
        />
      )}
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setReachedEnd(true);
      },
      { rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <MicroLabel>{LETTER.preTitle}</MicroLabel>
      <div className="flex flex-col gap-4">
        {LETTER.paragraphs.map((p, i) => (
          <p
            key={i}
            className={
              i === LETTER.paragraphs.length - 1
                ? "text-ink text-lg font-medium"
                : "text-ink"
            }
          >
            {p}
          </p>
        ))}
        <p className="font-serif italic text-lg text-ink mt-4">
          {LETTER.signoff}
        </p>
        <p className="text-sm text-ash">{LETTER.role}</p>
      </div>
      <div ref={sentinelRef} />
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-ash">
          {reachedEnd ? "Take it in. Then continue." : "Read to the end."}
        </p>
        <Button onClick={onNext} disabled={!reachedEnd}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function NameStep({
  name,
  onName,
  onNext,
  onBack,
}: {
  name: string;
  onName: (n: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const trimmed = name.trim();
  const valid = trimmed.length > 0 && trimmed.length <= 60;

  return (
    <div className="flex flex-col gap-6">
      <MicroLabel>YOUR NAME</MicroLabel>
      <h2 className="font-serif italic text-3xl md:text-4xl text-ink">
        What should the journal call you?
      </h2>
      <p className="text-base text-steel">
        Your first name is plenty. The morning page greets you by it.
      </p>
      <Input
        value={name}
        onChange={(e) => onName(e.target.value)}
        placeholder="Ben"
        autoFocus
        bloodAccent
      />
      <div className="flex justify-between gap-4 mt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!valid}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function TimezoneStep({
  timezone,
  onTimezone,
  onNext,
  onBack,
}: {
  timezone: string;
  onTimezone: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid = isValidTimezone(timezone);

  return (
    <div className="flex flex-col gap-6">
      <MicroLabel>TIMEZONE</MicroLabel>
      <h2 className="font-serif italic text-3xl md:text-4xl text-ink">
        When does your day start?
      </h2>
      <p className="text-base text-steel">
        We use this to know when &ldquo;today&rdquo; ticks over for your
        morning and evening pages. We&rsquo;ve guessed from your browser;
        change it from the list below if it&rsquo;s wrong.
      </p>
      <TimezonePicker value={timezone} onChange={onTimezone} />
      {!isValid && (
        <p className="text-sm text-blood">
          Pick a real timezone from the list. The current value isn&rsquo;t
          recognised.
        </p>
      )}
      <div className="flex justify-between gap-4 mt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function PickUpThePenStep({
  name,
  onSubmit,
  onBack,
  pending,
  error,
}: {
  name: string;
  onSubmit: () => void;
  onBack: () => void;
  pending: boolean;
  error: string | null;
}) {
  const first = name.trim().split(" ")[0] || "friend";
  return (
    <div className="flex flex-col gap-6">
      <MicroLabel>BEGIN</MicroLabel>
      <h2 className="font-serif italic text-3xl md:text-4xl text-ink">
        Pick up the pen, {first}.
      </h2>
      <p className="text-base text-steel">
        First page is The Line in the Sand. Write what you&rsquo;re leaving
        behind. Write the man you&rsquo;re becoming. Sign it. Read it on the
        days you want to quit.
      </p>
      <p className="text-base text-steel">
        Take your time on it. The journal will be here when you come back.
      </p>
      {error && <p className="text-sm text-blood">{error}</p>}
      <div className="flex justify-between gap-4 mt-4">
        <Button variant="secondary" onClick={onBack} disabled={pending}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={pending}>
          {pending ? "Starting…" : "Begin the work"}
        </Button>
      </div>
    </div>
  );
}
