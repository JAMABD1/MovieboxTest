"use client";

import { useEffect, useState } from "react";
import { Media, MediaVideo, MediaType, getImageUrl, getMediaTitle, getMediaYear } from "@/lib/tmdb";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Star, Clock, Calendar, Play, Tv, Film } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaModalProps {
  mediaId: number | null;
  mediaType: MediaType | null;
  onClose: () => void;
}

export function MediaModal({ mediaId, mediaType, onClose }: MediaModalProps) {
  const [media, setMedia] = useState<Media | null>(null);
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (mediaId && mediaType) {
      setLoading(true);
      setShowTrailer(false);
      
      const typePath = mediaType === "tv" ? "tv" : "movie";

      Promise.all([
        fetch(`/api/tmdb/${typePath}/${mediaId}?include=videos`),
      ])
        .then(async ([res]) => {
          const data = await res.json();
          setMedia(data.details as Media);
          const vids: MediaVideo[] = (data.videos || []).filter((v: MediaVideo) => v.site === "YouTube");
          setVideos(vids);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [mediaId, mediaType]);

  const trailer = videos.find(v => v.type === "Trailer") || videos[0];
  const backdropUrl = getImageUrl(media?.backdrop_path || null, "original");
  const posterUrl = getImageUrl(media?.poster_path || null, "w500");
  const title = media ? getMediaTitle(media) : "";
  const year = media ? getMediaYear(media) : "";
  const isTV = mediaType === "tv";

  return (
    <Dialog open={!!mediaId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="w-full h-64" />
            <Skeleton className="w-3/4 h-8" />
            <Skeleton className="w-full h-20" />
          </div>
        ) : media ? (
          <div className="animate-fade-in">
            {/* Hero section with backdrop or trailer */}
            <div className="relative aspect-video bg-secondary">
              {showTrailer && trailer ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  title={trailer.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : backdropUrl ? (
                <>
                  <img
                    src={backdropUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 hero-gradient" />
                  {trailer && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="hero"
                        size="xl"
                        onClick={() => setShowTrailer(true)}
                        className="gap-3"
                      >
                        <Play className="h-6 w-6 fill-current" />
                        Watch Trailer
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <span className="text-muted-foreground">No backdrop available</span>
                </div>
              )}
            </div>

            {/* Media info */}
            <div className="p-6 space-y-4">
              <div className="flex gap-6">
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt={title}
                    className="w-32 h-48 object-cover rounded-lg card-shadow hidden sm:block -mt-20 relative z-10"
                  />
                )}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    {isTV ? (
                      <Tv className="h-5 w-5 text-primary" />
                    ) : (
                      <Film className="h-5 w-5 text-accent" />
                    )}
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {isTV ? "TV Series" : "Movie"}
                    </span>
                  </div>
                  <h2 className="text-3xl font-display tracking-wide text-foreground">
                    {title}
                  </h2>
                  
                  {media.tagline && (
                    <p className="text-muted-foreground italic">"{media.tagline}"</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {year && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {year}
                      </div>
                    )}
                    {media.runtime && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {Math.floor(media.runtime / 60)}h {media.runtime % 60}m
                      </div>
                    )}
                    {media.number_of_seasons && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Tv className="h-4 w-4" />
                        {media.number_of_seasons} Season{media.number_of_seasons > 1 ? "s" : ""}
                      </div>
                    )}
                    {media.vote_average > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-accent fill-current" />
                        <span className="text-accent font-semibold">
                          {media.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {media.genres && media.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {media.genres.map(genre => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {media.overview || "No overview available."}
                </p>
              </div>

              {/* Additional trailers */}
              {videos.length > 1 && (
                <div className="pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3">More Videos</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {videos.slice(0, 5).map(video => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setShowTrailer(true);
                          setVideos([video, ...videos.filter(v => v.id !== video.id)]);
                        }}
                        className="flex-shrink-0 px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                      >
                        {video.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

