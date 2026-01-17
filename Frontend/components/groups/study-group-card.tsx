"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Clock, ChevronRight } from "lucide-react"

interface StudyGroupCardProps {
  group: {
    id: string
    name: string
    description?: string
    subject: string
    meeting_location?: string
    meeting_time?: string
    max_members?: number
    profiles: { display_name: string }
    study_group_members: { user_id: string }[]
  }
  currentUserId?: string
}

export function StudyGroupCard({ group, currentUserId }: StudyGroupCardProps) {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const memberCount = group.study_group_members?.length || 0
  const isMember = group.study_group_members?.some((m) => m.user_id === currentUserId)
  const isFull = group.max_members ? memberCount >= group.max_members : false

  const handleJoinLeave = async () => {
    if (!currentUserId || loading) return
    setLoading(true)

    if (isMember) {
      await supabase.from("study_group_members").delete().eq("group_id", group.id).eq("user_id", currentUserId)
    } else {
      await supabase.from("study_group_members").insert({ group_id: group.id, user_id: currentUserId })
    }

    router.refresh()
    setLoading(false)
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-4 active:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-green-600">{group.subject.slice(0, 2)}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm line-clamp-1">{group.name}</h3>
              <p className="text-xs text-muted-foreground">{group.subject}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          </div>

          {group.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{group.description}</p>}

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>
                {memberCount}
                {group.max_members ? `/${group.max_members}` : ""}
              </span>
            </div>
            {group.meeting_location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{group.meeting_location}</span>
              </div>
            )}
            {group.meeting_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="truncate max-w-[80px]">{group.meeting_time}</span>
              </div>
            )}
          </div>

          {/* Action */}
          <Button
            variant={isMember ? "secondary" : "default"}
            size="sm"
            className="w-full mt-3 h-9"
            disabled={loading || (isFull && !isMember)}
            onClick={handleJoinLeave}
          >
            {loading ? "..." : isMember ? "Leave Group" : isFull ? "Full" : "Join Group"}
          </Button>
        </div>
      </div>
    </div>
  )
}
