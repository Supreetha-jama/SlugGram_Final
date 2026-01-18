import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { CreatePostModal } from './CreatePostModal';
import { AnimatedSlug } from './AnimatedSlug';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth0();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLogout = () => {
    // Only clear session storage for auth, keep user data in localStorage
    sessionStorage.clear();

    // Logout and force account selection on next login
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const isActive = (path: string) => location.pathname === path;

  // Get username from localStorage profile or fall back to name
  const getDisplayName = () => {
    const savedProfile = localStorage.getItem('sluggram_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.username) return profile.username;
    }
    return user?.name?.split(' ')[0] || 'Profile';
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      {/* Header - Simplified */}
      <header className="sticky top-0 bg-ucsc-blue border-b border-ucsc-blue/20 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => navigate('/')} role="button">
            <AnimatedSlug size="sm" />
            <h1 className="text-xl font-bold text-ucsc-gold">SlugGram</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-2 transition-colors ${
                isActive('/profile') ? 'text-white' : 'text-ucsc-gold hover:text-white'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-ucsc-gold overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-sm text-ucsc-blue font-bold">
                    {user?.name?.[0] || 'U'}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {getDisplayName()}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="text-ucsc-gold hover:text-white transition-colors p-2"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-ucsc-blue border-t border-ucsc-blue/20 z-50">
        <div className="max-w-lg mx-auto px-2 h-16 flex items-center justify-around">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive('/') ? 'text-white' : 'text-ucsc-gold hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill={isActive('/') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => navigate('/reels')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive('/reels') ? 'text-white' : 'text-ucsc-gold hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill={isActive('/reels') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m14.25 0h1.5" />
            </svg>
            <span className="text-[10px]">Reels</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-ucsc-blue bg-ucsc-gold hover:bg-ucsc-gold/90 transition-colors -mt-4"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/calendar')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive('/calendar') ? 'text-white' : 'text-ucsc-gold hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill={isActive('/calendar') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className="text-[10px]">Events</span>
          </button>

          <button
            onClick={() => navigate('/study-groups')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive('/study-groups') ? 'text-white' : 'text-ucsc-gold hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill={isActive('/study-groups') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-[10px]">Study</span>
          </button>

          <button
            onClick={() => navigate('/messages')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive('/messages') ? 'text-white' : 'text-ucsc-gold hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill={isActive('/messages') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="text-[10px]">Chat</span>
          </button>
        </div>
      </nav>

      {/* Create Post Modal */}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
