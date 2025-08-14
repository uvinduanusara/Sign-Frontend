/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Clock, Heart, Award, CheckCircle, RotateCcw } from 'lucide-react';

const PracticePage = () => {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [streakDays, setStreakDays] = useState(7);
  const [practiceStats, setPracticeStats] = useState({
    totalPractices: 24,
    accuracy: 87,
    speed: 65,
  });

  const challenges = [
    {
      id: 1,
      title: "Quick Quiz",
      description: "Test your knowledge with 5 random signs",
      icon: Star,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      stats: {
        attempts: 12,
        bestScore: "4/5",
        lastScore: "3/5"
      }
    },
    {
      id: 2,
      title: "Speed Challenge",
      description: "Recognize signs against the clock",
      icon: Zap,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      stats: {
        attempts: 8,
        bestScore: "12 signs/min",
        lastScore: "9 signs/min"
      }
    },
    {
      id: 3,
      title: "Daily Practice",
      description: "Maintain your learning streak",
      icon: Clock,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      stats: {
        attempts: streakDays,
        bestScore: `${streakDays} day streak`,
        lastScore: "Completed today"
      }
    },
    {
      id: 4,
      title: "Perfect Recall",
      description: "Achieve 100% accuracy",
      icon: CheckCircle,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
      stats: {
        attempts: 15,
        bestScore: "98%",
        lastScore: "92%"
      }
    },
    {
      id: 5,
      title: "Marathon Mode",
      description: "Practice 25 signs without breaks",
      icon: Award,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      stats: {
        attempts: 3,
        bestScore: "18 signs",
        lastScore: "12 signs"
      }
    },
    {
      id: 6,
      title: "Favorite Signs",
      description: "Practice your saved signs",
      icon: Heart,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-100",
      stats: {
        attempts: 5,
        bestScore: "9 signs",
        lastScore: "7 signs"
      }
    }
  ];

  const startChallenge = (id) => {
    setActiveChallenge(id);
    // In a real app, you would start the selected challenge here
    console.log(`Starting challenge ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Trophy className="w-6 h-6" />
            <span>Practice Zone</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Improve your skills with interactive challenges and track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{practiceStats.totalPractices}</div>
              <div className="text-sm text-blue-100">Total Practices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{practiceStats.accuracy}%</div>
              <div className="text-sm text-blue-100">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{practiceStats.speed}%</div>
              <div className="text-sm text-blue-100">Speed Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Streak Card */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${streakDays > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            <span>Current Streak</span>
          </CardTitle>
          <CardDescription>
            {streakDays > 0 
              ? `You're on a ${streakDays}-day practice streak! Keep it up!` 
              : "Start practicing to begin your streak"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-green-600">{streakDays}</div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Days</span>
                <span>{Math.min(streakDays * 10, 100)}%</span>
              </div>
              <Progress value={Math.min(streakDays * 10, 100)} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">
                {streakDays > 0 
                  ? `${7 - streakDays} more days until next milestone` 
                  : "Practice today to start your streak"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <Card 
            key={challenge.id} 
            className={`border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow ${
              activeChallenge === challenge.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${challenge.bgColor} rounded-full flex items-center justify-center`}>
                  <challenge.icon className={`w-5 h-5 ${challenge.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">{challenge.stats.attempts}</div>
                    <div className="text-xs text-gray-500">Attempts</div>
                  </div>
                  <div>
                    <div className="font-medium">{challenge.stats.bestScore}</div>
                    <div className="text-xs text-gray-500">Best</div>
                  </div>
                  <div>
                    <div className="font-medium">{challenge.stats.lastScore}</div>
                    <div className="text-xs text-gray-500">Last</div>
                  </div>
                </div>
                <Button 
                  onClick={() => startChallenge(challenge.id)}
                  className="w-full"
                  variant={activeChallenge === challenge.id ? "default" : "outline"}
                >
                  {activeChallenge === challenge.id ? "Continue Challenge" : "Start Challenge"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Challenge Panel (would appear when a challenge is active) */}
      {activeChallenge && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Challenge: {challenges.find(c => c.id === activeChallenge).title}</span>
              <Button variant="ghost" size="sm" onClick={() => setActiveChallenge(null)}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Challenge In Progress</h3>
              <p className="text-gray-600 mb-6">
                In a real application, this would show the interactive challenge interface for {challenges.find(c => c.id === activeChallenge).title}.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline">Skip</Button>
                <Button>Submit Answer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PracticePage;