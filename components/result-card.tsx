"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NewsEntry } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

interface ResultCardProps {
  entry: NewsEntry
  onClick: () => void
}

export function ResultCard({ entry, onClick }: ResultCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (entry.url) {
      window.open(entry.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card
      className="glass hover:neon-glow cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 group overflow-hidden"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError && entry.imageUrl ? (
          <Image
            src={entry.imageUrl || "/placeholder.svg"}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
            <div className="text-4xl font-bold text-muted-foreground/30">{entry.title.charAt(0).toUpperCase()}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 glass-strong"
            onClick={handleFavoriteClick}
            title="Save to favorites"
          >
            <Heart className={cn("w-4 h-4", isFavorited && "fill-red-500 text-red-500")} />
          </Button>
          {entry.url && (
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 glass-strong"
              onClick={handleExternalClick}
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {entry.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs glass">
              {tag}
            </Badge>
          ))}
          {entry.tags.length > 3 && (
            <Badge variant="outline" className="text-xs glass">
              +{entry.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
          {entry.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{entry.description}</p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{entry.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(entry.publishedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
