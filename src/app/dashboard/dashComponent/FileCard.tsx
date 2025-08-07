// components/FileCard.tsx

import React from "react"
import { MoreVertical, FileText, ImageIcon, Trash2, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface FileCardProps {
  fileName: string
  fileSize: string
  fileType?: string
  onDownload?: () => void
  onDelete?: () => void
  selectable?: boolean
  selected?: boolean
  onSelectChange?: (selected: boolean) => void
}

export const FileCard: React.FC<FileCardProps> = ({
  fileName,
  fileSize,
  fileType,
  onDownload,
  onDelete,
  selectable = false,
  selected = false,
  onSelectChange,
}) => {
  const getFileIcon = () => {
    if (fileType?.startsWith("image")) return <ImageIcon className="h-8 w-8" />
    return <FileText className="h-8 w-8" />
  }

  return (
    <Card className="relative group w-full max-w-[180px] cursor-pointer border hover:shadow-md transition">
      {selectable && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectChange?.(!!checked)}
          />
        </div>
      )}

      <CardContent className="flex flex-col items-center text-center py-6 px-4 space-y-2">
        <div className="text-muted-foreground">{getFileIcon()}</div>
        <div className="w-full truncate text-sm font-medium">{fileName}</div>
        <div className="text-xs text-muted-foreground">{fileSize}</div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={onDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
