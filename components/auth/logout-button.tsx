"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

interface LogoutButtonProps {
  isTimerActive?: boolean;
  className?: string;
}

export function LogoutButton({ isTimerActive = false, className }: LogoutButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    if (isTimerActive) {
      const confirmed = window.confirm(
        "You have an active Pomodoro session. Logging out will end your current session. Are you sure?"
      );
      if (!confirmed) return;
    }

    setIsPending(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
