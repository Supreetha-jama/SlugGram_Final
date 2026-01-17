"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export function CreateGroupButton() {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
    meeting_location: "",
    meeting_time: "",
    max_members: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: group, error } = await supabase
      .from("study_groups")
      .insert({
        name: formData.name,
        description: formData.description || null,
        subject: formData.subject,
        meeting_location: formData.meeting_location || null,
        meeting_time: formData.meeting_time || null,
        max_members: formData.max_members ? Number.parseInt(formData.max_members) : null,
        created_by: user.id,
      })
      .select()
      .single()

    if (!error && group) {
      // Auto-join creator to the group
      await supabase.from("study_group_members").insert({
        group_id: group.id,
        user_id: user.id,
      })

      setOpen(false)
      setFormData({
        name: "",
        description: "",
        subject: "",
        meeting_location: "",
        meeting_time: "",
        max_members: "",
      })
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Study Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              placeholder="e.g., CSE 101 Study Squad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject/Course</Label>
            <Input
              id="subject"
              placeholder="e.g., CSE 101, Math 19A"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What will your group focus on?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_location">Meeting Location</Label>
              <Input
                id="meeting_location"
                placeholder="e.g., S&E Library"
                value={formData.meeting_location}
                onChange={(e) => setFormData({ ...formData, meeting_location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_members">Max Members</Label>
              <Input
                id="max_members"
                type="number"
                placeholder="e.g., 6"
                value={formData.max_members}
                onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting_time">Meeting Schedule</Label>
            <Input
              id="meeting_time"
              placeholder="e.g., Mondays & Wednesdays 6pm"
              value={formData.meeting_time}
              onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
