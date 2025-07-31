import { WellnessCard } from "@/components/WellnessCard";
import { BookOpen, Video, FileText, ExternalLink, Heart, Baby, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const articles = [
  {
    id: 1,
    title: "The Science of Prenatal Sleep",
    description: "How quality sleep supports fetal brain development and maternal health",
    category: "Sleep",
    readTime: "5 min read",
    type: "article",
    badge: "Research-Based"
  },
  {
    id: 2,
    title: "Managing Pregnancy Mood Changes",
    description: "Understanding hormonal shifts and evidence-based coping strategies",
    category: "Mood",
    readTime: "7 min read", 
    type: "article",
    badge: "Expert Guide"
  },
  {
    id: 3,
    title: "Essential Nutrients by Trimester",
    description: "Complete guide to vitamins and supplements for pregnancy health",
    category: "Nutrition",
    readTime: "10 min read",
    type: "guide",
    badge: "Medical Review"
  },
  {
    id: 4,
    title: "Safe Exercise During Pregnancy",
    description: "Evidence-based movement practices for each trimester",
    category: "Exercise",
    readTime: "6 min read",
    type: "video",
    badge: "OB-GYN Approved"
  },
  {
    id: 5,
    title: "Understanding Prenatal Anxiety",
    description: "When mood changes signal more than hormones",
    category: "Mental Health",
    readTime: "8 min read",
    type: "article",
    badge: "Clinical Insights"
  },
  {
    id: 6,
    title: "Building Healthy Sleep Habits",
    description: "Practical techniques for better rest during pregnancy",
    category: "Sleep",
    readTime: "4 min read",
    type: "guide",
    badge: "Sleep Specialist"
  }
];

const categories = [
  { name: "All", icon: BookOpen, count: articles.length },
  { name: "Sleep", icon: Heart, count: articles.filter(a => a.category === "Sleep").length },
  { name: "Mood", icon: Brain, count: articles.filter(a => a.category === "Mood" || a.category === "Mental Health").length },
  { name: "Nutrition", icon: Baby, count: articles.filter(a => a.category === "Nutrition").length },
];

export default function Library() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "guide": return FileText;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Sleep": "sleep-primary",
      "Mood": "mood-content", 
      "Mental Health": "mood-content",
      "Nutrition": "task-primary",
      "Exercise": "primary"
    };
    return colors[category as keyof typeof colors] || "muted";
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
            Wellness Library
          </h1>
          <p className="text-muted-foreground">
            Evidence-based resources for your pregnancy wellness journey
          </p>
        </div>

        {/* Featured Resource */}
        <WellnessCard
          title="Featured: Complete Pregnancy Wellness Guide"
          icon={<BookOpen className="w-5 h-5 text-primary" />}
          className="mb-8"
        >
          <div className="space-y-4">
            <p className="text-card-foreground">
              Comprehensive guide covering mood management, sleep optimization, and essential 
              nutrients - all backed by current obstetric research and clinical practice guidelines.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Evidence-Based
              </Badge>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                OB-GYN Reviewed
              </Badge>
              <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent/20">
                12 min read
              </Badge>
            </div>
            <Button className="w-full md:w-auto">
              <ExternalLink className="w-4 h-4 mr-2" />
              Read Complete Guide
            </Button>
          </div>
        </WellnessCard>

        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                className="h-auto p-4 justify-start space-x-3 bg-card hover:bg-secondary/50"
              >
                <category.icon className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{category.count} resources</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const TypeIcon = getTypeIcon(article.type);
            return (
              <div
                key={article.id}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge 
                    variant="outline" 
                    className={`bg-${getCategoryColor(article.category)}/10 text-${getCategoryColor(article.category)} border-${getCategoryColor(article.category)}/20`}
                  >
                    {article.category}
                  </Badge>
                  <TypeIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground text-xs">
                    {article.badge}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-8 bg-muted/30 border border-border rounded-xl p-6">
          <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Medical Disclaimer
          </h3>
          <p className="text-sm text-muted-foreground">
            All content is for educational purposes only and should not replace professional medical advice. 
            Always consult with your healthcare provider about your specific pregnancy needs and concerns. 
            Content is reviewed by licensed healthcare professionals and based on current clinical guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}