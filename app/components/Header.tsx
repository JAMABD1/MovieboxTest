"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Clapperboard, Search, LogOut, X, Tv, Film, TrendingUp, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type TabType = "home" | "movies" | "tv" | "trending";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Header({ onSearch, searchQuery, activeTab, onTabChange }: HeaderProps) {
  const { data: session } = useSession();
  const [showSearch, setShowSearch] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
    { id: "movies", label: "Movies", icon: <Film className="h-4 w-4" /> },
    { id: "tv", label: "TV Shows", icon: <Tv className="h-4 w-4" /> },
    { id: "trending", label: "Trending", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/95 to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button 
            type="button"
            className="flex items-center gap-2 group" 
            onClick={() => onTabChange("home")}
          >
            <div className="relative">
              <Clapperboard className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-2xl font-display tracking-wider">
              <span className="text-primary">MOVIE</span>
              <span className="text-white">BOX</span>
            </h1>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="gap-2"
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </nav>

          {/* Search and actions */}
          <div className="flex items-center gap-3">
            {showSearch ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <Input
                  type="text"
                  placeholder="Search movies & TV..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-64 bg-secondary/80 border-border"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSearch(false);
                    onSearch("");
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            {/* Auth actions */}
            <div className="flex items-center gap-2">
              {session?.user && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-foreground">
                    {session.user.name || session.user.email}
                  </span>
                </div>
              )}

              {session ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="px-4"
                >
                  Login / Sign up
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center gap-1 mt-3 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className="gap-2 flex-shrink-0"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}

