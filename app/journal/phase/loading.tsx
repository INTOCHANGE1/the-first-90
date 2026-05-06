import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shared loading skeleton for /journal/phase/1, /phase/2, /phase/3 hubs and
 * any nested deep-work pages without their own loading.tsx.
 */
export default function PhaseLoading() {
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <Skeleton className="h-3 w-32 mb-3" />
        <Skeleton className="h-12 md:h-14 w-2/3 mb-3" />
        <Skeleton className="h-3 w-48 mb-8" />
        <Skeleton className="h-24 w-full my-8 rounded-lg" />
        <Skeleton className="h-2 w-full mb-8" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-12 w-full mb-px" />
        ))}
      </PageMain>
    </PageShell>
  );
}
