"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { ResultCard } from "@/components/result-card"
import { LiveFeed } from "@/components/live-feed"
import { DetailDrawer } from "@/components/detail-drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { searchNews, type NewsEntry } from "@/lib/api"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function Dashboard() {
  const [searchResults, setSearchResults] = useState<NewsEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<NewsEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [selectedTags, setSelectedTags] = useState<string[]>([]) // <-- Add this


  const handleSearch = async (query: string) => {

    setIsLoading(true)
    setSearchQuery(query)
    try {
      const response = await searchNews(query, selectedTags);
      setSearchResults(response.results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = (entry: NewsEntry) => {
    setSelectedEntry(entry)
  }

  const handleCloseDrawer = () => {
    setSelectedEntry(null)
  }

  return (
    <motion.section
      id="dashboard"
      className="min-h-screen bg-background/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 py-8">
        <motion.div
          className="flex gap-6 h-[calc(100vh-4rem)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Sidebar */}
          <motion.div variants={itemVariants}>
          <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              selectedTags={selectedTags} // <-- Pass selectedTags
              setSelectedTags={setSelectedTags} // <-- Pass setter
            />
          </motion.div>

          {/* Main Content Area */}
          <motion.div className="flex-1 flex flex-col gap-6 min-w-0" variants={itemVariants}>
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {searchQuery && searchResults.length > 0 && (
    <div className="text-sm text-muted-foreground mb-2">
      Showing {searchResults.length} result{searchResults.length > 1 ? "s" : ""} for "<span className="font-semibold">{searchQuery}</span>"
    </div>
  )}

            {/* Results Grid */}
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div key={i} className="glass rounded-lg p-6" variants={itemVariants}>
                      <Skeleton className="h-48 w-full mb-4 rounded-md" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : searchResults.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {searchResults.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ResultCard entry={entry} onClick={() => handleCardClick(entry)} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : searchQuery ? (
                <motion.div
                  className="flex items-center justify-center h-64"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-2">No results found</p>
                    <p className="text-sm text-muted-foreground">Try searching for something else</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center h-64"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-2">Start exploring news</p>
                    <p className="text-sm text-muted-foreground">Use the search bar above to find articles</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Sidebar - Live Feed */}
          <motion.div variants={itemVariants}>
            <LiveFeed />
          </motion.div>
        </motion.div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer entry={selectedEntry} onClose={handleCloseDrawer} />
    </motion.section>
  )
}
