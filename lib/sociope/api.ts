import type { Comment, CreatePostData, SocialPost } from './types';

export const sociopeApi = {
  async fetchPosts({ page = 1, limit = 10 } = {}): Promise<SocialPost[]> {
    const response = await fetch(`/api/sociope/posts?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  async createPost(data: CreatePostData): Promise<SocialPost> {
    const response = await fetch('/api/sociope/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  // Likes
  async likePost(postId: string) {
    const response = await fetch('/api/sociope/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId })
    });
    if (!response.ok) throw new Error('Failed to like post');
    return response.json();
  },

  async unlikePost(postId: string) {
    const response = await fetch(`/api/sociope/likes?postId=${postId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to unlike post');
    return response.json();
  },

  // Comments
  async createComment(postId: string, content: string): Promise<Comment> {
    const response = await fetch('/api/sociope/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content })
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  },

  // Product Search
  async searchProducts(query: string) {
    const response = await fetch(`/api/sociope/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search products');
    return response.json();
  }
};
