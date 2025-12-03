"use client";

import { Media, getImageUrl, getMediaTitle, getMediaYear } from "@/lib/tmdb";
import { Star, Film, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  media: Media;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function MediaCard({ media, onClick, className, style }: MediaCardProps) {
  const posterUrl = getImageUrl(media.poster_path, "w500");
  const title = getMediaTitle(media);
  const year = getMediaYear(media);
  const isTV = media.media_type === "tv" || !!media.first_air_date || !!media.name;

  return (
    <article
      className={cn(
        "group relative cursor-pointer rounded-lg overflow-hidden bg-card transition-all duration-300 hover:scale-105 hover:z-10 card-shadow",
        className
      )}
      onClick={onClick}
      style={style}
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-secondary">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {isTV ? <Tv className="h-12 w-12" /> : <Film className="h-12 w-12" />}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Media type badge */}
      <div className="absolute top-2 left-2">
        <span className={cn(
          "px-2 py-0.5 text-xs font-medium rounded",
          isTV ? "bg-primary/90 text-primary-foreground" : "bg-accent/90 text-accent-foreground"
        )}>
          {isTV ? "TV" : "Movie"}
        </span>
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {media.vote_average > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-accent fill-current" />
              <span>{media.vote_average.toFixed(1)}</span>
            </div>
          )}
          {year && <span>{year}</span>}
        </div>
      </div>

      {/* Rating badge */}
      {media.vote_average > 0 && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs group-hover:opacity-0 transition-opacity">
          <Star className="h-3 w-3 text-accent fill-current" />
          <span className="text-foreground font-medium">{media.vote_average.toFixed(1)}</span>
        </div>
      )}
    </article>
  );
}

