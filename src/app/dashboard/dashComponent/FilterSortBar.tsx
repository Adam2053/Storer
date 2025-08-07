// components/dashboard/FilterSortBar.tsx

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, List, Funnel } from "lucide-react";


interface FilterSortBarProps {
  viewMode: "grid" | "list"
  onViewChange: (mode: "grid" | "list") => void
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
  onFilterChange?: (value: string) => void
}

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  viewMode,
  onViewChange,
  onSearchChange,
  onSortChange,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4 lg:px-6 py-2">
      {/* Search Input */}
      <Input
        placeholder="Search files..."
        className="max-w-xs"
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort */}
        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="size">Size</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter */}
        {onFilterChange && (
          <Select onValueChange={onFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="images">Images</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="pdfs">PDFs</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* View toggle */}
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => onViewChange("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => onViewChange("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
