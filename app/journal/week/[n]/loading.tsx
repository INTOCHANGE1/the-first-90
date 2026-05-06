import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function WeekLoading() {
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <Skeleton className="h-3 w-56 mb-3" />
        <Skeleton className="h-12 md:h-14 w-1/2 mb-10" />
        <Skeleton className="h-3 w-32 mb-6" />
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-32 w-full" />
      </PageMain>
    </PageShell>
  );
}
