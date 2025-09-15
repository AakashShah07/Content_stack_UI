"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { X, ExternalLink, Heart, Share2, Calendar, User, Clock } from "lucide-react"
import type { NewsEntry } from "@/lib/api"
import { formatDistanceToNow, format } from "date-fns"
import Image from "next/image"
import { useState } from "react"

interface DetailDrawerProps {
  entry: NewsEntry | null
  onClose: () => void
}

export function DetailDrawer({ entry, onClose }: DetailDrawerProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!entry) return null

  const handleShare = async () => {
    if (navigator.share && entry.url) {
      try {
        await navigator.share({
          title: entry.title,
          text: entry.description,
          url: entry.url,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(entry.url || window.location.href)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(entry.url || window.location.href)
    }
  }

  const handleExternalLink = () => {
    if (entry.url) {
      window.open(entry.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Drawer open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[90vh] glass-strong border-glass-border">
        <DrawerHeader className="border-b border-glass-border">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold text-left">Article Details</DrawerTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorited(!isFavorited)}
                className="hover:neon-glow"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} className="hover:neon-glow">
                <Share2 className="w-5 h-5" />
              </Button>
              {entry.url && (
                <Button variant="ghost" size="icon" onClick={handleExternalLink} className="hover:neon-glow">
                  <ExternalLink className="w-5 h-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:neon-glow">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Hero Image */}
            {!imageError && entry.imageUrl && (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={entry.imageUrl || "/placeholder.svg"}
                  alt={entry.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="glass neon-glow">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {entry.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{entry.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(entry.publishedAt), "MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(entry.publishedAt), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-lg p-4">
              <p className="text-lg text-muted-foreground leading-relaxed">{entry.description}</p>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-foreground leading-relaxed space-y-4">
                {entry.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-base leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-glass-border">
              <Button
                onClick={() => setIsFavorited(!isFavorited)}
                variant={isFavorited ? "default" : "outline"}
                className={
                  isFavorited ? "bg-gradient-to-r from-red-600 to-pink-600 neon-glow" : "glass hover:neon-glow"
                }
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                {isFavorited ? "Saved" : "Save Article"}
              </Button>
              <Button onClick={handleShare} variant="outline" className="glass hover:neon-glow bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {entry.url && (
                <Button onClick={handleExternalLink} variant="outline" className="glass hover:neon-glow bg-transparent">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Original
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
