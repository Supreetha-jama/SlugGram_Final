import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/feed/post-card"

export default async function FeedPage() {
  const supabase = await getSupabaseServerClient()

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id (display_name, avatar_url),
      post_likes (user_id)
    `)
    .order("created_at", { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="pb-4">
      {/* Stories/Quick Actions Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex gap-3 p-3 overflow-x-auto scrollbar-hide">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl">
              S
            </div>
            <span className="text-[10px] text-muted-foreground">All</span>
          </div>
          {["Events", "Clubs", "Study", "General"].map((type) => (
            <div key={type} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-border bg-muted flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">{type.slice(0, 2)}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-border">
        {posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} currentUserId={user?.id} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <span className="text-4xl">🐌</span>
            </div>
            <h2 className="text-lg font-semibold mb-1">No posts yet</h2>
            <p className="text-muted-foreground text-center text-sm">Be the first to share with the UCSC community!</p>
          </div>
        )}
      </div>
    </div>
  )
}
