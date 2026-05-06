import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function JournalLoading() {
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <Skeleton className="h-3 w-40 mb-3" />
        <Skeleton className="h-12 md:h-14 w-2/3 mb-12" />
        <Skeleton className="h-44 w-full mb-8 rounded-lg" />
        <Skeleton className="h-12 w-full mb-px" />
        <Skeleton className="h-12 w-full mb-px" />
        <Skeleton className="h-12 w-full mb-px" />
      </PageMain>
    </PageShell>
  );
}
