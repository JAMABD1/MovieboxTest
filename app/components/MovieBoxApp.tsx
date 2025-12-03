"use client";

import { useState, useEffect, useMemo } from "react";
import { Media, MediaType } from "@/lib/tmdb";
import { Header, TabType } from "./Header";
import { HeroBanner } from "./HeroBanner";
import { MediaRow } from "./MediaRow";
import { MediaGrid } from "./MediaGrid";
import { MediaModal } from "./MediaModal";
import { LoadingHero, LoadingRow, LoadingGrid } from "./LoadingState";
import { useToast } from "@/hooks/use-toast";

interface SelectedMedia {
  id: number;
  type: MediaType;
}

export function MovieBoxApp() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [trending, setTrending] = useState<Media[]>([]);
  const [popularMovies, setPopularMovies] = useState<Media[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Media[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Media[]>([]);
  const [upcoming, setUpcoming] = useState<Media[]>([]);
  const [popularTV, setPopularTV] = useState<Media[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<Media[]>([]);
  const [onTheAir, setOnTheAir] = useState<Media[]>([]);
  const [searchResults, setSearchResults] = useState<Media[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => setSearchResults((data.results || []).filter((r: Media) => r.media_type === "movie" || r.media_type === "tv")))
          .catch(console.error);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadAllData = async () => {
    setLoading(true);
    
    try {
      const [
        trendingRes,
        popularMoviesRes,
        topRatedMoviesRes,
        nowPlayingRes,
        upcomingRes,
        popularTVRes,
        topRatedTVRes,
        onTheAirRes
      ] = await Promise.all([
        fetch("/api/tmdb/trending"),
        fetch("/api/tmdb/movies/popular"),
        fetch("/api/tmdb/movies/top-rated"),
        fetch("/api/tmdb/movies/now-playing"),
        fetch("/api/tmdb/movies/upcoming"),
        fetch("/api/tmdb/tv/popular"),
        fetch("/api/tmdb/tv/top-rated"),
        fetch("/api/tmdb/tv/on-the-air")
      ]);

      const trendingData = await trendingRes.json();
      const popularMoviesData = await popularMoviesRes.json();
      const topRatedMoviesData = await topRatedMoviesRes.json();
      const nowPlayingData = await nowPlayingRes.json();
      const upcomingData = await upcomingRes.json();
      const popularTVData = await popularTVRes.json();
      const topRatedTVData = await topRatedTVRes.json();
      const onTheAirData = await onTheAirRes.json();

      setTrending(trendingData.results || []);
      setPopularMovies(popularMoviesData.results || []);
      setTopRatedMovies(topRatedMoviesData.results || []);
      setNowPlaying(nowPlayingData.results || []);
      setUpcoming(upcomingData.results || []);
      setPopularTV(popularTVData.results || []);
      setTopRatedTV(topRatedTVData.results || []);
      setOnTheAir(onTheAirData.results || []);
    } catch (error) {
      toast({
        title: "Error loading content",
        description: "Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMediaClick = (id: number, type: MediaType) => {
    setSelectedMedia({ id, type });
  };

  // Featured content for hero
  const featuredMedia = useMemo(() => {
    const candidates = trending.filter(m => m.backdrop_path && m.vote_average > 7);
    return candidates[Math.floor(Math.random() * Math.min(5, candidates.length))] || trending[0];
  }, [trending]);

  const isSearching = searchQuery.trim().length > 0;

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingHero />
          <div className="container mx-auto px-4 py-12 space-y-12">
            <LoadingRow />
            <LoadingRow />
            <LoadingRow />
          </div>
        </>
      );
    }

    if (isSearching) {
      return (
        <div className="container mx-auto px-4 pt-28 pb-12">
          <h2 className="text-2xl font-display tracking-wide text-foreground mb-6">
            Search Results for "{searchQuery}"
          </h2>
          <MediaGrid items={searchResults} onItemClick={handleMediaClick} />
        </div>
      );
    }

    switch (activeTab) {
      case "movies":
        return (
          <div className="container mx-auto px-4 pt-28 pb-12 space-y-12">
            <MediaRow title="Now Playing" items={nowPlaying} onItemClick={handleMediaClick} defaultType="movie" />
            <MediaRow title="Popular Movies" items={popularMovies} onItemClick={handleMediaClick} defaultType="movie" />
            <MediaRow title="Top Rated" items={topRatedMovies} onItemClick={handleMediaClick} defaultType="movie" />
            <MediaRow title="Coming Soon" items={upcoming} onItemClick={handleMediaClick} defaultType="movie" />
            <section className="space-y-4">
              <h2 className="text-2xl font-display tracking-wide text-foreground">All Popular Movies</h2>
              <MediaGrid items={popularMovies} onItemClick={handleMediaClick} defaultType="movie" />
            </section>
          </div>
        );

      case "tv":
        return (
          <div className="container mx-auto px-4 pt-28 pb-12 space-y-12">
            <MediaRow title="On The Air" items={onTheAir} onItemClick={handleMediaClick} defaultType="tv" />
            <MediaRow title="Popular TV Shows" items={popularTV} onItemClick={handleMediaClick} defaultType="tv" />
            <MediaRow title="Top Rated Shows" items={topRatedTV} onItemClick={handleMediaClick} defaultType="tv" />
            <section className="space-y-4">
              <h2 className="text-2xl font-display tracking-wide text-foreground">All Popular TV Shows</h2>
              <MediaGrid items={popularTV} onItemClick={handleMediaClick} defaultType="tv" />
            </section>
          </div>
        );

      case "trending":
        return (
          <div className="container mx-auto px-4 pt-28 pb-12 space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-display tracking-wide text-foreground">Trending This Week</h2>
              <MediaGrid items={trending} onItemClick={handleMediaClick} />
            </section>
          </div>
        );

      default: // home
        return (
          <>
            {featuredMedia && (
              <HeroBanner
                media={featuredMedia}
                onPlayClick={() => handleMediaClick(
                  featuredMedia.id, 
                  featuredMedia.media_type || (featuredMedia.first_air_date ? "tv" : "movie")
                )}
                onInfoClick={() => handleMediaClick(
                  featuredMedia.id, 
                  featuredMedia.media_type || (featuredMedia.first_air_date ? "tv" : "movie")
                )}
              />
            )}
            <div className="container mx-auto px-4 py-12 space-y-12 -mt-20 relative z-10">
              <MediaRow title="Trending Now" items={trending} onItemClick={handleMediaClick} />
              <MediaRow title="Popular Movies" items={popularMovies} onItemClick={handleMediaClick} defaultType="movie" />
              <MediaRow title="Popular TV Shows" items={popularTV} onItemClick={handleMediaClick} defaultType="tv" />
              <MediaRow title="Top Rated Movies" items={topRatedMovies} onItemClick={handleMediaClick} defaultType="movie" />
              <MediaRow title="Top Rated TV" items={topRatedTV} onItemClick={handleMediaClick} defaultType="tv" />
              <MediaRow title="Now Playing in Theaters" items={nowPlaying} onItemClick={handleMediaClick} defaultType="movie" />
              <MediaRow title="Coming Soon" items={upcoming} onItemClick={handleMediaClick} defaultType="movie" />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={setSearchQuery} 
        searchQuery={searchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main>
        {renderContent()}
      </main>

      {/* Media Detail Modal */}
      <MediaModal
        mediaId={selectedMedia?.id ?? null}
        mediaType={selectedMedia?.type ?? null}
        onClose={() => setSelectedMedia(null)}
      />

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>MovieBox - Your Ultimate Streaming Experience</p>
          <p className="mt-2">Data provided by TMDB</p>
        </div>
      </footer>
    </div>
  );
}

