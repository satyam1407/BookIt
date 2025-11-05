import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home, Calendar } from 'lucide-react';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Properly destructure with default values
  const { 
    success = false, 
    booking = null, 
    experience = null, 
    slot = null, 
    message = '' 
  } = location.state || {};

  useEffect(() => {
    // Redirect to home if no booking data AND not a success/failure message
    if (!location.state || (success === false && !message)) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location.state, success, message, navigate]);

  // Show redirect message if no state
  if (!location.state) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Home className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Redirecting to Home
          </h1>
          <p className="text-gray-600">
            No booking information found. Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        {success && booking ? (
          <>
            {/* Success State */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Your booking has been successfully confirmed. 
              {booking?.user_email && (
                <> We've sent a confirmation email to {booking.user_email}</>
              )}
            </p>

            {/* Booking Details - With Safe Navigation */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">#{booking?.id || 'N/A'}</span>
                </div>
                
                {experience && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{experience.title}</span>
                  </div>
                )}
                
                {slot && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{slot.time_slot}</span>
                    </div>
                  </>
                )}
                
                {booking?.number_of_people && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">People:</span>
                    <span className="font-medium">{booking.number_of_people}</span>
                  </div>
                )}
                
                {booking?.promo_code && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Applied:</span>
                    <span className="font-medium">{booking.promo_code}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-3 border-t border-gray-300">
                  <span className="text-lg font-bold">Total Paid:</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{booking?.final_price ? 
                      parseFloat(booking.final_price).toFixed(2) : 
                      '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span>Back to Home</span>
              </button>
              <button
                onClick={() => window.print()}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Print Confirmation</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Failure State */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Failed
            </h1>
            <p className="text-gray-600 mb-8">
              {message || 'Something went wrong. Please try again.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span>Back to Home</span>
              </button>
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
