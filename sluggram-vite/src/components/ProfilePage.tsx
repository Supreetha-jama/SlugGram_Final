import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout } from './Layout';
import { usePosts } from '../contexts/PostsContext';

interface Profile {
  username: string;
  major: string;
  graduationYear: string;
  bio: string;
}

export function ProfilePage() {
  const { user } = useAuth0();
  const { posts } = usePosts();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: '',
    major: '',
    graduationYear: '',
    bio: '',
  });
  const [editForm, setEditForm] = useState<Profile>(profile);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('sluggram_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setEditForm(parsed);
    }
  }, []);

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem('sluggram_profile', JSON.stringify(editForm));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  // Get user's posts
  const userPosts = posts.filter(post => post.authorId === user?.sub);
  const generalPosts = userPosts.filter(post => post.type === 'general');
  const eventPosts = userPosts.filter(post => post.type === 'event');
  const studyPosts = userPosts.filter(post => post.type === 'study');

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
  };

  const graduationYears = ['2024', '2025', '2026', '2027', '2028', '2029'];

  const popularMajors = [
    'Computer Science',
    'Computer Engineering',
    'Biology',
    'Psychology',
    'Economics',
    'Literature',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Environmental Studies',
    'Politics',
    'Sociology',
    'Art',
    'Music',
    'Film & Digital Media',
    'History',
    'Philosophy',
    'Linguistics',
    'Other',
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-ucsc-blue to-ucsc-blue/80 p-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-ucsc-gold overflow-hidden border-4 border-white">
                {user?.picture ? (
                  <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-ucsc-blue">
                    {user?.name?.[0] || profile.username?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {profile.username || user?.name || 'Banana Slug'}
                </h1>
                <p className="text-ucsc-gold/80">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-ucsc-blue hover:bg-ucsc-blue/5 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-500">Username</label>
                    <p className="text-gray-900 font-medium">
                      {profile.username || <span className="text-gray-400 italic">Not set</span>}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-500">Major</label>
                    <p className="text-gray-900 font-medium">
                      {profile.major || <span className="text-gray-400 italic">Not set</span>}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-500">Graduation Year</label>
                    <p className="text-gray-900 font-medium">
                      {profile.graduationYear || <span className="text-gray-400 italic">Not set</span>}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-500">Bio</label>
                    <p className="text-gray-900">
                      {profile.bio || <span className="text-gray-400 italic">Not set</span>}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Activity</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-ucsc-blue">{generalPosts.length}</p>
                      <p className="text-sm text-gray-500">Posts</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-ucsc-blue">{eventPosts.length}</p>
                      <p className="text-sm text-gray-500">Events</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-ucsc-blue">{studyPosts.length}</p>
                      <p className="text-sm text-gray-500">Study Groups</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      placeholder="Choose a username"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                    <select
                      value={editForm.major}
                      onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                    >
                      <option value="">Select your major</option>
                      {popularMajors.map(major => (
                        <option key={major} value={major}>{major}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                    <select
                      value={editForm.graduationYear}
                      onChange={(e) => setEditForm({ ...editForm, graduationYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                    >
                      <option value="">Select graduation year</option>
                      {graduationYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{editForm.bio.length}/200 characters</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2 bg-ucsc-blue text-ucsc-gold font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User's Posts */}
        {userPosts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Your Posts</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {userPosts.map(post => (
                <div key={post.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {post.type === 'general' && post.imageUrl && (
                      <img src={post.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          post.type === 'event' ? 'bg-purple-100 text-purple-700' :
                          post.type === 'study' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {post.type === 'event' ? 'Event' : post.type === 'study' ? 'Study Group' : 'Post'}
                        </span>
                        <span className="text-xs text-gray-400">{formatTime(post.timestamp)}</span>
                      </div>
                      {post.type === 'event' && (
                        <p className="font-semibold text-gray-900 mt-1">{post.eventTitle}</p>
                      )}
                      {post.type === 'study' && (
                        <p className="font-semibold text-gray-900 mt-1">{post.groupName}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{post.likes.length} likes</span>
                        <span>{post.comments.length} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
