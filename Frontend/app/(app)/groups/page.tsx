import { getSupabaseServerClient } from "@/lib/supabase/server"
import { StudyGroupCard } from "@/components/groups/study-group-card"
import { CreateGroupButton } from "@/components/groups/create-group-button"
import { Users, BookOpen } from "lucide-react"

export default async function GroupsPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: groups } = await supabase
    .from("study_groups")
    .select(`
      *,
      profiles:created_by (display_name),
      study_group_members (user_id)
    `)
    .order("created_at", { ascending: false })

  const myGroups =
    groups?.filter((g) => g.study_group_members?.some((m: { user_id: string }) => m.user_id === user?.id)) || []
  const otherGroups =
    groups?.filter((g) => !g.study_group_members?.some((m: { user_id: string }) => m.user_id === user?.id)) || []

  return (
    <div className="pb-4">
      {/* Header Card */}
      <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold">Study Groups</h2>
            </div>
            <p className="text-sm text-muted-foreground">Find study partners for your classes</p>
          </div>
          <CreateGroupButton />
        </div>
      </div>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <div className="px-4 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">My Groups</h3>
          <div className="space-y-3">
            {myGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} currentUserId={user?.id} />
            ))}
          </div>
        </div>
      )}

      {/* Other Groups */}
      <div className="px-4 pt-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {myGroups.length > 0 ? "Discover Groups" : "All Groups"}
        </h3>
        {otherGroups.length > 0 ? (
          <div className="space-y-3">
            {otherGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} currentUserId={user?.id} />
            ))}
          </div>
        ) : groups?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No study groups yet</h2>
            <p className="text-muted-foreground text-center text-sm">Create a group and invite fellow Slugs!</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
