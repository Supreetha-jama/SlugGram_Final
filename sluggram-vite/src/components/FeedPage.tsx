import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout } from './Layout';
import { usePosts } from '../contexts/PostsContext';
import { AnimatedSlug } from './AnimatedSlug';

export function FeedPage() {
  const { user } = useAuth0();
  const { posts, savedPosts, likePost, addComment, joinStudyGroup, savePost } = usePosts();
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 1000 * 60) return 'Just now';
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
  };

  const handleComment = (postId: string) => {
    if (commentText[postId]?.trim()) {
      addComment(postId, commentText[postId]);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const isLiked = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.likes.includes(user?.sub || '') || false;
  };

  const isMember = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.members?.includes(user?.sub || '') || false;
  };

  const isSaved = (postId: string) => {
    return savedPosts.includes(postId);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <AnimatedSlug size="xl" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome to SlugGram!</h2>
            <p className="text-gray-600 mt-2">Be the first to share something with your fellow Slugs!</p>
          </div>
        ) : (
          posts.map(post => (
            <article key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-ucsc-gold to-ucsc-blue flex items-center justify-center overflow-hidden">
                  {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold">{post.authorName[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{post.authorName}</p>
                  <p className="text-xs text-gray-500">{formatTime(post.timestamp)}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  post.type === 'event' ? 'bg-purple-100 text-purple-700' :
                  post.type === 'study' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {post.type === 'event' ? '📅 Event' : post.type === 'study' ? '📚 Study Group' : '📸 Post'}
                </span>
              </div>

              {/* Post Image (for general posts) */}
              {post.type === 'general' && post.imageUrl && (
                <div className="aspect-square bg-gray-100">
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Event Details */}
              {post.type === 'event' && (
                <div className="px-4 py-3 bg-purple-50 border-y border-purple-100">
                  <h3 className="font-bold text-lg text-gray-900">{post.eventTitle}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>{post.eventDate && new Date(post.eventDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{post.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span>{post.eventLocation}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Study Group Details */}
              {post.type === 'study' && (
                <div className="px-4 py-3 bg-green-50 border-y border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                        {post.course}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900 mt-1">{post.groupName}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {post.members?.length || 0}/{post.maxMembers || 10}
                      </p>
                      <p className="text-xs text-gray-500">members</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{post.meetingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span>{post.studyLocation}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => joinStudyGroup(post.id)}
                    disabled={!isMember(post.id) && (post.members?.length || 0) >= (post.maxMembers || 10)}
                    className={`mt-3 w-full py-2 rounded-lg font-medium transition-colors ${
                      isMember(post.id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : (post.members?.length || 0) >= (post.maxMembers || 10)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-ucsc-blue text-ucsc-gold hover:opacity-90'
                    }`}
                  >
                    {isMember(post.id) ? '✓ Joined' : (post.members?.length || 0) >= (post.maxMembers || 10) ? 'Full' : 'Join Group'}
                  </button>
                </div>
              )}

              {/* Post Content */}
              <div className="p-4">
                <p className="text-gray-900">{post.content}</p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-2 flex items-center gap-4">
                <button
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                >
                  {isLiked(post.id) ? (
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  )}
                  <span className="text-sm">{post.likes.length}</span>
                </button>
                <button
                  onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  className="flex items-center gap-1 text-gray-600 hover:text-ucsc-blue transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                  <span className="text-sm">{post.comments.length}</span>
                </button>
                <button
                  onClick={() => savePost(post.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-ucsc-gold transition-colors ml-auto"
                >
                  {isSaved(post.id) ? (
                    <svg className="w-6 h-6 text-ucsc-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {post.comments.length > 0 && (
                    <div className="py-3 space-y-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {comment.authorName[0]}
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
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                      onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      disabled={!commentText[post.id]?.trim()}
                      className="px-4 py-2 bg-ucsc-blue text-ucsc-gold rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </Layout>
  );
}
