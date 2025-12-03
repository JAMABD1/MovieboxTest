"use client";

import { useRef } from "react";
import { Media, MediaType } from "@/lib/tmdb";
import { MediaCard } from "./MediaCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaRowProps {
  title: string;
  items: Media[];
  onItemClick: (id: number, type: MediaType) => void;
  defaultType?: MediaType;
}

export function MediaRow({ title, items, onItemClick, defaultType = "movie" }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getMediaType = (item: Media): MediaType => {
    if (item.media_type) return item.media_type;
    if (item.first_air_date || item.name) return "tv";
    return defaultType;
  };

  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-display tracking-wide text-foreground px-4 md:px-0">
        {title}
      </h2>
      
      <div className="relative group">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Media list */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <MediaCard
              key={`${item.id}-${index}`}
              media={item}
              onClick={() => onItemClick(item.id, getMediaType(item))}
              className="flex-shrink-0 w-40 md:w-48"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>

        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
}

