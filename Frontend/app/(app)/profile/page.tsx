import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  const { data: userPosts } = await supabase.from("posts").select("id").eq("user_id", user?.id)

  const { data: userGroups } = await supabase.from("study_group_members").select("id").eq("user_id", user?.id)

  return (
    <div className="pb-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary/20 to-background pt-8 pb-12 px-4 flex flex-col items-center">
        <Avatar className="w-24 h-24 ring-4 ring-background shadow-lg">
          <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
            {profile?.display_name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold mt-4">{profile?.display_name || "Slug"}</h1>
        {profile?.major && (
          <p className="text-sm text-muted-foreground mt-1">
            {profile.major} {profile.graduation_year ? `'${profile.graduation_year.toString().slice(-2)}` : ""}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6">
        <div className="bg-card rounded-2xl border border-border p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{userPosts?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-primary">{userGroups?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Groups</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">🐌</p>
            <p className="text-xs text-muted-foreground">Slug</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="px-4 mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
