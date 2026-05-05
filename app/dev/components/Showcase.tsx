"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { RatingPills } from "@/components/ui/RatingPills";
import { Card } from "@/components/ui/Card";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PullQuote } from "@/components/ui/PullQuote";
import { H1, H2, H3, MicroLabel } from "@/components/ui/SectionHeading";
import { PromptBlock } from "@/components/journal/PromptBlock";
import {
  DailyRatingsRow,
  type DailyRatingsValues,
} from "@/components/journal/DailyRatingsRow";
import {
  HabitGrid,
  type HabitTicks,
} from "@/components/journal/HabitGrid";
import {
  WheelOfLife,
  type WheelRatings,
} from "@/components/journal/WheelOfLife";
import { AutosaveSmokeTest } from "./AutosaveSmokeTest";

export function Showcase() {
  const [rating5, setRating5] = useState<number | null>(null);
  const [rating10, setRating10] = useState<number | null>(7);
  const [checked, setChecked] = useState(false);
  const [text, setText] = useState("");
  const [longText, setLongText] = useState("");
  const [dailyRatings, setDailyRatings] = useState<DailyRatingsValues>({
    mindset: 4,
    sleep: 3,
    energy: 4,
    mood: 3,
  });
  const [wheel, setWheel] = useState<WheelRatings>({
    career: 7,
    finance: 4,
    health: 6,
    family: 8,
  });
  const [habits, setHabits] = useState<string[]>([
    "Train",
    "Read",
    "Meditate",
    "No alcohol",
    "In bed by 10",
  ]);
  const [ticks, setTicks] = useState<HabitTicks>({
    "0": [true, true, true, true, true, false, false],
    "1": [true, false, true, true, true],
    "2": [true, true, true],
    "3": [true, true, true, true, true, true, true, true, true, true],
    "4": [false, true, true, false, true],
  });

  return (
    <div className="flex flex-col gap-16 py-12">
      <Section title="Typography" small="H1 / H2 / H3 / micro / serif italic">
        <H1>The man holding this</H1>
        <H2>Phase one: see clearly</H2>
        <H3>Morning</H3>
        <MicroLabel>Phase 1 · Day 12 / 90</MicroLabel>
        <p className="font-serif italic text-2xl text-ink">
          What you face is the shape of who you&rsquo;ve been.
        </p>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Save & continue</Button>
          <Button variant="secondary">Edit</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="flex flex-col gap-4 max-w-sm">
          <Input placeholder="NAM-XXXXXX" />
          <Input placeholder="With blood accent" bloodAccent />
          <Textarea
            placeholder="Write what's true."
            value={longText}
            onChange={(e) => setLongText(e.target.value)}
          />
          <Textarea placeholder="With blood accent" bloodAccent />
        </div>
      </Section>

      <Section title="Rating pills" small="1-5 and 1-10 scales">
        <RatingPills
          label="Mindset"
          value={rating5}
          onChange={setRating5}
          scale={5}
        />
        <RatingPills
          label="Wheel rating"
          value={rating10}
          onChange={setRating10}
          scale={10}
        />
      </Section>

      <Section title="Checkbox">
        <div className="flex items-center gap-3">
          <Checkbox checked={checked} onCheckedChange={setChecked} />
          <span className="text-sm text-ink">
            {checked ? "Checked" : "Unchecked"}
          </span>
        </div>
        <Checkbox checked disabled onCheckedChange={() => {}} />
      </Section>

      <Section title="Cards">
        <Card>
          <H3>Default card</H3>
          <p className="text-sm text-steel mt-2">
            Bone-warm surface with hairline border. The default container.
          </p>
        </Card>
        <Card variant="active">
          <MicroLabel className="text-bone/70">Today</MicroLabel>
          <H2 className="text-bone mt-1">Morning page</H2>
          <p className="text-sm text-bone/80 mt-2">
            Ink surface with blood-accent stripe — for today&rsquo;s CTA.
          </p>
        </Card>
        <Card variant="tinted">
          <H3>Tinted card</H3>
          <p className="text-sm text-steel mt-2">
            Blood-faint background. For weighted callouts. Sparingly.
          </p>
        </Card>
      </Section>

      <Section title="Save indicator">
        <SaveIndicator status="saving" />
        <SaveIndicator status="saved" lastSavedAt={new Date()} />
        <SaveIndicator status="error" />
      </Section>

      <Section title="Progress bar">
        <ProgressBar current={12} total={90} label="THE FIRST 90" />
        <ProgressBar current={4} total={10} label="WHEEL OF LIFE" />
      </Section>

      <Section title="Pull quote">
        <PullQuote attribution="Ben">
          You don&rsquo;t need more time. You need fewer leaks.
        </PullQuote>
      </Section>

      <Section title="Prompt block">
        <PromptBlock
          label="My mantra to get me through today"
          variant="input"
          bloodAccent
          value={text}
          onChange={setText}
        />
        <PromptBlock
          label="One important task I will get done today"
          intro="One thing. The thing that matters most."
          value={longText}
          onChange={setLongText}
        />
      </Section>

      <Section title="Daily ratings row">
        <DailyRatingsRow values={dailyRatings} onChange={setDailyRatings} />
      </Section>

      <Section title="Habit grid">
        <HabitGrid
          habits={habits}
          ticks={ticks}
          todayIndex={11}
          onToggle={(hi, di, next) =>
            setTicks((prev) => {
              const row = [...(prev[String(hi)] ?? [])];
              while (row.length <= di) row.push(false);
              row[di] = next;
              return { ...prev, [String(hi)]: row };
            })
          }
        />
        <p className="text-xs text-ash mt-2">
          Tap any cell up to today (day 12). Future days locked.
        </p>
      </Section>

      <Section title="Wheel of Life">
        <WheelOfLife ratings={wheel} onChange={setWheel} />
      </Section>

      <Section title="Autosave engine (live DB write)">
        <AutosaveSmokeTest />
      </Section>
    </div>
  );
}

function Section({
  title,
  small,
  children,
}: {
  title: string;
  small?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <H2>{title}</H2>
        {small && (
          <p className="text-sm text-ash mt-1">{small}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
