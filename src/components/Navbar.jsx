import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, Camera, Trophy, Users } from 'lucide-react';

const NavBar = () => {
  return (
    <Tabs defaultValue="detect" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="detect" asChild>
          <Link to="/detect" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Detect
          </Link>
        </TabsTrigger>
        <TabsTrigger value="learn" asChild>
          <Link to="/learn" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Learn
          </Link>
        </TabsTrigger>
        <TabsTrigger value="practice" asChild>
          <Link to="/practice" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Practice
          </Link>
        </TabsTrigger>
        <TabsTrigger value="community" asChild>
          <Link to="/community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NavBar;