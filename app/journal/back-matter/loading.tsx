import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BackMatterLoading() {
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <Skeleton className="h-3 w-32 mb-3" />
        <Skeleton className="h-12 md:h-14 w-3/4 mb-3" />
        <Skeleton className="h-4 w-2/3 mb-8" />
        <Skeleton className="h-2 w-full mb-8" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full mb-px" />
        ))}
      </PageMain>
    </PageShell>
  );
}
