"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"

interface ProfileFormProps {
  profile: {
    id: string
    display_name: string
    bio?: string
    major?: string
    graduation_year?: number
  } | null
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    major: profile?.major || "",
    graduation_year: profile?.graduation_year?.toString() || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: formData.display_name,
        bio: formData.bio || null,
        major: formData.major || null,
        graduation_year: formData.graduation_year ? Number.parseInt(formData.graduation_year) : null,
      })
      .eq("id", profile?.id)

    if (!error) {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 2000)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-card rounded-2xl border border-border divide-y divide-border">
        <div className="p-4">
          <Label htmlFor="display_name" className="text-xs text-muted-foreground uppercase tracking-wide">
            Display Name
          </Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="border-0 p-0 h-auto text-base focus-visible:ring-0 mt-1"
            required
          />
        </div>
        <div className="p-4">
          <Label htmlFor="major" className="text-xs text-muted-foreground uppercase tracking-wide">
            Major
          </Label>
          <Input
            id="major"
            placeholder="e.g., Computer Science"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            className="border-0 p-0 h-auto text-base focus-visible:ring-0 mt-1"
          />
        </div>
        <div className="p-4">
          <Label htmlFor="graduation_year" className="text-xs text-muted-foreground uppercase tracking-wide">
            Graduation Year
          </Label>
          <Input
            id="graduation_year"
            type="number"
            placeholder="e.g., 2026"
            value={formData.graduation_year}
            onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
            className="border-0 p-0 h-auto text-base focus-visible:ring-0 mt-1"
          />
        </div>
        <div className="p-4">
          <Label htmlFor="bio" className="text-xs text-muted-foreground uppercase tracking-wide">
            Bio
          </Label>
          <Textarea
            id="bio"
            placeholder="Tell other Slugs about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="border-0 p-0 min-h-[80px] text-base focus-visible:ring-0 mt-1 resize-none"
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
        {success ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Saved!
          </>
        ) : loading ? (
          "Saving..."
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}
