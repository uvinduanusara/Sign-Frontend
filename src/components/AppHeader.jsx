import React from "react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Crown } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">SL</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SignLearn AI</h1>
              <p className="text-sm text-gray-600">
                Interactive Sign Language Learning
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800"
            >
              <Crown className="w-3 h-3 mr-1" />
              Pro Member
            </Badge>
            <Avatar>
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback className="bg-blue-600 text-white">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
