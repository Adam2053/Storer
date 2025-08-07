// components/UploadDropzone.tsx

import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadDropzoneProps {
  onFilesUploaded: (files: File[]) => void
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFilesUploaded }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesUploaded(acceptedFiles)
    }
  }, [onFilesUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border border-dashed border-muted-foreground rounded-md px-6 py-10 text-center transition-colors cursor-pointer",
        isDragActive ? "bg-muted/40 border-primary" : "bg-muted/10 hover:bg-muted/20"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <UploadCloud className="w-8 h-8" />
        <p className="text-sm font-medium">Drag & drop files here</p>
        <p className="text-xs text-muted-foreground">or click to browse from your device</p>
      </div>
    </div>
  )
}
