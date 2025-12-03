"use client";

import { Media, getImageUrl, getMediaTitle, getMediaYear } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Play, Info, Star, Film, Tv } from "lucide-react";

interface HeroBannerProps {
  media: Media;
  onPlayClick: () => void;
  onInfoClick: () => void;
}

export function HeroBanner({ media, onPlayClick, onInfoClick }: HeroBannerProps) {
  const backdropUrl = getImageUrl(media.backdrop_path, "original");
  const title = getMediaTitle(media);
  const year = getMediaYear(media);
  const isTV = !!media.first_air_date || !!media.name;

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background image */}
      {backdropUrl && (
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
      )}

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isTV ? (
                <Tv className="h-4 w-4 text-primary" />
              ) : (
                <Film className="h-4 w-4 text-primary" />
              )}
              <p className="text-primary font-semibold tracking-widest text-sm">
                {isTV ? "TV SERIES" : "FEATURED FILM"}
              </p>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display tracking-wider text-foreground">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {media.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-accent fill-current" />
                <span className="text-accent font-bold text-lg">
                  {media.vote_average.toFixed(1)}
                </span>
              </div>
            )}
            {year && <span className="text-muted-foreground">{year}</span>}
          </div>

          <p className="text-muted-foreground text-lg line-clamp-3 max-w-xl">
            {media.overview}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Button variant="hero" size="xl" onClick={onPlayClick} className="gap-3">
              <Play className="h-6 w-6 fill-current" />
              Play Trailer
            </Button>
            <Button variant="outline" size="xl" onClick={onInfoClick} className="gap-3">
              <Info className="h-6 w-6" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

