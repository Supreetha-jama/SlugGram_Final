import type React from "react"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/layout/app-shell"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle()

  // If no profile exists (user signed up before fix), create one
  if (!profile) {
    const displayName = user.email?.split("@")[0] || "Slug"
    await supabase.from("profiles").insert({
      id: user.id,
      username: displayName,
      display_name: displayName,
    })
    profile = { display_name: displayName }
  }

  return <AppShell user={{ id: user.id, email: user.email, display_name: profile?.display_name }}>{children}</AppShell>
}
