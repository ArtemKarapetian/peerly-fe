import { Skeleton } from "./skeleton";

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="space-y-4 mt-8">
        <Skeleton className="h-24 w-full rounded-[16px]" />
        <Skeleton className="h-24 w-full rounded-[16px]" />
        <Skeleton className="h-24 w-full rounded-[16px]" />
      </div>
    </div>
  );
}
