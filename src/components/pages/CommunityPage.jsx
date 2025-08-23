import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Star, Trophy, Users, Heart, MessageSquare, TrendingUp, ChevronRight } from 'lucide-react';

const CommunityPage = () => {
  const discussions = [
    {
      id: 1,
      title: "Tips for mastering the alphabet quickly?",
      author: "SarahK",
      replies: 24,
      likes: 56,
      time: "2 hours ago",
      avatar: "/avatars/sarah.jpg",
      tags: ["learning", "tips"]
    },
    {
      id: 2,
      title: "How do you sign 'good afternoon' in your region?",
      author: "MiguelT",
      replies: 18,
      likes: 42,
      time: "5 hours ago",
      avatar: "/avatars/miguel.jpg",
      tags: ["regional", "dialects"]
    },
    {
      id: 3,
      title: "Just completed the Advanced course! 🎉",
      author: "AlexJ",
      replies: 32,
      likes: 89,
      time: "1 day ago",
      avatar: "/avatars/alex.jpg",
      tags: ["achievement"]
    },
    {
      id: 4,
      title: "Daily practice partner needed",
      author: "TaylorR",
      replies: 7,
      likes: 15,
      time: "1 day ago",
      avatar: "/avatars/taylor.jpg",
      tags: ["practice", "partner"]
    },
    {
      id: 5,
      title: "What's the most difficult sign you've learned?",
      author: "JordanM",
      replies: 41,
      likes: 103,
      time: "2 days ago",
      avatar: "/avatars/jordan.jpg",
      tags: ["challenge"]
    }
  ];

  // Sample top learners data
  const topLearners = [
    {
      id: 1,
      name: "EmmaS",
      points: 1250,
      level: "Expert",
      avatar: "/avatars/emma.jpg",
      progress: 92
    },
    {
      id: 2,
      name: "DavidL",
      points: 1120,
      level: "Advanced",
      avatar: "/avatars/david.jpg",
      progress: 88
    },
    {
      id: 3,
      name: "PriyaK",
      points: 980,
      level: "Advanced",
      avatar: "/avatars/priya.jpg",
      progress: 85
    },
    {
      id: 4,
      name: "CarlosM",
      points: 875,
      level: "Intermediate",
      avatar: "/avatars/carlos.jpg",
      progress: 78
    },
    {
      id: 5,
      name: "AishaB",
      points: 820,
      level: "Intermediate",
      avatar: "/avatars/aisha.jpg",
      progress: 75
    }
  ];

  // Sample trending topics
  const trendingTopics = [
    { name: "#RegionalVariations", posts: 142 },
    { name: "#PracticePartners", posts: 98 },
    { name: "#SignOfTheDay", posts: 210 },
    { name: "#DeafCulture", posts: 76 },
    { name: "#LearningTips", posts: 115 }
  ];

  return (
    <div className="space-y-6">
      {/* Community Stats Header */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6" />
            <span>SignLearn Community</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Connect with other learners, share tips, and grow together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">5,842</div>
              <div className="text-sm text-blue-100">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1,203</div>
              <div className="text-sm text-blue-100">Discussions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">327</div>
              <div className="text-sm text-blue-100">Practice Groups</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussions Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Recent Discussions
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussions.map((discussion) => (
                <div 
                  key={discussion.id} 
                  className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={discussion.avatar} />
                    <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{discussion.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span>@{discussion.author}</span>
                      <span>•</span>
                      <span>{discussion.time}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span>{discussion.replies}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span>{discussion.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Start New Discussion Card */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Start a New Discussion</CardTitle>
              <CardDescription>Ask questions or share your experiences with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">YO</AvatarFallback>
                  </Avatar>
                  <input 
                    type="text" 
                    placeholder="What would you like to discuss?"
                    className="flex-1 bg-transparent outline-none placeholder-gray-400"
                  />
                  <Button variant="outline">Post</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    #Question
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    #Tip
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    #Achievement
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    #Help
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Learners Card */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600" />
                  Top Learners
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {topLearners.map((learner, index) => (
                <div key={learner.id} className="flex items-center gap-3">
                  <div className="text-lg font-bold text-amber-600">#{index + 1}</div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={learner.avatar} />
                    <AvatarFallback>{learner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{learner.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">{learner.points} points</p>
                      <Badge variant="secondary" className="text-xs">
                        {learner.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Topics Card */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <span className="font-medium">{topic.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {topic.posts} posts
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Challenge Card */}
          <Card className="border-0 bg-gradient-to-br from-blue-100 to-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Weekly Challenge
              </CardTitle>
              <CardDescription>Sign 25 different words this week to earn bonus points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">18/25</div>
                  <div className="text-sm text-gray-600">words completed</div>
                </div>
                <Button variant="default">Join Challenge</Button>
              </div>
              {/* <Progress value={(18/25)*100} className="h-2 mt-4" /> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;