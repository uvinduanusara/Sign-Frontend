/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, PlayCircle, BookOpen, Award } from 'lucide-react';

const LearnPage = () => {
  const [currentLesson, setCurrentLesson] = useState(1);
  
  const lessons = [
    { 
      id: 1, 
      title: "Basic Greetings", 
      signs: ["Hello", "Thank You", "Please", "Good Morning", "Goodbye"], 
      difficulty: "Beginner", 
      completed: true,
      progress: 100 
    },
    { 
      id: 2, 
      title: "Alphabet A-M", 
      signs: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"], 
      difficulty: "Beginner", 
      completed: true,
      progress: 100 
    },
    { 
      id: 3, 
      title: "Alphabet N-Z", 
      signs: ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], 
      difficulty: "Beginner", 
      completed: false,
      progress: 65 
    },
    { 
      id: 4, 
      title: "Numbers 1-10", 
      signs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], 
      difficulty: "Intermediate", 
      completed: false,
      progress: 30 
    },
    { 
      id: 5, 
      title: "Common Phrases", 
      signs: ["How are you?", "My name is", "Nice to meet you", "I need help", "Where is"], 
      difficulty: "Intermediate", 
      completed: false,
      progress: 15 
    },
    { 
      id: 6, 
      title: "Emergency Signs", 
      signs: ["Help", "Doctor", "Hospital", "Police", "Danger"], 
      difficulty: "Advanced", 
      completed: false,
      progress: 0 
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Learning Path</span>
            <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
              <Award className="w-4 h-4 mr-1" />
              Beginner Level
            </Badge>
          </CardTitle>
          <CardDescription>
            Complete lessons in order to unlock new content and track your progress
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            className={`hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm ${
              lesson.completed ? 'ring-2 ring-green-500/20' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {lesson.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                  )}
                  {lesson.title}
                </CardTitle>
                <Badge 
                  variant={lesson.difficulty === 'Advanced' ? 'destructive' : 
                          lesson.difficulty === 'Intermediate' ? 'warning' : 'default'}
                  className="text-xs"
                >
                  {lesson.difficulty}
                </Badge>
              </div>
              <CardDescription>
                {lesson.signs.length} signs • {lesson.completed ? 'Completed' : `${lesson.progress}% progress`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {lesson.signs.slice(0, 5).map((sign, index) => (
                  <Badge 
                    key={index} 
                    variant={lesson.completed ? "default" : "outline"}
                    className="text-xs"
                  >
                    {sign}
                  </Badge>
                ))}
                {lesson.signs.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{lesson.signs.length - 5} more
                  </Badge>
                )}
              </div>
              <Button 
                className={`w-full ${
                  lesson.completed 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={() => setCurrentLesson(lesson.id)}
              >
                {lesson.completed ? 'Review Lesson' : lesson.progress > 0 ? 'Continue' : 'Start Learning'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearnPage;