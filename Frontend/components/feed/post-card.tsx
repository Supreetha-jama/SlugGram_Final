"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Bookmark, Share2, MapPin, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface PostCardProps {
  post: {
    id: string
    content: string
    post_type: string
    event_date?: string
    event_location?: string
    created_at: string
    profiles: { display_name: string; avatar_url?: string }
    post_likes: { user_id: string }[]
  }
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [likes, setLikes] = useState(post.post_likes?.length || 0)
  const [isLiked, setIsLiked] = useState(post.post_likes?.some((like) => like.user_id === currentUserId))
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleLike = async () => {
    if (!currentUserId || loading) return
    setLoading(true)

    if (isLiked) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", currentUserId)
      setLikes(likes - 1)
      setIsLiked(false)
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: currentUserId })
      setLikes(likes + 1)
      setIsLiked(true)
    }
    setLoading(false)
  }

  const handleAddToCalendar = async () => {
    if (!currentUserId || !post.event_date) return

    await supabase.from("user_calendar").insert({
      user_id: currentUserId,
      post_id: post.id,
    })
    setSaved(true)
    router.refresh()
  }

  const typeStyles: Record<string, string> = {
    event: "bg-accent/20 text-accent-foreground",
    club: "bg-primary/20 text-primary",
    study_group: "bg-green-500/20 text-green-600",
    general: "bg-muted text-muted-foreground",
  }

  return (
    <article className="bg-card px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-border">
            <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
              {post.profiles.display_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{post.profiles.display_name}</span>
            <span className="text-[11px] text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${typeStyles[post.post_type] || typeStyles.general}`}
        >
          {post.post_type.replace("_", " ")}
        </span>
      </div>

      {/* Content */}
      <p className="text-[15px] leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>

      {/* Event Details Card */}
      {(post.event_date || post.event_location) && (
        <div className="rounded-xl bg-muted/50 p-3 mb-3 space-y-2">
          {post.event_date && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">
                {new Date(post.event_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {post.event_location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{post.event_location}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-9 px-3 gap-1.5 ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
            onClick={handleLike}
            disabled={loading}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-muted-foreground">
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
        {post.event_date && (
          <Button
            variant={saved ? "secondary" : "outline"}
            size="sm"
            className="h-9 gap-1.5"
            onClick={handleAddToCalendar}
            disabled={saved}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            {saved ? "Saved" : "Save"}
          </Button>
        )}
      </div>
    </article>
  )
}
