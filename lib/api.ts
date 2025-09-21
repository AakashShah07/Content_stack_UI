// API utilities for News Intelligence Hub

export interface NewsEntry {
  id: string
  title: string
  description: string
  content: string
  author: string
  publishedAt: string
  imageUrl?: string
  tags: string[]
  url?: string
  category?: string
}

export interface WebhookEvent {
  id: string
  timestamp: string
  eventType: "create" | "update" | "publish"
  entryTitle: string
  entryId: string
}

export interface SearchResponse {
  results: NewsEntry[]
  total: number
  query: string
}



const mockWebhookEvents: WebhookEvent[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    eventType: "create",
    entryTitle: "Breaking: New Space Mission Announced",
    entryId: "space-001",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    eventType: "update",
    entryTitle: "AI Revolution in Healthcare Updated",
    entryId: "1",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    eventType: "publish",
    entryTitle: "Tech Giants Report Q4 Earnings",
    entryId: "tech-001",
  },
]

// API utilities for News Intelligence Hub

export async function searchNews(query: string): Promise<SearchResponse> {
  // Call your running backend (adjust base URL if different)
  const res = await fetch("http://localhost:3000/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Search request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  // data.fetchedEntries is what your backend sends

  const results: NewsEntry[] = data.fetchedEntries.map((item: any) => ({
    id: item._id,
    title: item.title,
    description: item.description,
    content: item.content,
    author: item.author ?? "",
    publishedAt: item.publishedAt,
    imageUrl: item.imageUrl ?? "",
    tags: [],            // backend doesn’t send tags, leave empty or derive
    url: item.url.href,             // backend doesn’t send a link; map if you add it
  }));

  return {
    results,
    total: results.length,
    query,
  };
}


export async function getWebhookFeed(): Promise<WebhookEvent[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Add some randomness to simulate live updates
  const randomEvents = [...mockWebhookEvents]
  if (Math.random() > 0.7) {
    randomEvents.unshift({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      eventType: ["create", "update", "publish"][Math.floor(Math.random() * 3)] as any,
      entryTitle: "Live Update: " + ["Market Analysis", "Tech News", "Breaking Story"][Math.floor(Math.random() * 3)],
      entryId: "live-" + Date.now(),
    })
  }

  return randomEvents.slice(0, 10)
}
