import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/feed/post-card"
import { Calendar, Sparkles } from "lucide-react"

export default async function EventsPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: events } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id (display_name, avatar_url),
      post_likes (user_id)
    `)
    .in("post_type", ["event", "club"])
    .order("event_date", { ascending: true })

  const now = new Date()
  const upcomingEvents = events?.filter((e) => !e.event_date || new Date(e.event_date) >= now) || []
  const pastEvents = events?.filter((e) => e.event_date && new Date(e.event_date) < now) || []

  return (
    <div className="pb-4">
      {/* Featured Section */}
      <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Happening on Campus</h2>
        </div>
        <p className="text-sm text-muted-foreground">Discover events, clubs, and activities at UCSC</p>
      </div>

      {/* Upcoming Events */}
      <div className="divide-y divide-border">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => <PostCard key={event.id} post={event} currentUserId={user?.id} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No upcoming events</h2>
            <p className="text-muted-foreground text-center text-sm">Be the first to share an event!</p>
          </div>
        )}
      </div>
    </div>
  )
}
