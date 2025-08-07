// components/dashComponent/DropOverlay.tsx

"use client"

import React from "react"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropOverlayProps {
  visible: boolean
}

export const DropOverlay: React.FC<DropOverlayProps> = ({ visible }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 bottom-0 z-50 pointer-events-none transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center border-4 border-dashed border-primary bg-muted/60 backdrop-blur-sm pointer-events-none rounded-2xl"
        )}
        style={{
          marginLeft: "calc(var(--sidebar-width))", // excludes sidebar area
        }}
      >
        <div className="flex flex-col items-center text-muted-foreground gap-2">
          <UploadCloud className="w-10 h-10 text-primary" />
          <p className="text-lg font-medium">Drop your files here</p>
        </div>
      </div>
    </div>
  )
}
