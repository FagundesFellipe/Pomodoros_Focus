"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GitFork, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  const handleSignIn = async (provider: "google" | "github") => {
    setLoading(provider);
    setError(null);
    try {
      await signIn.social({ provider, callbackURL: "/" });
    } catch {
      setError("Failed to sign in. Please try again.");
      setLoading(null);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in to Pomodoro Focus</CardTitle>
          <CardDescription>
            Choose a provider to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full"
            disabled={loading !== null}
            onClick={() => handleSignIn("google")}
          >
            <LogIn className="mr-2 h-4 w-4" />
            {loading === "google" ? "Redirecting…" : "Continue with Google"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={loading !== null}
            onClick={() => handleSignIn("github")}
          >
            <GitFork className="mr-2 h-4 w-4" />
            {loading === "github" ? "Redirecting…" : "Continue with GitHub"}
          </Button>
          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
