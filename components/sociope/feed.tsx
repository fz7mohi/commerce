// File: components/sociope/feed.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { sociopeApi } from '@/lib/sociope/api';
import type { Comment, Product, SocialPost } from '@/lib/sociope/types';
import {
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Search,
  Share2,
  Tag,
  User,
  X
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const CreatePost = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearch) {
      searchProducts(debouncedSearch);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  const searchProducts = async (query: string) => {
    try {
      const results = await sociopeApi.searchProducts(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search products:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/sociope/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.url) {
        setImages((prev) => [...prev, data.url]);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await sociopeApi.createPost({
        content,
        images,
        productIds: products.map((p) => p.id)
      });

      // Reset form
      setContent('');
      setImages([]);
      setProducts([]);
      setShowImageUpload(false);
      setShowProductPicker(false);
      window.location.reload(); // Temporary solution to refresh feed
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <Textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[60px] resize-none bg-primary-gray/20 dark:bg-primary-dark/40"
            />
          </div>
        </div>

        {showImageUpload && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-primary-dark/80 p-1 text-white hover:bg-primary-dark"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary/40 hover:border-primary">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <ImageIcon className="h-6 w-6 text-primary/60" />
                </label>
              )}
            </div>
          </div>
        )}

        {showProductPicker && (
          <div className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary-dark/40" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="max-h-64 space-y-2 overflow-auto rounded-lg border border-primary/20 p-2">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setProducts((prev) => [...prev, product]);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    disabled={products.some((p) => p.id === product.id)}
                    className="w-full rounded-lg p-2 text-left hover:bg-primary/5 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.featuredImage?.url || '/api/placeholder/48/48'}
                        alt={product.title}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-primary">
                          {product.priceRange.minVariantPrice.amount}{' '}
                          {product.priceRange.minVariantPrice.currencyCode}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium">Selected Products</div>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-primary/20 p-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.featuredImage?.url || '/api/placeholder/32/32'}
                        alt={product.title}
                        className="h-8 w-8 rounded-md object-cover"
                      />
                      <span className="font-medium">{product.title}</span>
                    </div>
                    <button
                      onClick={() => setProducts((prev) => prev.filter((p) => p.id !== product.id))}
                      className="text-primary-dark/60 hover:text-primary"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageUpload(!showImageUpload)}
              className={showImageUpload ? 'text-primary' : ''}
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProductPicker(!showProductPicker)}
              className={showProductPicker ? 'text-primary' : ''}
            >
              <Tag className="mr-2 h-5 w-5" />
              Product
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={!content.trim() || isSubmitting}>
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PostCard = ({ post }: { post: SocialPost }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments);

  useEffect(() => {
    if (session?.user) {
      setLiked(post.likes.some((like) => like.userId === session.user.id));
    }
  }, [post.likes, session?.user]);

  const handleLike = async () => {
    if (!session?.user) return;

    try {
      if (liked) {
        await sociopeApi.unlikePost(post.id);
        setLikesCount((prev) => prev - 1);
      } else {
        await sociopeApi.likePost(post.id);
        setLikesCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleComment = async () => {
    if (!session?.user || !newComment.trim()) return;

    try {
      const comment = await sociopeApi.createComment(post.id, newComment);
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center gap-3">
          {post.user.image ? (
            <img
              src={post.user.image}
              alt={post.user.name || ''}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <User className="h-4 w-4 text-primary" />
            </div>
          )}
          <span className="font-medium">{post.user.name}</span>
        </div>

        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

        {post.images.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {post.products.map((product) => (
          <div key={product.id} className="mb-4 rounded-lg bg-primary/5 p-3">
            <div className="flex items-center gap-3">
              {product.featuredImage && (
                <img
                  src={product.featuredImage.url}
                  alt={product.title}
                  className="h-12 w-12 rounded-md object-cover"
                />
              )}
              <div className="flex-1">
                <div className="font-medium">{product.title}</div>
                <div className="text-sm text-primary">
                  {product.priceRange.minVariantPrice.amount}{' '}
                  {product.priceRange.minVariantPrice.currencyCode}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-6 text-primary-dark/60 dark:text-primary-gray/60">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${liked ? 'text-primary' : 'hover:text-primary'}`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            {likesCount}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <MessageCircle className="h-5 w-5" />
            {post._count.comments}
          </button>
          <button className="flex items-center gap-2 transition-colors hover:text-primary">
            <Share2 className="h-5 w-5" />
            Share
          </button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-4 border-t border-primary/10 pt-4">
            {session && (
              <div className="flex gap-2">
                <div className="flex-none">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[40px] resize-none bg-primary-gray/20 dark:bg-primary-dark/40"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={handleComment} disabled={!newComment.trim()}>
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="flex-none">
                    {comment.user.image ? (
                      <img
                        src={comment.user.image}
                        alt={comment.user.name || ''}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="rounded-lg bg-primary-gray/10 p-3 dark:bg-primary-dark/20">
                      <div className="font-medium">{comment.user.name}</div>
                      <p className="mt-1 text-sm">{comment.content}</p>
                    </div>
                    <div className="mt-1 text-xs text-primary-dark/40 dark:text-primary-gray/40">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SocialFeed = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const fetchPosts = async (pageNum: number) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const newPosts = await sociopeApi.fetchPosts({ page: pageNum });
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchPosts(page + 1);
    }
  }, [inView, hasMore, isLoading, page]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <CreatePost />
      <div className="space-y-4">
        {posts.length === 0 && !isLoading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
        {isLoading && (
          <div className="flex justify-center p-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        )}
        <div ref={ref} className="h-10" />
      </div>
    </div>
  );
};

export default SocialFeed;
