import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] grid-rows-[56px_1fr]">
      <div className="col-span-1 flex h-14 items-center border-b bg-background px-4">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="col-span-1 flex h-14 items-center gap-3 border-b bg-background px-4">
        <Skeleton className="h-8 max-w-sm flex-1" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-3 border-r bg-background p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-full" />
        ))}
      </div>
      <div className="p-6">
        <Skeleton className="mb-3 h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="mt-8 grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}
