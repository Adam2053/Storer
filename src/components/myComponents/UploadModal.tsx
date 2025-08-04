// components/upload-modal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, Pause, Play, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UploadModal({
  open,
  file,
  onClose,
}: {
  open: boolean;
  file: File | null;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [path, setPath] = useState("Home");

  useEffect(() => {
    if (open && file && !paused) {
      const id = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(id);
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [open, file, paused]);

  const handlePauseResume = () => {
    setPaused((prev) => !prev);
    if (paused && intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleCancel = () => {
    setProgress(0);
    if (intervalId) clearInterval(intervalId);
    onClose();
  };

  useEffect(() => {
    if (file) {
      setProgress(0);
      setPaused(false);
      setPath("Home");
    }
  }, [file]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md sm:rounded-lg border p-6 shadow-xl transition ease-in-out duration-200
  data-[state=open]:animate-in data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
  data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
"
      >
        <DialogHeader>
          <DialogTitle>Uploading File</DialogTitle>
        </DialogHeader>

        {file && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{file.name}</span>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            <Progress value={progress} className="h-2" />

            <div className="flex items-center justify-between gap-2">
              {progress < 100 ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePauseResume}
                    className="flex items-center gap-1"
                  >
                    {paused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    {paused ? "Resume" : "Pause"}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      // Finalize upload (you can push to server/db here)
                      console.log("Saved to:", path);
                      onClose();
                    }}
                    className="flex items-center gap-1"
                  >
                    <Save /> Save
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      console.log("Upload deleted");
                      onClose();
                    }}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>

            <div className="space-y-1">
              <Label>Select Path</Label>
              <Select value={path} onValueChange={setPath}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Projects">Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
