// components/storage-usage-bar.tsx
"use client"

import { Progress } from "@/components/ui/progress"

export function StorageUsageBar({
  usedGB = 0,
  totalGB = 5,
}: {
  usedGB: number
  totalGB?: number
}) {
  const usedPercent = Math.min((usedGB / totalGB) * 100, 100)

  return (
    <div className="px-4 py-3 space-y-1 text-sm text-muted-foreground">
      <div className="flex justify-between items-center">
        <span>Storage</span>
        <span>
          {usedGB.toFixed(2)} GB / {totalGB} GB
        </span>
      </div>
      <Progress value={usedPercent} className="h-2" />
    </div>
  )
}
