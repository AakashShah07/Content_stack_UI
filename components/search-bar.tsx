"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

const sampleQueries = [
  "Bitcoin",
  "AI Technology",
  "Climate Change",
  "Healthcare",
  "Politics",
  "Cryptocurrency",
  "Science",
]

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false);

   // 👉 new state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);


    const API_ENDPOINT = process.env.ENDPOINT || "http://localhost:3000";

  // Cycle through placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % sampleQueries.length)
    }, 2000)

    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
      if (!query.trim() || isSearching) {
    setSuggestions([]);
    return;
  }
    const handler = setTimeout(async () => {
      setLoadingSuggest(true);
      try {
        const res = await fetch(
          `http://localhost:3000/advanced-suggestions?q=${encodeURIComponent(query)}`
        );
        const data: string[] = await res.json();
        setSuggestions(data);
      } catch (e) {
        console.error("suggestion error", e);
      } finally {
        setLoadingSuggest(false);
      }
    }, 300); // 300 ms debounce
    return () => clearTimeout(handler);
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    await onSearch(query.trim())
    setIsSearching(false)
    setSuggestions([]);

    console.log("Search submitted:", query.trim());

  }

  const handleQuickSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    setIsSearching(true)
    await onSearch(searchQuery)
    setIsSearching(false)
    console.log("Quick submitted:", searchQuery);
    setSuggestions([]);
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
        <div className="relative glass rounded-full p-2 neon-glow">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search for ${sampleQueries[placeholderIndex]}...`}
            className="pl-12 pr-16 py-3 text-lg bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full px-6"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </form>

      {/* 👉 Live suggestions dropdown */}
      {query && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1
                 bg-white dark:bg-neutral-800
                 border border-neutral-200 dark:border-neutral-700
                 rounded-xl shadow-xl
                 max-h-60 overflow-y-auto
                 w-full z-50">
          {loadingSuggest && (
            <li className="px-4 py-2 text-sm text-muted-foreground">
              Loading…
            </li>
          )}
          {suggestions.map((s) => (
            <li
              key={s}
              onClick={() => handleQuickSearch(s)}
              className="px-4 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {/* Quick Search Suggestions */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Quick search:</span>
        {sampleQueries.slice(0, 4).map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => handleQuickSearch(suggestion)}
            className="glass hover:neon-glow transition-all duration-200 hover:scale-105"
            disabled={isSearching}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
