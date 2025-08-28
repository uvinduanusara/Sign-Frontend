import React from "react";
import { Search, Filter, Eye, EyeOff, Trash2, Star } from "lucide-react";

export default function ReviewsModule({ 
  reviews, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  onReviewStatusUpdate, 
  onReviewDelete, 
  onRefresh 
}) {
  const handleDeleteReview = (id) => {
    if (onReviewDelete) {
      onReviewDelete(id);
    }
  };

  const handleStatusUpdate = (id, status) => {
    if (onReviewStatusUpdate) {
      onReviewStatusUpdate(id, status);
    }
  };

  const filteredReviews = Array.isArray(reviews) ? reviews.filter(review => {
    if (!review) return false;
    
    const userName = review.userName || '';
    const comment = review.comment || '';
    
    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">User Reviews</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading reviews...
                </td>
              </tr>
            ) : filteredReviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              filteredReviews.map(review => (
              <tr key={review._id || review.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {review.userName || 'Unknown User'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-500">({review.rating || 0})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-md truncate">
                    {review.comment || 'No comment'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${(review.status || 'pending') === 'approved' ? 'bg-green-100 text-green-800' : 
                      (review.status || 'pending') === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {review.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-green-600 hover:text-green-900 mr-3"
                    onClick={() => handleStatusUpdate(review._id || review.id, 'approved')}
                    disabled={loading}
                  >
                    <Eye className="h-4 w-4 inline" /> Approve
                  </button>
                  <button 
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                    onClick={() => handleStatusUpdate(review._id || review.id, 'rejected')}
                    disabled={loading}
                  >
                    <EyeOff className="h-4 w-4 inline" /> Reject
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteReview(review._id || review.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 inline" /> Delete
                  </button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}