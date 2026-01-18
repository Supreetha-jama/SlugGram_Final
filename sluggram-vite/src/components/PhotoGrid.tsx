import { PhotoCard } from './PhotoCard';
import { useNostrFeed } from '../hooks/useNostrFeed';

// Placeholder stories data
const stories = [
  { id: 1, name: 'Your Story', image: null, isOwn: true },
  { id: 2, name: 'sammy_slug', image: '🐌' },
  { id: 3, name: 'redwoods', image: '🌲' },
  { id: 4, name: 'porter', image: '🏠' },
  { id: 5, name: 'cowell', image: '☕' },
  { id: 6, name: 'beach', image: '🏖️' },
  { id: 7, name: 'library', image: '📚' },
];

export function PhotoGrid() {
  const { events, isLoading, error } = useNostrFeed();

  return (
    <div>
      {/* Stories Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 overflow-x-auto">
        <div className="flex gap-4">
          {stories.map((story) => (
            <button key={story.id} className="flex flex-col items-center gap-1 min-w-[64px]">
              <div className={`w-16 h-16 rounded-full p-[2px] ${story.isOwn ? 'bg-gray-300' : 'bg-gradient-to-tr from-ucsc-gold via-yellow-500 to-ucsc-blue'}`}>
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">
                  {story.isOwn ? (
                    <div className="relative w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-2xl">➕</span>
                    </div>
                  ) : (
                    story.image
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-900 truncate w-16 text-center">{story.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div>
        {isLoading && (
          <div className="flex justify-center py-12">
            <svg className="w-8 h-8 animate-spin text-ucsc-blue" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {error && (
          <div className="text-center py-12 px-4">
            <p className="text-red-500 mb-2">Failed to load feed</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-12 px-4">
            <span className="text-6xl mb-4 block">🐌</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to SlugGram!</h3>
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        )}

        {events.map((event) => {
          const urlTag = event.tags.find(t => t[0] === 'url');
          const imageUrl = urlTag?.[1] || '';

          return (
            <PhotoCard
              key={event.id}
              imageUrl={imageUrl}
              caption={event.content}
              author={event.pubkey}
              timestamp={event.created_at}
              likes={Math.floor(Math.random() * 100)}
            />
          );
        })}
      </div>
    </div>
  );
}
