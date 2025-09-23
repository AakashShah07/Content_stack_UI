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
  category?: string
  entryTitle: string
  entryId: string
}

export interface SearchResponse {
  results: NewsEntry[]
  total: number
  query: string
}


// API utilities for News Intelligence Hub

export async function searchNews(query: string, category:string[]): Promise<SearchResponse> {
  
  const res = await fetch("http://localhost:3000/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  console.log("Category in API:", category); // <-- Add this
  if (!res.ok) {
    throw new Error(`Search request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  // data.fetchedEntries is what your backend sends

  let results: NewsEntry[] = data.fetchedEntries
    .filter((item: any) => item.score >= 0.6)
    .map((item: any) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      content: item.content,
      author: item.author ?? "",
      publishedAt: item.publishedAt,
      imageUrl: item.imageUrl ?? "",
      tags: [], // backend doesn’t send tags, leave empty or derive
      url: item.url?.href || item.url,
      category: item.category,
    }));

  // Filter by category if any are selected
   if (category.length > 0) {
  // normalize the input category array once
  const lowerCats = category.map(c => c.toLowerCase());

  results = results.filter(entry =>
    entry.category &&
    lowerCats.includes(entry.category.toLowerCase())
  );
}


  console.log(`Search for "${query}" returned ${results.length} results after filtering.`);
results.map((entry, idx) => {
  console.log(`Result #${idx + 1}:`, entry);
});

  return {
    results,
    total: results.length,
    query,
  };
}

export interface WebhookFeedResponse {
  events: WebhookEvent[];
  entries: NewsEntry[];
}

export async function getWebhookFeed(): Promise<WebhookFeedResponse> {{
  try {
    const res = await fetch("http://localhost:3000/latest-entries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch latest entries: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error("Invalid response from latest-entries endpoint");
    }

    const entries: NewsEntry[] = data.data.map((entry: any, index: number) => ({
      id: entry._id ?? index.toString(),
      title: entry.title ?? "Untitled",
      description: entry.description ?? "",
      content: entry.content ?? "",
      author: entry.author ?? "",
      publishedAt: entry.created_at ?? new Date().toISOString(),
      imageUrl: entry.imageUrl ?? "",
      tags: entry.tags ?? [],
      url: entry.url?.href || entry.url,
      category: entry.category,
    }));

    // Map the latest entries to WebhookEvent format
    const events: WebhookEvent[] = data.data.map((entry: any, index: number) => ({
      id: entry._id ?? index.toString(),
      timestamp: entry.created_at ?? new Date().toISOString(),
      eventType: "create", 
      category: entry.category,
      entryTitle: entry.title ?? "Untitled",
  entryId: entry._id ?? index.toString(), // <-- always use _id to match NewsEntry.id
    }));

    
    if (Math.random() > 0.7) {
      events.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        eventType: ["create", "update", "publish"][Math.floor(Math.random() * 3)] as any,
        entryTitle: "Live Update: " + ["Market Analysis", "Tech News", "Breaking Story"][Math.floor(Math.random() * 3)],
        entryId: "live-" + Date.now(),
      });
    }

    // Return latest 10 events
    return {events, entries};

  } catch (error) {
    console.error("Error fetching latest entries:", error);
    return { events: [], entries: [] };
  }
}}

