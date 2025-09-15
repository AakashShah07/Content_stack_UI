"use client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Clock, Plus, Edit, Eye } from "lucide-react"
import { getWebhookFeed, type WebhookEvent } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

const eventIcons = {
  create: Plus,
  update: Edit,
  publish: Eye,
}

const eventColors = {
  create: "text-green-400",
  update: "text-blue-400",
  publish: "text-purple-400",
}

export function LiveFeed() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const webhookEvents = await getWebhookFeed()
        setEvents(webhookEvents)
      } catch (error) {
        console.error("Failed to fetch webhook events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()

    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchEvents, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-80 glass rounded-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          <h2 className="font-semibold text-lg">Live Webhook Feed</h2>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto" />
        </div>
      </div>

      {/* Feed Content */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-strong rounded-lg p-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => {
              const Icon = eventIcons[event.eventType]
              const colorClass = eventColors[event.eventType]

              return (
                <div
                  key={event.id}
                  className="glass-strong rounded-lg p-3 hover:neon-glow transition-all duration-300 animate-in fade-in slide-in-from-top-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5", colorClass)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={cn("text-xs capitalize", colorClass, "border-current")}>
                          {event.eventType}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate" title={event.entryTitle}>
                        {event.entryTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {event.entryId}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-glass-border">
        <p className="text-xs text-muted-foreground text-center">Auto-refreshing every 3 seconds</p>
      </div>
    </div>
  )
}
