import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function range(start: number, end: number) {
  const res: number[] = []
  for (let i = start; i <= end; i++) res.push(i)
  return res
}

function getPageItems(page: number, totalPages: number) {
  if (totalPages <= 7) return range(1, totalPages).map((p) => ({ type: "page" as const, page: p }))

  const items: Array<
    | { type: "page"; page: number }
    | { type: "ellipsis"; key: string }
  > = []

  const showLeftEllipsis = page > 4
  const showRightEllipsis = page < totalPages - 3

  items.push({ type: "page", page: 1 })

  if (showLeftEllipsis) items.push({ type: "ellipsis", key: "left" })

  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  for (const p of range(start, end)) items.push({ type: "page", page: p })

  if (showRightEllipsis) items.push({ type: "ellipsis", key: "right" })

  items.push({ type: "page", page: totalPages })
  return items
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}) {
  const safeTotal = Math.max(1, totalPages)
  const safePage = Math.min(Math.max(1, page), safeTotal)
  const items = getPageItems(safePage, safeTotal)

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="text-xs text-zinc-500 font-medium">
        Page <span className="text-zinc-200">{safePage}</span> of{" "}
        <span className="text-zinc-200">{safeTotal}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage <= 1}
          className="text-zinc-300 hover:text-white hover:bg-white/5 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {items.map((it) => {
          if (it.type === "ellipsis") {
            return (
              <div
                key={it.key}
                className="w-8 h-7 inline-flex items-center justify-center text-zinc-500"
                aria-hidden="true"
              >
                <MoreHorizontal className="w-4 h-4" />
              </div>
            )
          }

          const isActive = it.page === safePage
          return (
            <Button
              key={it.page}
              type="button"
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(it.page)}
              className={cn(
                "h-7 px-2.5 rounded-lg text-xs font-semibold",
                isActive
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "text-zinc-300 hover:text-white hover:bg-white/5"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {it.page}
            </Button>
          )
        })}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(Math.min(safeTotal, safePage + 1))}
          disabled={safePage >= safeTotal}
          className="text-zinc-300 hover:text-white hover:bg-white/5 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

