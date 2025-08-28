/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Clock,
  Award,
  Target,
  X,
} from "lucide-react";
import apiService from "./services/api";

const PracticePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // Track which category is selected for modal
  const [practiceMaterials, setPracticeMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    loadPracticeMaterials();
  }, []);

  const loadPracticeMaterials = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPublicPracticeMaterials(filters);
      setPracticeMaterials(response.data || []);
      setError('');
    } catch (error) {
      console.error('Failed to load practice materials:', error);
      setError('Failed to load practice materials');
    } finally {
      setLoading(false);
    }
  };

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
  };

  const closeCategoryModal = () => {
    setSelectedCategory(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return <Star className="w-4 h-4" />;
      case 'intermediate': return <Trophy className="w-4 h-4" />;
      case 'advanced': return <Award className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="space-y-6">
        <Card className="border border-gray-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <span>Practice Materials</span>
            </CardTitle>
            <CardDescription>
              Practice sign language with interactive exercises and challenges
            </CardDescription>
          </CardHeader>
        </Card>

        {error && (
          <Card className="border border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Loading practice materials...</p>
            </CardContent>
          </Card>
        )}

        {!loading && practiceMaterials.length === 0 && (
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No practice materials available yet.</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {practiceMaterials.map((material) => (
            <Card
              key={material._id}
              className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white shadow-md hover:border-gray-900 hover:scale-105"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${getDifficultyColor(material.difficulty)} rounded-full flex items-center justify-center`}>
                      {getDifficultyIcon(material.difficulty)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{material.practiceName}</CardTitle>
                      <CardDescription>{material.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{material.category}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{material.estimatedTime}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{material.points}pts</span>
                  </div>
                  <Badge 
                    className={`text-white ${getDifficultyColor(material.difficulty)}`}
                  >
                    {material.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {material.signImages?.slice(0, 2).map((signImage, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-2 text-center"
                      >
                        <div className="bg-gray-200 h-16 rounded-md flex items-center justify-center mb-1 overflow-hidden">
                          <img 
                            src={`http://localhost:5001${signImage.imageUrl}`}
                            alt={signImage.signName}
                            className="h-full w-full object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `<span class="text-gray-500 text-sm">${signImage.signName}</span>`;
                            }}
                          />
                        </div>
                        <div className="font-medium text-sm">
                          {signImage.signName}
                        </div>
                      </div>
                    ))}
                    {material.signImages?.length === 0 && material.signs?.slice(0, 2).map((sign, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-2 text-center"
                      >
                        <div className="bg-gray-200 h-16 rounded-md flex items-center justify-center mb-1">
                          <span className="text-gray-500 text-sm">
                            No Image
                          </span>
                        </div>
                        <div className="font-medium text-sm">
                          {sign}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {material.instructions && (
                      <p><strong>Instructions:</strong> {material.instructions}</p>
                    )}
                  </div>
                  <Button
                    className="w-full bg-gray-900 hover:bg-black text-white"
                    variant="outline"
                    onClick={() => openCategoryModal(material)}
                  >
                    Practice {material.signs?.length || 0} Signs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedCategory.practiceName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{selectedCategory.category}</Badge>
                  <Badge className={`text-white ${getDifficultyColor(selectedCategory.difficulty)}`}>
                    {selectedCategory.difficulty}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {selectedCategory.estimatedTime}min • {selectedCategory.points}pts
                  </span>
                </div>
              </div>
              <Button variant="ghost" onClick={closeCategoryModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                {selectedCategory.description}
              </p>
              {selectedCategory.instructions && (
                <p className="text-sm text-gray-600 mb-6 p-3 bg-blue-50 rounded-lg">
                  <strong>Instructions:</strong> {selectedCategory.instructions}
                </p>
              )}
              
              {selectedCategory.signImages && selectedCategory.signImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedCategory.signImages.map((signImage, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 text-center"
                    >
                      <div className="bg-gray-200 h-24 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                        <img 
                          src={`http://localhost:5001${signImage.imageUrl}`}
                          alt={signImage.signName}
                          className="h-full w-full object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<span class="text-gray-500">${signImage.signName}</span>`;
                          }}
                        />
                      </div>
                      <div className="font-bold text-lg mb-1">
                        {signImage.signName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedCategory.signs?.map((sign, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 text-center"
                    >
                      <div className="bg-gray-200 h-24 rounded-md flex items-center justify-center mb-3">
                        <span className="text-gray-500">No Image</span>
                      </div>
                      <div className="font-bold text-lg mb-1">
                        {sign}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PracticePage;
