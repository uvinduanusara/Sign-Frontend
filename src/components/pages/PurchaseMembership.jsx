import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Crown, Check, Star, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import apiService from './services/api';

const PurchaseMembership = () => {
  const { user, isProMember, refreshUserData } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    // Check if user came back from cancelled Stripe checkout
    if (searchParams.get('cancelled') === 'true') {
      setCancelled(true);
      // Clear the URL parameter after 5 seconds
      setTimeout(() => {
        setCancelled(false);
        window.history.replaceState({}, document.title, '/purchase-membership');
      }, 5000);
    }
  }, [searchParams]);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create Stripe checkout session
      const response = await apiService.createStripeCheckoutSession();
      
      if (response.success && response.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error(response.message || 'Failed to create checkout session');
      }
      
    } catch (error) {
      console.error('Purchase failed:', error);
      setError(error.message || 'Failed to create payment session');
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
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg shadow-xl border-2 border-yellow-400">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-white mb-4">Pro Subscription</h3>
              <div className="text-5xl font-bold text-white mb-2">
                Premium Access
              </div>
              <p className="text-gray-300 text-lg">Unlock all features and learning materials</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-gray-200 text-lg">Full access to Learn section with structured lessons</span>
              </li>
              <li className="flex items-center">
                <Check className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-gray-200 text-lg">Premium learning materials and advanced content</span>
              </li>
              <li className="flex items-center">
                <Check className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-gray-200 text-lg">Priority customer support</span>
              </li>
              <li className="flex items-center">
                <Check className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-gray-200 text-lg">Exclusive Pro member badge and benefits</span>
              </li>
              <li className="flex items-center">
                <Check className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-gray-200 text-lg">Cancel anytime from your account settings</span>
              </li>
            </ul>
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-4 px-8 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-3"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Crown className="w-6 h-6 mr-2" />
                  Subscribe to Pro
                </span>
              )}
            </button>
            <p className="text-center text-sm text-gray-400 mt-4">
              You'll be redirected to Stripe for secure payment processing
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {cancelled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800 font-semibold">Payment Cancelled</p>
            </div>
            <p className="text-yellow-700">
              No charges were made to your account. You can try again when you're ready.
            </p>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>
            Secure payments powered by Stripe. Your card information is encrypted and secure.
          </p>
          <p className="mt-1">
            Cancel anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseMembership;