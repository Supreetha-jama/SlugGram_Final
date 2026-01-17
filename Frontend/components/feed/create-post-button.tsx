"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function CreatePostButton() {
  return (
    <Link href="/create">
      <Button size="sm" className="gap-2">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Post</span>
      </Button>
    </Link>
  )
}
