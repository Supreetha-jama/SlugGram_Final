import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] flex flex-col bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl">🐌</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">slugram</h1>
        <p className="text-muted-foreground mt-2 text-center">Connect with UCSC students</p>
      </div>

      {/* Form Section */}
      <div className="p-6 pb-8 safe-area-bottom">
        <LoginForm />
      </div>
    </main>
  )
}
