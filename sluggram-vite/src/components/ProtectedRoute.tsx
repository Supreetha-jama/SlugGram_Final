import { useAuth0 } from '@auth0/auth0-react';
import type { ReactNode } from 'react';
import { AnimatedSlug } from './AnimatedSlug';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loginWithRedirect, user, error } = useAuth0();

  // Log any Auth0 errors
  if (error) {
    console.error('Auth0 error:', error);
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-ucsc-blue via-ucsc-blue to-blue-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating circles */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-ucsc-gold/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-ucsc-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Wave pattern at bottom */}
          <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#fdc700" fillOpacity="0.2" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            <path fill="#fdc700" fillOpacity="0.3" d="M0,288L48,277.3C96,267,192,245,288,234.7C384,224,480,224,576,234.7C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AnimatedSlug size="md" />
              <span className="text-2xl font-bold text-ucsc-gold">SlugGram</span>
            </div>
            <button
              onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2', prompt: 'select_account' } })}
              className="px-5 py-2.5 text-sm font-semibold text-ucsc-blue bg-ucsc-gold rounded-full hover:bg-yellow-400 transition-all hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-8">
            {/* Big animated slug */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-ucsc-gold/20 rounded-full blur-2xl scale-150 animate-pulse" />
                <AnimatedSlug size="xl" className="relative z-10" />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white">Exclusively for UCSC Students</span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tight">
              <span className="text-white">Slug</span>
              <span className="text-ucsc-gold">Gram</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              The social network for Banana Slugs. Share moments, find study buddies, and never miss a campus event.
            </p>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2', prompt: 'select_account' } })}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-ucsc-gold text-ucsc-blue font-bold text-lg rounded-full hover:bg-yellow-400 transition-all hover:scale-105 shadow-2xl shadow-ucsc-gold/30"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

            <p className="text-blue-200 text-sm">
              Use your <span className="text-ucsc-gold font-semibold">@ucsc.edu</span> email to join
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <section className="relative z-10 py-16 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Everything for your campus life
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-ucsc-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-ucsc-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Photo Feed</h3>
                <p className="text-blue-200 text-sm">Share campus moments and redwood adventures</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Campus Events</h3>
                <p className="text-blue-200 text-sm">Never miss a party, concert, or career fair</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Study Groups</h3>
                <p className="text-blue-200 text-sm">Find study buddies for any class</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Messages</h3>
                <p className="text-blue-200 text-sm">Chat with fellow Slugs instantly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fun fact banner */}
        <section className="relative z-10 py-12 bg-ucsc-gold">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AnimatedSlug size="sm" />
              <span className="text-2xl font-bold text-ucsc-blue">Did you know?</span>
            </div>
            <p className="text-ucsc-blue/80 text-lg">
              UCSC's mascot, the Banana Slug, was officially adopted in 1986 after a student vote. Fiat Slug!
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AnimatedSlug size="sm" />
              <span className="font-bold text-ucsc-gold">SlugGram</span>
            </div>
            <p className="text-sm text-blue-200">Made with love for UCSC students</p>
          </div>
        </footer>
      </main>
    );
  }

  // Secondary validation: check for UCSC email
  const email = user?.email || '';
  if (!email.endsWith('@ucsc.edu')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-ucsc-blue to-blue-900 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Slugs Only!</h2>
            <p className="text-gray-600 mb-2">
              SlugGram is exclusively for UCSC students with <span className="font-semibold text-ucsc-blue">@ucsc.edu</span> email addresses.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Signed in as: <span className="font-mono">{email}</span>
            </p>

            <button
              onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2', prompt: 'select_account' } })}
              className="w-full bg-ucsc-blue hover:bg-blue-800 text-ucsc-gold font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg"
            >
              Try a different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
