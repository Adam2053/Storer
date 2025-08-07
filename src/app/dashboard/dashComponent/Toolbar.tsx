// components/Toolbar.tsx

import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Upload, SortAsc, ChevronDown } from "lucide-react"

interface ToolbarProps {
  onNewFolder: () => void
  onNewFile: () => void
  onUpload: (files: FileList) => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onNewFolder,
  onNewFile,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onUpload(event.target.files)
    }
  }

  return (
    <div className="flex items-center justify-between px-4 lg:px-6 py-2 border-b bg-background sticky top-[var(--header-height)] z-20">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Plus className="w-4 h-4" />
              New
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onNewFolder}>📁 New Folder</DropdownMenuItem>
            <DropdownMenuItem onClick={onNewFile}>📄 New File</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="gap-1" onClick={handleFileUploadClick}>
          <Upload className="w-4 h-4" />
          Upload
        </Button>
        {/* Hidden file input for upload */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
      </div>

      {/* Right Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-1">
            <SortAsc className="w-4 h-4" />
            Sort
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Name</DropdownMenuItem>
          <DropdownMenuItem>Date Modified</DropdownMenuItem>
          <DropdownMenuItem>Type</DropdownMenuItem>
          <DropdownMenuItem>Size</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
