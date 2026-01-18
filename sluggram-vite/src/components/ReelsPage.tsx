import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout } from './Layout';
import { usePosts } from '../contexts/PostsContext';
import { AnimatedSlug } from './AnimatedSlug';
import { VideoPlayer } from './VideoPlayer';

export function ReelsPage() {
  const { user } = useAuth0();
  const { posts, likePost, addComment, savedPosts, savePost } = usePosts();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Filter only reels
  const reels = posts.filter(post => post.type === 'reel');

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 1000 * 60) return 'Just now';
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
  };

  // Make sure index is valid
  const safeIndex = Math.min(currentReelIndex, Math.max(0, reels.length - 1));
  const currentReel = reels.length > 0 ? reels[safeIndex] : null;

  const handleComment = () => {
    if (commentText.trim() && currentReel) {
      addComment(currentReel.id, commentText);
      setCommentText('');
    }
  };

  const isLiked = currentReel ? currentReel.likes.includes(user?.sub || '') : false;
  const isSaved = currentReel ? savedPosts.includes(currentReel.id) : false;

  const goToNextReel = () => {
    if (safeIndex < reels.length - 1) {
      setCurrentReelIndex(safeIndex + 1);
      setShowComments(false);
    }
  };

  const goToPrevReel = () => {
    if (safeIndex > 0) {
      setCurrentReelIndex(safeIndex - 1);
      setShowComments(false);
    }
  };

  // No reels - show empty state
  if (reels.length === 0 || !currentReel) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto">
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <AnimatedSlug size="xl" className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reels Yet!</h2>
            <p className="text-gray-600 mb-6">Be the first to share a reel with your fellow Slugs!</p>
            <p className="text-sm text-gray-500">
              Tap the <span className="inline-flex items-center justify-center w-6 h-6 bg-ucsc-gold text-ucsc-blue rounded-full text-xs font-bold">+</span> button to create a reel
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <div
          className="relative bg-black rounded-xl overflow-hidden"
          style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}
        >
          {/* Video/Reel Content */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
            {currentReel.videoUrl ? (
              <VideoPlayer
                key={currentReel.id}
                src={currentReel.videoUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                loop
                muted
                playsInline
              />
            ) : currentReel.imageUrl ? (
              <img
                key={currentReel.id}
                src={currentReel.imageUrl}
                alt=""
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-8">
                <AnimatedSlug size="lg" className="mx-auto mb-4" />
                <p className="text-white text-lg">{currentReel.content}</p>
              </div>
            )}
          </div>

          {/* Navigation arrows */}
          {safeIndex > 0 && (
            <button
              onClick={goToPrevReel}
              className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {safeIndex < reels.length - 1 && (
            <button
              onClick={goToNextReel}
              className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Reel counter */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
            {safeIndex + 1} / {reels.length}
          </div>

          {/* Author info overlay */}
          <div className="absolute bottom-0 left-0 right-16 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-ucsc-gold to-ucsc-blue flex items-center justify-center overflow-hidden">
                {currentReel.authorAvatar ? (
                  <img src={currentReel.authorAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold">{currentReel.authorName?.[0] || 'U'}</span>
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{currentReel.authorName || 'Unknown'}</p>
                <p className="text-xs text-gray-300">{formatTime(currentReel.timestamp)}</p>
              </div>
            </div>
            <p className="text-white text-sm line-clamp-2">{currentReel.content}</p>
          </div>

          {/* Action buttons (right side) */}
          <div className="absolute bottom-20 right-3 flex flex-col items-center gap-5">
            <button
              onClick={() => likePost(currentReel.id)}
              className="flex flex-col items-center gap-1"
            >
              {isLiked ? (
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
              <span className="text-white text-xs">{currentReel.likes.length}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-1"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
              </svg>
              <span className="text-white text-xs">{currentReel.comments.length}</span>
            </button>

            <button
              onClick={() => savePost(currentReel.id)}
              className="flex flex-col items-center gap-1"
            >
              {isSaved ? (
                <svg className="w-8 h-8 text-ucsc-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Comments Panel */}
          {showComments && (
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-4 max-h-[60%] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Comments</h3>
                <button onClick={() => setShowComments(false)} className="text-gray-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {currentReel.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {currentReel.comments.map(comment => (
                    <div key={comment.id} className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {comment.authorName?.[0] || 'U'}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-sm">
                          <span className="font-semibold">{comment.authorName}</span>{' '}
                          {comment.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(comment.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-ucsc-blue text-ucsc-gold rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
