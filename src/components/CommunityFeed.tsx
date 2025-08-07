import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreatePostModal } from './CreatePostModal';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  tag: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  username: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    tag: 'Trimester 2 Support',
    content: 'Feeling overwhelmed by the sheer volume of baby gear out there! Any recommendations for must-have items that truly made a difference for you? Trying to keep it minimalist but practical. 🙏',
    likes: 85,
    comments: 12,
    isLiked: false,
    username: 'Sarah M.',
  },
  {
    id: '2',
    tag: 'New Moms Connect',
    content: 'Just hit 28 weeks! So excited and a little nervous. Sharing a photo of my growing bump. What\'s one piece of advice you\'d give to your 28-week pregnant self?',
    image: '/placeholder.svg',
    likes: 85,
    comments: 12,
    isLiked: false,
    username: 'Emily R.',
  },
  {
    id: '3',
    tag: 'First Trimester Tips',
    content: 'Morning sickness hitting hard this week. Found that ginger tea and small frequent meals really help. What are your go-to remedies? 💚',
    likes: 42,
    comments: 8,
    isLiked: true,
    username: 'Jessica L.',
  },
];

const tags = [
  'General Pregnancy',
  'Trimester 1 Support', 
  'Trimester 2 Support',
  'Trimester 3 Support',
  'Postpartum Support',
  'Baby Nutrition',
  'Baby Sleep',
  'Product Recommendations',
  'Mental Health & Wellness'
];

const CommunityFeed = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleCreatePost = (postData: { tag: string; content: string; image?: string }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      tag: postData.tag,
      content: postData.content,
      image: postData.image,
      likes: 0,
      comments: 0,
      isLiked: false,
      username: 'You',
    };

    setPosts([newPost, ...posts]);
    toast({
      title: "Post created! 🎉",
      description: "Your post has been shared with the community.",
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesTag = !selectedTag || post.tag === selectedTag;
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center mb-4">Home</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search posts, people, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-muted/50"
            />
          </div>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Badge
            variant={selectedTag === null ? "default" : "secondary"}
            className="whitespace-nowrap cursor-pointer px-4 py-2"
            onClick={() => setSelectedTag(null)}
          >
            All Posts
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="whitespace-nowrap cursor-pointer px-4 py-2"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Community Tag */}
              <div className="mb-4">
                <Badge 
                  variant="secondary" 
                  className="text-pink-600 bg-pink-50 border-pink-200 px-3 py-1 text-sm font-medium"
                >
                  {post.tag}
                </Badge>
              </div>

              {/* Username */}
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-900">{post.username}</span>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
                
                {post.image && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-2 border-t border-border">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Heart 
                    className={`w-4 h-4 transition-all group-hover:scale-110 ${
                      post.isLiked ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span className="text-sm">{post.likes}</span>
                </button>

                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{post.comments}</span>
                </button>

                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                  <Share className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Create Post Button */}
      <Button
        size="icon"
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-pink-500 hover:bg-pink-600"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        defaultTag={selectedTag || undefined}
      />
    </div>
  );
};

export default CommunityFeed;