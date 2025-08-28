import React, { useState } from 'react';
import { Crown, Check, Star, Zap } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import apiService from './services/api';

const PurchaseMembership = () => {
  const { user, isProMember, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async (duration) => {
    try {
      setLoading(true);
      setError('');
      
      await apiService.purchaseProMembership({ duration });
      
      // Refresh user data to update pro status immediately
      await refreshUserData();
      
      setSuccess(true);
      // Navigate back to home after success
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      setError(error.message || 'Failed to purchase membership');
    } finally {
      setLoading(false);
    }
  };

  if (isProMember()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
            <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">You're Already a Pro Member!</h1>
            <p className="text-gray-600 mb-6">
              You have access to all premium features including the Learn section.
            </p>
            {user?.proMembershipExpiry && (
              <p className="text-sm text-gray-500">
                Your membership expires on: {new Date(user.proMembershipExpiry).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Pro!</h1>
            <p className="text-gray-600 mb-6">
              Your pro membership has been activated. You now have access to all premium features!
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to refresh your session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of SignLearn AI with access to premium learning materials and features
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <Star className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access to Learn Section</h3>
            <p className="text-gray-600">
              Get access to comprehensive learning materials and structured lessons
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <Zap className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Features</h3>
            <p className="text-gray-600">
              Unlock advanced features and priority support
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <Crown className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Badge</h3>
            <p className="text-gray-600">
              Show off your pro status with an exclusive badge
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">$9.99</div>
              <p className="text-gray-600">per month</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Access to Learn section</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Premium learning materials</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Priority support</span>
              </li>
            </ul>
            <button
              onClick={() => handlePurchase(30)}
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Get Monthly Pro'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg shadow-xl border-2 border-yellow-400 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Yearly Pro</h3>
              <div className="text-4xl font-bold text-white mb-1">$99.99</div>
              <p className="text-gray-300">per year</p>
              <p className="text-yellow-400 text-sm mt-1">Save $20!</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-200">Access to Learn section</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-200">Premium learning materials</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-200">Priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-200">2 months free!</span>
              </li>
            </ul>
            <button
              onClick={() => handlePurchase(365)}
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Get Yearly Pro'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>
            Note: This is a demo purchase system. In production, this would integrate with a real payment processor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseMembership;