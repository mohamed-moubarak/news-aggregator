import { Skeleton } from '@heroui/react'

export function ArticleCardSkeleton() {
  return (
    <div className="bg-surface grid grid-cols-[2rem_1fr] overflow-hidden rounded-xl md:grid-cols-[2.125rem_1fr]">
      <Skeleton className="h-full rounded-none" />
      <div className="flex flex-col gap-3 p-4 md:p-5">
        <Skeleton className="aspect-[16/9] w-full rounded-lg" />
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="mt-2 h-3 w-28 rounded" />
      </div>
    </div>
  )
}

export function LeadStorySkeleton() {
  return (
    <div className="bg-surface grid overflow-hidden rounded-xl md:grid-cols-[1.35fr_1fr]">
      <Skeleton className="aspect-[16/10] w-full rounded-none md:aspect-auto md:min-h-[360px]" />
      <div className="flex flex-col gap-4 p-5 md:p-10">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-8 w-4/5 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
    </div>
  )
}
