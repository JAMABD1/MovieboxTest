"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Clapperboard } from "lucide-react";

export function LoginPrompt() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Clapperboard className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-5xl font-display tracking-wider">
            <span className="text-primary">MOVIE</span>
            <span className="text-white">BOX</span>
          </h1>
          <p className="text-muted-foreground">
            Your ultimate streaming destination for movies and TV shows
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 card-shadow border border-border">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                Sign in to continue
              </h2>
              <p className="text-sm text-muted-foreground">
                Please sign in with your Google account to access MovieBox
              </p>
            </div>
            
            <Button 
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full"
              size="lg"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

