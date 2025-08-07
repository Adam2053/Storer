import React from "react"
import {
  MoreVertical,
  FileText,
  Folder,
  Download,
  Pencil,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  type: string
  size?: string
}

interface FileGridProps {
  items: FileItem[]
  viewMode: "grid" | "list"
}

export const FileGrid: React.FC<FileGridProps> = ({ items, viewMode }) => {
  const renderActions = (item: FileItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="w-4 h-4 mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 hover:text-red-700">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (viewMode === "list") {
    return (
      <div className="w-full border rounded-md overflow-hidden h-full flex flex-col">
        <div className="grid grid-cols-12 p-2 bg-muted font-medium text-sm sticky top-0 z-10 border-b">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-3">Size</div>
          <div className="col-span-2 text-right pr-4">Actions</div>
        </div>
        <div className="overflow-y-auto flex-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center p-3 border-t hover:bg-muted/30"
            >
              <div className="col-span-5 flex items-center gap-2 truncate">
                {item.type === "folder" ? (
                  <Folder className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <span className="truncate">{item.name}</span>
              </div>
              <div className="col-span-2 capitalize">{item.type}</div>
              <div className="col-span-3">{item.size ?? "--"}</div>
              <div className="col-span-2 flex justify-end">{renderActions(item)}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // GRID VIEW
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto h-full pr-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative p-4 border rounded-lg bg-muted/20 hover:shadow-sm transition-all"
        >
          <div className="absolute top-2 right-2">{renderActions(item)}</div>
          <div className="flex flex-col items-center justify-center gap-3 mt-4">
            {item.type === "folder" ? (
              <Folder className="w-8 h-8" />
            ) : (
              <FileText className="w-8 h-8" />
            )}
            <div className="text-sm font-medium text-center">{item.name}</div>
            {item.size && (
              <div className="text-xs text-muted-foreground">{item.size}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
