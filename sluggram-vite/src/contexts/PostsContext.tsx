import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

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
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'authorId' | 'authorName' | 'authorAvatar'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  joinStudyGroup: (postId: string) => void;
  savePost: (postId: string) => void;
}

const PostsContext = createContext<PostsContextType | null>(null);

// Sample posts
const samplePosts: Post[] = [
  {
    id: '1',
    type: 'general',
    authorId: 'user1',
    authorName: 'sammy_slug',
    content: 'Beautiful sunset at the Porter Meadow today! 🌅 #ucsc #portermeadow',
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
    type: 'general',
    authorId: 'user4',
    authorName: 'jordan_k',
    content: 'Finals week survival kit: coffee, snacks, and good friends ☕📚',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    likes: ['user1', 'user2', 'user3', 'user5'],
    comments: [
      { id: 'c2', authorId: 'user1', authorName: 'sammy_slug', text: 'We got this! 💪', timestamp: Date.now() - 1000 * 60 * 60 * 47 }
    ],
  },
];

export function PostsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth0();
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // Load posts from localStorage on mount
  useEffect(() => {
    const storedPosts = localStorage.getItem('sluggram_posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(samplePosts);
      localStorage.setItem('sluggram_posts', JSON.stringify(samplePosts));
    }

    // Load saved posts
    const storedSavedPosts = localStorage.getItem('sluggram_saved_posts');
    if (storedSavedPosts) {
      setSavedPosts(JSON.parse(storedSavedPosts));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('sluggram_posts', JSON.stringify(posts));
    }
  }, [posts]);

  const addPost = (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'authorId' | 'authorName' | 'authorAvatar'>) => {
    // Get username from profile if available
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

  const likePost = (postId: string) => {
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

  const addComment = (postId: string, text: string) => {
    // Get username from profile if available
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

  const joinStudyGroup = (postId: string) => {
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

  const savePost = (postId: string) => {
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
    <PostsContext.Provider value={{ posts, savedPosts, addPost, likePost, addComment, joinStudyGroup, savePost }}>
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
