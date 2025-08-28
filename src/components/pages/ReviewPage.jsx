import { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthContext';
import { toast } from 'sonner';
import { Star, StarIcon, User, Calendar, MessageSquare, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import apiService from './services/api';

export default function ReviewPage() {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Form states
  const [reviewForm, setReviewForm] = useState({
    reviewBody: '',
    rating: 5
  });

  // Fetch public reviews and user's own review
  useEffect(() => {
    fetchPublicReviews();
    if (isAuthenticated) {
      fetchUserReview();
    }
  }, [isAuthenticated]);

  const fetchPublicReviews = async () => {
    try {
      const data = await apiService.getPublicReviews();
      
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const data = await apiService.getUserReview();
      if (data.success) {
        setUserReview(data.review);
        setReviewForm({
          reviewBody: data.review.reviewBody,
          rating: data.review.rating
        });
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
      // User might not have a review yet, which is fine
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (reviewForm.reviewBody.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    setSubmitting(true);

    try {
      let data;
      if (userReview) {
        data = await apiService.updateUserReview(reviewForm);
      } else {
        data = await apiService.createReview(reviewForm);
      }

      if (data.success) {
        toast.success(data.message);
        setUserReview(data.review);
        setEditing(false);
        // Refresh public reviews to potentially show the new review
        fetchPublicReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      const data = await apiService.deleteUserReview();

      if (data.success) {
        toast.success(data.message);
        setUserReview(null);
        setReviewForm({ reviewBody: '', rating: 5 });
        fetchPublicReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
            disabled={!interactive}
          >
            {star <= rating ? (
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarIcon className="w-5 h-5 text-gray-300" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Approval' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.color} text-xs`}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reviews & Testimonials
          </h1>
          <p className="text-gray-600">
            Share your experience with our Sign Language Detection platform
          </p>
        </div>

        {/* User's Review Section */}
        {isAuthenticated && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Your Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userReview && !editing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {renderStars(userReview.rating)}
                      {getStatusBadge(userReview.status)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteReview}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700">{userReview.reviewBody}</p>
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(userReview.createdAt)}
                    {userReview.updatedAt !== userReview.createdAt && 
                      ` • Updated on ${formatDate(userReview.updatedAt)}`
                    }
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    {renderStars(reviewForm.rating, true, (rating) => 
                      setReviewForm(prev => ({ ...prev, rating }))
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.reviewBody}
                      onChange={(e) => setReviewForm(prev => ({ 
                        ...prev, 
                        reviewBody: e.target.value 
                      }))}
                      placeholder="Share your experience with our platform..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      minLength="10"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 10 characters ({reviewForm.reviewBody.length}/10)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={submitting || reviewForm.reviewBody.trim().length < 10}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {submitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
                    </Button>
                    
                    {editing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setReviewForm({
                            reviewBody: userReview.reviewBody,
                            rating: userReview.rating
                          });
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Share Your Experience
                </h3>
                <p className="text-blue-700 mb-4">
                  Log in to submit your review and help other users learn about our platform
                </p>
                <Button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Log In to Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Public Reviews */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What Our Users Say ({reviews.length} reviews)
          </h2>
          
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to share your experience with our platform!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <Card key={review._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {review.userId?.profile ? (
                          <img
                            src={review.userId.profile}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {review.userName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">
                          {review.reviewBody}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}