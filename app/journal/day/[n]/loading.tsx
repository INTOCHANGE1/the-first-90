import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DayLoading() {
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <Skeleton className="h-3 w-56 mb-3" />
        <Skeleton className="h-12 md:h-14 w-3/4 mb-10" />

        <Skeleton className="h-3 w-20 mb-6" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        <Skeleton className="h-3 w-48 mb-3" />
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="h-3 w-48 mb-3" />
        <Skeleton className="h-32 w-full mb-8" />
        <Skeleton className="h-3 w-48 mb-3" />
        <Skeleton className="h-32 w-full" />
      </PageMain>
    </PageShell>
  );
}
