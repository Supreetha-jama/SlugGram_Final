import { getSupabaseServerClient } from "@/lib/supabase/server"
import { CalendarView } from "@/components/calendar/calendar-view"

export default async function CalendarPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: calendarEvents } = await supabase
    .from("user_calendar")
    .select(`
      *,
      posts:post_id (
        id,
        content,
        post_type,
        event_date,
        event_location,
        profiles:user_id (display_name)
      )
    `)
    .eq("user_id", user?.id)

  const events = calendarEvents?.map((item) => item.posts).filter(Boolean) || []

  return (
    <div className="flex flex-col h-full">
      <CalendarView events={events} />
    </div>
  )
}
