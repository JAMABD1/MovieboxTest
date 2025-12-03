const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export type MediaType = "movie" | "tv";

export interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  tagline?: string;
  media_type?: MediaType;
}

export interface MediaVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface TMDBResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

// Images & basic helpers
export const getImageUrl = (
  path: string | null,
  size: "w300" | "w500" | "w780" | "original" = "w500"
) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getMediaTitle = (media: Media): string => {
  return media.title || media.name || "Unknown";
};

export const getMediaYear = (media: Media): string => {
  const date = media.release_date || media.first_air_date;
  return date ? new Date(date).getFullYear().toString() : "";
};

// Generic TMDB fetcher – server-side only
const tmdbFetch = async <T = any>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  init?: RequestInit
): Promise<T> => {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY environment variable is not set");
  }

  const searchParams = new URLSearchParams();
  searchParams.set("api_key", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const url = `${TMDB_BASE_URL}${path}?${searchParams.toString()}`;

  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Trending
export const fetchTrending = async (
  timeWindow: "day" | "week" = "week"
): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>(`/trending/all/${timeWindow}`);
};

// Movies
export const fetchPopularMovies = async (page = 1): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/movie/popular", { page });
};

export const fetchTopRatedMovies = async (page = 1): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/movie/top_rated", { page });
};

export const fetchNowPlayingMovies = async (page = 1): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/movie/now_playing", { page });
};

export const fetchUpcomingMovies = async (page = 1): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/movie/upcoming", { page });
};

// TV Shows
export const fetchPopularTV = async (page = 1): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/tv/popular", { page });
};

export const fetchTopRatedTV = async (page = 1): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/tv/top_rated", { page });
};

export const fetchOnTheAirTV = async (page = 1): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/tv/on_the_air", { page });
};

// Details
export const fetchMovieDetails = async (movieId: number): Promise<Media> => {
  return tmdbFetch<Media>(`/movie/${movieId}`);
};

export const fetchTVDetails = async (tvId: number): Promise<Media> => {
  return tmdbFetch<Media>(`/tv/${tvId}`);
};

// Videos
interface TMDBVideosResponse {
  id: number;
  results: MediaVideo[];
}

export const fetchMovieVideos = async (movieId: number): Promise<MediaVideo[]> => {
  const data = await tmdbFetch<TMDBVideosResponse>(`/movie/${movieId}/videos`);
  return data.results;
};

export const fetchTVVideos = async (tvId: number): Promise<MediaVideo[]> => {
  const data = await tmdbFetch<TMDBVideosResponse>(`/tv/${tvId}/videos`);
  return data.results;
};

// Search
export const searchMulti = async (query: string): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/search/multi", { query });
};

// Genres
export const fetchMovieGenres = async () => {
  return tmdbFetch("/genre/movie/list");
};

export const fetchTVGenres = async () => {
  return tmdbFetch("/genre/tv/list");
};

// Discover
export type DiscoverOptions = Record<string, string | number | boolean | undefined>;

export const discoverMovies = async (
  options: DiscoverOptions = {}
): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/discover/movie", options);
};

export const discoverTV = async (
  options: DiscoverOptions = {}
): Promise<TMDBResponse<Media>> => {
  return tmdbFetch<TMDBResponse<Media>>("/discover/tv", options);
};

// Account
export interface AccountDetails {
  id: number;
  name: string | null;
  username: string;
}

export const getAccountDetails = async (sessionId: string): Promise<AccountDetails> => {
  return tmdbFetch<AccountDetails>("/account", { session_id: sessionId });
};

export const getFavoriteMovies = async (
  sessionId: string,
  page = 1
): Promise<TMDBResponse<Media>> => {
  const account = await getAccountDetails(sessionId);
  return tmdbFetch<TMDBResponse<Media>>(
    `/account/${account.id}/favorite/movies`,
    { session_id: sessionId, page }
  );
};

export const getFavoriteTV = async (
  sessionId: string,
  page = 1
): Promise<TMDBResponse<Media>> => {
  const account = await getAccountDetails(sessionId);
  return tmdbFetch<TMDBResponse<Media>>(
    `/account/${account.id}/favorite/tv`,
    { session_id: sessionId, page }
  );
};

export const getWatchlistMovies = async (
  sessionId: string,
  page = 1
): Promise<TMDBResponse<Media>> => {
  const account = await getAccountDetails(sessionId);
  return tmdbFetch<TMDBResponse<Media>>(
    `/account/${account.id}/watchlist/movies`,
    { session_id: sessionId, page }
  );
};

export const getWatchlistTV = async (
  sessionId: string,
  page = 1
): Promise<TMDBResponse<Media>> => {
  const account = await getAccountDetails(sessionId);
  return tmdbFetch<TMDBResponse<Media>>(
    `/account/${account.id}/watchlist/tv`,
    { session_id: sessionId, page }
  );
};

interface MarkAsFavoritePayload {
  media_type: MediaType;
  media_id: number;
  favorite: boolean;
}

export const markAsFavorite = async (
  sessionId: string,
  payload: MarkAsFavoritePayload
) => {
  const account = await getAccountDetails(sessionId);
  return tmdbFetch(`/account/${account.id}/favorite`, { session_id: sessionId }, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

interface WatchlistPayload {
  media_type: MediaType;
  media_id: number;
  watchlist: boolean;
}

export const addToWatchlist = async (
  sessionId: string,
  payload: WatchlistPayload
) => {
  const account = await getAccountDetails(sessionId);
  return tmdbFetch(`/account/${account.id}/watchlist`, { session_id: sessionId }, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const rateMedia = async (
  sessionId: string,
  mediaType: MediaType,
  id: number,
  rating: number
) => {
  return tmdbFetch(
    `/${mediaType}/${id}/rating`,
    { session_id: sessionId },
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: rating }),
    }
  );
};

// People
export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  known_for_department?: string;
}

export const fetchPersonDetails = async (personId: number): Promise<PersonDetails> => {
  return tmdbFetch<PersonDetails>(`/person/${personId}`);
};

export const fetchPersonCombinedCredits = async (personId: number) => {
  return tmdbFetch(`/person/${personId}/combined_credits`);
};

// Companies & Networks
export const fetchCompanyDetails = async (companyId: number) => {
  return tmdbFetch(`/company/${companyId}`);
};

export const fetchNetworkDetails = async (networkId: number) => {
  return tmdbFetch(`/network/${networkId}`);
};

// Lists
export const fetchList = async (listId: number) => {
  return tmdbFetch(`/list/${listId}`);
};

export const createList = async (
  sessionId: string,
  payload: { name: string; description?: string; language?: string }
) => {
  return tmdbFetch(
    "/list",
    { session_id: sessionId },
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
};

export const addToList = async (
  sessionId: string,
  listId: number,
  mediaId: number
) => {
  return tmdbFetch(
    `/list/${listId}/add_item`,
    { session_id: sessionId },
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media_id: mediaId }),
    }
  );
};

export const removeFromList = async (
  sessionId: string,
  listId: number,
  mediaId: number
) => {
  return tmdbFetch(
    `/list/${listId}/remove_item`,
    { session_id: sessionId },
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media_id: mediaId }),
    }
  );
};

// Watch providers
export const fetchWatchProvidersForMovie = async (movieId: number) => {
  return tmdbFetch(`/movie/${movieId}/watch/providers`);
};

export const fetchWatchProvidersForTV = async (tvId: number) => {
  return tmdbFetch(`/tv/${tvId}/watch/providers`);
};


