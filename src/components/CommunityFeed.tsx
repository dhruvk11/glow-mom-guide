import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Post {
  id: string;
  username: string;
  tag: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    username: 'Nurturing Nest',
    tag: 'Trimester 2 Support',
    timeAgo: '2h',
    content: 'Feeling overwhelmed by the sheer volume of baby gear out there! Any recommendations for must-have items that truly made a difference for you? Trying to keep it minimalist but practical. 🙏',
    likes: 85,
    comments: 12,
    isLiked: false,
  },
  {
    id: '2',
    username: 'Mama Bear Club',
    tag: 'New Moms Connect',
    timeAgo: '4h',
    content: 'Just hit 28 weeks! So excited and a little nervous. Sharing a photo of my growing bump. What\'s one piece of advice you\'d give to your 28-week pregnant self?',
    image: '/placeholder.svg',
    likes: 85,
    comments: 12,
    isLiked: false,
  },
  {
    id: '3',
    username: 'Expecting Joy',
    tag: 'First Trimester Tips',
    timeAgo: '4h',
    content: 'Morning sickness hitting hard this week. Found that ginger tea and small frequent meals really help. What are your go-to remedies? 💚',
    likes: 42,
    comments: 8,
    isLiked: true,
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

  const filteredPosts = posts.filter(post => {
    const matchesTag = !selectedTag || post.tag === selectedTag;
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <Card key={post.id} className="p-4 hover:shadow-lg transition-shadow">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{post.username}</span>
                    <span className="text-muted-foreground text-sm">·</span>
                    <span className="text-muted-foreground text-sm">{post.timeAgo}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {post.tag}
                  </Badge>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
                
                {post.image && (
                  <div className="mt-3 rounded-lg overflow-hidden">
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
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default CommunityFeed;