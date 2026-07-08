import { Skeleton } from "@/components/ui/Skeleton";

/** Placeholder for a single shop product card. `imageHeight` matches the real
 * card it stands in for (280px shop cards, 250px home-page bakes) so the grid
 * doesn't jump when data lands. */
export function ShopCardSkeleton({ imageHeight = 280 }: { imageHeight?: number }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-ink/10 bg-card" aria-busy="true">
      <Skeleton className="rounded-none" style={{ height: imageHeight }} />
      <div className="grid gap-3 px-6 pb-[26px] pt-[22px]">
        <div className="flex justify-between gap-3.5">
          <Skeleton className="h-[22px] w-[55%]" />
          <Skeleton className="h-[18px] w-16" />
        </div>
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-[70%]" />
        <Skeleton className="mt-1 h-3.5 w-2/5" />
      </div>
    </div>
  );
}

/** A responsive grid of shop card skeletons. */
export function ShopGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] gap-[clamp(20px,3vw,32px)]">
      {Array.from({ length: count }, (_, i) => (
        <ShopCardSkeleton key={i} />
      ))}
    </div>
  );
}
