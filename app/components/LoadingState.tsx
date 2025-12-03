"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LoadingHero() {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-card animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-96" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full max-w-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40" />
            <Skeleton className="h-14 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingRow() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="flex-shrink-0 w-48 aspect-[2/3] rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(18)].map((_, i) => (
        <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
      ))}
    </div>
  );
}

