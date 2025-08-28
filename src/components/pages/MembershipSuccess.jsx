import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Crown, Check, ArrowRight } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import apiService from './services/api';

const MembershipSuccess = () => {
  const { refreshUserData, isProMember } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(7);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        setLoading(true);
        
        if (sessionId) {
          // Verify the session with the backend and activate membership
          console.log('Verifying Stripe session:', sessionId);
          const verificationResult = await apiService.verifyStripeSession(sessionId);
          
          if (verificationResult.success) {
            console.log('Session verified successfully:', verificationResult);
            // Refresh user data to get updated pro status
            await refreshUserData();
          } else {
            console.error('Session verification failed:', verificationResult.message);
            // Still try to refresh user data in case webhook processed it
            await refreshUserData();
          }
        } else {
          // No session ID, wait for webhook processing
          await new Promise(resolve => setTimeout(resolve, 3000));
          await refreshUserData();
        }
        
        // Additional wait to ensure data is refreshed
        setTimeout(() => {
          setLoading(false);
          // Start countdown after loading is complete
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                navigate('/', { replace: true });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }, 1000);
        
      } catch (error) {
        console.error('Error processing successful payment:', error);
        setLoading(false);
        // Still redirect on error, but after shorter time
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    if (sessionId) {
      handleSuccess();
    } else {
      // No session ID, redirect to purchase page
      navigate('/purchase-membership', { replace: true });
    }
  }, [sessionId, refreshUserData, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center max-w-md w-full">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-gray-300 mx-auto opacity-20"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
          <p className="text-gray-600 mb-4">
            We're activating your premium membership and updating your account...
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              ✓ Payment confirmed<br/>
              ⏳ Activating pro features<br/>
              🔄 Refreshing your session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
          {/* Success Animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-green-200 animate-pulse"></div>
          </div>

          <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Pro! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Your payment was successful and your pro membership has been activated!
          </p>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">You now have access to:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Complete Learn section with structured lessons</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Premium learning materials and content</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Priority customer support</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Exclusive Pro member badge</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-lg font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              Go to Home
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => navigate('/learn', { replace: true })}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105"
            >
              <Crown className="w-5 h-5 mr-2" />
              Start Learning
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              🎉 Congratulations! You now have access to all premium features
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Automatically redirecting to home page in <span className="font-bold text-blue-800">{countdown}</span> seconds...
            </p>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="mt-6 p-3 bg-gray-50 rounded border text-xs text-gray-600">
              <p>Payment Session: {sessionId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipSuccess;