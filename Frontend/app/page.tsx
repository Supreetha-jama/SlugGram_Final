import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MessageCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full">
              <span className="text-2xl">🐌</span>
              <span className="text-sm font-medium text-foreground">For UCSC Students</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              <span className="text-primary">slug</span>ram
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Connect with fellow Banana Slugs. Share events, join study groups, and stay updated with everything
              happening on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need for campus life</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Campus Feed</h3>
              <p className="text-muted-foreground">
                Stay connected with posts from clubs, organizations, and fellow students. Share events, news, and
                updates with the UCSC community.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Event Calendar</h3>
              <p className="text-muted-foreground">
                Never miss an event again. Add campus events to your personal calendar and get notified about what's
                happening around you.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Study Groups</h3>
              <p className="text-muted-foreground">
                Find study partners for any class. Create or join study groups, set meeting times, and ace your exams
                together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to connect with UCSC?</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of Banana Slugs already using Slugram to make the most of their college experience.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Join Slugram Today
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐌</span>
            <span className="font-bold text-primary">slugram</span>
          </div>
          <p className="text-sm text-muted-foreground">Made with love for UCSC students</p>
        </div>
      </footer>
    </main>
  )
}
