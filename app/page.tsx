export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-6">
        THE NEW AGE MAN
      </p>
      <h1 className="font-serif italic text-5xl md:text-6xl text-ink text-center leading-tight">
        The First 90
      </h1>
      <span
        aria-hidden
        className="mt-8 block h-px w-16 bg-blood"
      />
      <p className="mt-8 max-w-md text-center text-base text-steel">
        A 12-week journal for the man who has decided to stop drifting.
      </p>
    </main>
  );
}
