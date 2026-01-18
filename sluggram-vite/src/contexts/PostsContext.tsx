import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { api, type Post as ApiPost, type PostCreate } from '../lib/api';

export interface Post {
  id: string;
  type: 'general' | 'event' | 'study' | 'reel';
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: number;
  likes: string[];
  comments: Comment[];
  // Event-specific fields
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  // Study group-specific fields
  groupName?: string;
  course?: string;
  meetingTime?: string;
  studyLocation?: string;
  maxMembers?: number;
  members?: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: number;
}

interface PostsContextType {
  posts: Post[];
  savedPosts: string[];
  loading: boolean;
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'authorId' | 'authorName' | 'authorAvatar'>) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  joinStudyGroup: (postId: string) => Promise<void>;
  savePost: (postId: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | null>(null);

// Convert API post to frontend format
function convertPost(apiPost: ApiPost): Post {
  return {
    id: apiPost.id,
    type: apiPost.type,
    authorId: apiPost.author_id,
    authorName: apiPost.author_name,
    authorAvatar: apiPost.author_avatar,
    content: apiPost.content,
    imageUrl: apiPost.image_url,
    videoUrl: apiPost.video_url,
    timestamp: new Date(apiPost.created_at).getTime(),
    likes: apiPost.likes,
    comments: apiPost.comments.map(c => ({
      id: c.id,
      authorId: c.author_id,
      authorName: c.author_name,
      text: c.text,
      timestamp: new Date(c.created_at).getTime(),
    })),
    eventTitle: apiPost.event_title,
    eventDate: apiPost.event_date,
    eventTime: apiPost.event_time,
    eventLocation: apiPost.event_location,
    groupName: apiPost.group_name,
    course: apiPost.course,
    meetingTime: apiPost.meeting_time,
    studyLocation: apiPost.study_location,
    maxMembers: apiPost.max_members,
    members: apiPost.members,
  };
}

// Sample posts for when backend is not available
const samplePosts: Post[] = [
  {
    id: '1',
    type: 'general',
    authorId: 'user1',
    authorName: 'sammy_slug',
    content: 'Beautiful sunset at the Porter Meadow today! #ucsc #portermeadow',
    imageUrl: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    likes: ['user2', 'user3'],
    comments: [
      { id: 'c1', authorId: 'user2', authorName: 'alex_cs26', text: 'Amazing view!', timestamp: Date.now() - 1000 * 60 * 30 }
    ],
  },
  {
    id: '2',
    type: 'event',
    authorId: 'user2',
    authorName: 'ucsc_careers',
    content: 'Don\'t miss the biggest career event of the quarter! Meet recruiters from top tech companies.',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    likes: ['user1'],
    comments: [],
    eventTitle: 'UCSC Winter Career Fair',
    eventDate: '2026-01-25',
    eventTime: '10:00',
    eventLocation: 'East Field House',
  },
  {
    id: '3',
    type: 'study',
    authorId: 'user3',
    authorName: 'maria_chem',
    content: 'Looking for motivated students to study together! We review lectures and work on problem sets.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    likes: [],
    comments: [],
    groupName: 'Organic Chemistry Study Group',
    course: 'CHEM 108A',
    meetingTime: 'Mondays & Wednesdays, 4 PM',
    studyLocation: 'Thimann Labs Study Room',
    maxMembers: 12,
    members: ['user3', 'user4', 'user5'],
  },
  {
    id: '4',
    type: 'reel',
    authorId: 'user1',
    authorName: 'sammy_slug',
    content: 'Check out this amazing view from the top of campus!',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    likes: ['user2', 'user4'],
    comments: [],
  },
];

export function PostsProvider({ children }: { children: ReactNode }) {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Set up API token when authenticated
  useEffect(() => {
    async function setupToken() {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          api.setToken(token);
        } catch (error) {
          // If we can't get a token, we'll use localStorage mode
          console.log('Using localStorage mode (no API token available)');
          setUseLocalStorage(true);
        }
      }
    }
    setupToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Fetch posts from API or localStorage
  const refreshPosts = async () => {
    setLoading(true);
    try {
      if (!useLocalStorage) {
        const apiPosts = await api.getPosts();
        setPosts(apiPosts.map(convertPost));

        // Get saved posts
        try {
          const saved = await api.getSavedPosts();
          setSavedPosts(saved.map(p => p.id));
        } catch {
          setSavedPosts([]);
        }
      } else {
        // Fallback to localStorage
        const storedPosts = localStorage.getItem('sluggram_posts');
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        } else {
          setPosts(samplePosts);
          localStorage.setItem('sluggram_posts', JSON.stringify(samplePosts));
        }

        const storedSavedPosts = localStorage.getItem('sluggram_saved_posts');
        if (storedSavedPosts) {
          setSavedPosts(JSON.parse(storedSavedPosts));
        }
      }
    } catch (error) {
      console.error('Failed to fetch posts, using localStorage:', error);
      setUseLocalStorage(true);

      // Load from localStorage
      const storedPosts = localStorage.getItem('sluggram_posts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(samplePosts);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load posts on mount
  useEffect(() => {
    refreshPosts();
  }, [useLocalStorage]);

  // Save to localStorage when in localStorage mode
  useEffect(() => {
    if (useLocalStorage && posts.length > 0) {
      localStorage.setItem('sluggram_posts', JSON.stringify(posts));
    }
  }, [posts, useLocalStorage]);

  const addPost = async (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'authorId' | 'authorName' | 'authorAvatar'>) => {
    if (!useLocalStorage) {
      try {
        const createData: PostCreate = {
          type: postData.type,
          content: postData.content,
          image_url: postData.imageUrl,
          video_url: postData.videoUrl,
          event_title: postData.eventTitle,
          event_date: postData.eventDate,
          event_time: postData.eventTime,
          event_location: postData.eventLocation,
          group_name: postData.groupName,
          course: postData.course,
          meeting_time: postData.meetingTime,
          study_location: postData.studyLocation,
          max_members: postData.maxMembers,
        };

        const newPost = await api.createPost(createData);
        setPosts(prev => [convertPost(newPost), ...prev]);
        return;
      } catch (error) {
        console.error('Failed to create post via API:', error);
      }
    }

    // Fallback to localStorage
    let authorName = user?.name || 'Anonymous Slug';
    const savedProfile = localStorage.getItem('sluggram_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.username) authorName = profile.username;
    }

    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      authorId: user?.sub || 'anonymous',
      authorName,
      authorAvatar: user?.picture,
      timestamp: Date.now(),
      likes: [],
      comments: [],
      members: postData.type === 'study' ? [user?.sub || 'anonymous'] : undefined,
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = async (postId: string) => {
    if (!useLocalStorage) {
      try {
        const updatedPost = await api.likePost(postId);
        setPosts(prev =>
          prev.map(post => post.id === postId ? convertPost(updatedPost) : post)
        );
        return;
      } catch (error) {
        console.error('Failed to like post via API:', error);
      }
    }

    // Fallback to localStorage
    const userId = user?.sub || 'anonymous';
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(userId);
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter(id => id !== userId)
              : [...post.likes, userId],
          };
        }
        return post;
      })
    );
  };

  const addComment = async (postId: string, text: string) => {
    if (!useLocalStorage) {
      try {
        const updatedPost = await api.commentPost(postId, text);
        setPosts(prev =>
          prev.map(post => post.id === postId ? convertPost(updatedPost) : post)
        );
        return;
      } catch (error) {
        console.error('Failed to add comment via API:', error);
      }
    }

    // Fallback to localStorage
    let authorName = user?.name || 'Anonymous Slug';
    const savedProfile = localStorage.getItem('sluggram_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.username) authorName = profile.username;
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      authorId: user?.sub || 'anonymous',
      authorName,
      text,
      timestamp: Date.now(),
    };

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const joinStudyGroup = async (postId: string) => {
    if (!useLocalStorage) {
      try {
        const updatedPost = await api.joinStudyGroup(postId);
        setPosts(prev =>
          prev.map(post => post.id === postId ? convertPost(updatedPost) : post)
        );
        return;
      } catch (error) {
        console.error('Failed to join study group via API:', error);
      }
    }

    // Fallback to localStorage
    const userId = user?.sub || 'anonymous';
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId && post.type === 'study' && post.members) {
          const isMember = post.members.includes(userId);
          if (isMember) {
            return { ...post, members: post.members.filter(id => id !== userId) };
          }
          if (post.members.length < (post.maxMembers || 10)) {
            return { ...post, members: [...post.members, userId] };
          }
        }
        return post;
      })
    );
  };

  const savePost = async (postId: string) => {
    if (!useLocalStorage) {
      try {
        await api.savePost(postId);
        setSavedPosts(prev => {
          const isSaved = prev.includes(postId);
          return isSaved ? prev.filter(id => id !== postId) : [...prev, postId];
        });
        return;
      } catch (error) {
        console.error('Failed to save post via API:', error);
      }
    }

    // Fallback to localStorage
    setSavedPosts(prev => {
      const isSaved = prev.includes(postId);
      const newSavedPosts = isSaved
        ? prev.filter(id => id !== postId)
        : [...prev, postId];
      localStorage.setItem('sluggram_saved_posts', JSON.stringify(newSavedPosts));
      return newSavedPosts;
    });
  };

  return (
    <PostsContext.Provider value={{ posts, savedPosts, loading, addPost, likePost, addComment, joinStudyGroup, savePost, refreshPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
