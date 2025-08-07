// components/SearchBar.tsx

import React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  query: string
  onChange: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, onChange }) => {
  return (
    <div className="relative w-full px-4 lg:px-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search files and folders..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-10 text-sm bg-background border border-border"
        />
      </div>
    </div>
  )
}
