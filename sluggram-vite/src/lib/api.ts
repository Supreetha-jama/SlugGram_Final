const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP error ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  // User endpoints
  async getCurrentUser() {
    return this.request<User>('/users/me');
  }

  async updateUser(data: UserUpdate) {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Post endpoints
  async getPosts(type?: string) {
    const query = type ? `?post_type=${type}` : '';
    return this.request<Post[]>(`/posts/${query}`);
  }

  async createPost(data: PostCreate) {
    return this.request<Post>('/posts/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deletePost(postId: string) {
    return this.request<void>(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async likePost(postId: string) {
    return this.request<Post>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async commentPost(postId: string, text: string) {
    return this.request<Post>(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async savePost(postId: string) {
    return this.request<Post>(`/posts/${postId}/save`, {
      method: 'POST',
    });
  }

  async joinStudyGroup(postId: string) {
    return this.request<Post>(`/posts/${postId}/join`, {
      method: 'POST',
    });
  }

  async getUserPosts(userId: string) {
    return this.request<Post[]>(`/posts/user/${userId}`);
  }

  async getSavedPosts() {
    return this.request<Post[]>('/posts/saved/me');
  }

  // Upload endpoints
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail);
    }

    return response.json();
  }

  async uploadVideo(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/video`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail);
    }

    return response.json();
  }
}

export const api = new ApiClient();

// Types
export interface User {
  id: string;
  auth0_id: string;
  username?: string;
  email: string;
  name?: string;
  major?: string;
  graduation_year?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserUpdate {
  username?: string;
  major?: string;
  graduation_year?: string;
  bio?: string;
}

export interface Comment {
  id: string;
  author_id: string;
  author_name: string;
  text: string;
  created_at: string;
}

export interface Post {
  id: string;
  type: 'general' | 'event' | 'study' | 'reel';
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  image_url?: string;
  video_url?: string;
  likes: string[];
  comments: Comment[];
  members: string[];
  saved_by: string[];
  created_at: string;
  // Event fields
  event_title?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  // Study group fields
  group_name?: string;
  course?: string;
  meeting_time?: string;
  study_location?: string;
  max_members?: number;
}

export interface PostCreate {
  type: 'general' | 'event' | 'study' | 'reel';
  content: string;
  image_url?: string;
  video_url?: string;
  event_title?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  group_name?: string;
  course?: string;
  meeting_time?: string;
  study_location?: string;
  max_members?: number;
}
