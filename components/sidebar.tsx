"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Home, Filter, Bookmark, ChevronLeft, ChevronRight, CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  selectedTags: string[] // <-- Add this
  setSelectedTags: (tags: string[]) => void // <-- Add this
}

const availableTags = ["Business",
  "Entertainment",
  "General",
  "Health",
  "Science",
  "Sports",
  "Technology",]

export function Sidebar({ collapsed, onToggleCollapse, selectedTags, setSelectedTags }: SidebarProps) {
  // const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setDateRange({})
  }

  return (
    <motion.div
      className="glass rounded-lg flex flex-col"
      animate={{ width: collapsed ? 64 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-glass-border flex items-center justify-between">
        <AnimatePresence>
          {!collapsed && (
            <motion.h2
              className="font-semibold text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              Filters
            </motion.h2>
          )}
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="hover:neon-glow">
            <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>

   

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* Tags Filter */}
            <div className="p-4 border-t border-glass-border flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Tags
                </h3>
                {(selectedTags.length > 0 || dateRange.from) && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs hover:neon-glow">
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </motion.div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        selectedTags.includes(tag)
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 neon-glow"
                          : "glass hover:neon-glow",
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedTags.length > 0 || dateRange.from) && (
              <motion.div
                className="p-4 border-t border-glass-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Active Filters</h4>
                <div className="space-y-1 text-xs">
                  {selectedTags.length > 0 && <div className="text-blue-400">Tags: {selectedTags.join(", ")}</div>}
                  {dateRange.from && (
                    <div className="text-purple-400">
                      Date: {format(dateRange.from, "MMM dd")}
                      {dateRange.to && ` - ${format(dateRange.to, "MMM dd")}`}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
