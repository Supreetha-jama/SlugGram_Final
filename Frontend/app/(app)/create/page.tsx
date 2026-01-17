"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, MapPin, MessageSquare, Users, Megaphone, PartyPopper } from "lucide-react"
import Link from "next/link"

const postTypes = [
  { value: "general", label: "General", icon: MessageSquare, color: "bg-muted text-muted-foreground" },
  { value: "event", label: "Event", icon: PartyPopper, color: "bg-accent/20 text-accent-foreground" },
  { value: "club", label: "Club", icon: Megaphone, color: "bg-primary/20 text-primary" },
  { value: "study_group", label: "Study", icon: Users, color: "bg-green-500/20 text-green-600" },
]

export default function CreatePostPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [loading, setLoading] = useState(false)
  const [postType, setPostType] = useState("general")
  const [content, setContent] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventLocation, setEventLocation] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const postData: {
      user_id: string
      content: string
      post_type: string
      event_date?: string
      event_location?: string
    } = {
      user_id: user.id,
      content,
      post_type: postType,
    }

    if (postType === "event" || postType === "study_group") {
      if (eventDate) postData.event_date = eventDate
      if (eventLocation) postData.event_location = eventLocation
    }

    const { error } = await supabase.from("posts").insert(postData)

    if (!error) {
      router.push("/feed")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/feed">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="font-semibold">New Post</h1>
        <Button size="sm" className="rounded-full px-5" disabled={loading || !content.trim()} onClick={handleSubmit}>
          {loading ? "..." : "Post"}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Post Type Selector */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {postTypes.map((type) => {
              const Icon = type.icon
              const isSelected = postType === type.value
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPostType(type.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all ${
                    isSelected ? "bg-primary text-primary-foreground" : type.color
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Input */}
        <div className="flex-1 p-4">
          <Textarea
            placeholder="What's happening on campus?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-0 p-0 text-lg resize-none focus-visible:ring-0 min-h-[200px]"
            autoFocus
          />
        </div>

        {/* Event/Study Group Fields */}
        {(postType === "event" || postType === "study_group") && (
          <div className="p-4 border-t border-border space-y-3 bg-muted/30">
            <div className="flex items-center gap-3 bg-background rounded-xl p-3 border border-border">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <Input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="border-0 p-0 h-auto focus-visible:ring-0"
                placeholder="Add date & time"
              />
            </div>
            <div className="flex items-center gap-3 bg-background rounded-xl p-3 border border-border">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Add location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="border-0 p-0 h-auto focus-visible:ring-0"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
