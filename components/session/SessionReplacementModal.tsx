"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SessionReplacementModalProps {
  open: boolean;
  /** Title of the block the active session is currently on, for context. */
  activeBlockTitle: string;
  /** Keep the current session and cancel the new start (default action). */
  onKeepCurrent: () => void;
  /** Discard the active session and start the new one. */
  onStartNew: () => void;
}

/**
 * Confirmation shown when a session is already in progress and the user tries
 * to start a new one. "Keep Current" is the safe default; "Start New" discards
 * the in-progress session (section 10.8.2).
 */
export default function SessionReplacementModal({
  open,
  activeBlockTitle,
  onKeepCurrent,
  onStartNew,
}: SessionReplacementModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onKeepCurrent()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session already active</DialogTitle>
          <DialogDescription>
            A session is already in progress (block &ldquo;{activeBlockTitle}
            &rdquo;). Starting a new session will discard its progress. Continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" autoFocus onClick={onKeepCurrent}>
            Keep Current
          </Button>
          <Button variant="destructive" onClick={onStartNew}>
            Start New
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
