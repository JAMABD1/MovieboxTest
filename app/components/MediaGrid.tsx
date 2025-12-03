"use client";

import { Media, MediaType } from "@/lib/tmdb";
import { MediaCard } from "./MediaCard";

interface MediaGridProps {
  items: Media[];
  onItemClick: (id: number, type: MediaType) => void;
  defaultType?: MediaType;
}

export function MediaGrid({ items, onItemClick, defaultType = "movie" }: MediaGridProps) {
  const getMediaType = (item: Media): MediaType => {
    if (item.media_type) return item.media_type;
    if (item.first_air_date || item.name) return "tv";
    return defaultType;
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item, index) => (
        <MediaCard
          key={`${item.id}-${index}`}
          media={item}
          onClick={() => onItemClick(item.id, getMediaType(item))}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 30}ms` }}
        />
      ))}
    </div>
  );
}

