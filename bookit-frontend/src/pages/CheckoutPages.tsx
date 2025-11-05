import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingsAPI, promoAPI } from '../services/api';
import { Loader2, ChevronLeft, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, slot, numberOfPeople, totalPrice } = location.state || {};

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice || 0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Redirect if no booking data
  if (!experience || !slot) {
    navigate('/');
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim() || formData.userName.length < 2) {
      newErrors.userName = 'Please enter a valid name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userEmail.trim() || !emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }

    if (!termsAccepted) {
      newErrors.terms = 'Please accept the terms and safety policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoMessage('Please enter a promo code');
      setPromoSuccess(false);
      return;
    }

    try {
      setValidatingPromo(true);
      setPromoMessage('');
      setPromoSuccess(false);
      
      const response = await promoAPI.validate({
        code: promoCode,
        orderAmount: totalPrice
      });

      if (response.data.success) {
        setPromoApplied(true);
        setDiscountAmount(parseFloat(response.data.data.discountAmount));
        setFinalPrice(parseFloat(response.data.data.finalAmount));
        setPromoMessage(`✓ Promo applied! You saved ₹${response.data.data.savings}`);
        setPromoSuccess(true);
      }
    } catch (error: any) {
      setPromoApplied(false);
      setPromoSuccess(false);
      setPromoMessage(error.response?.data?.message || 'Invalid promo code');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setDiscountAmount(0);
    setFinalPrice(totalPrice);
    setPromoMessage('');
    setPromoSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        experienceId: experience.id,
        slotId: slot.id,
        userName: formData.userName.trim(),
        userEmail: formData.userEmail.trim().toLowerCase(),
        userPhone: formData.userPhone.trim() || undefined,
        numberOfPeople,
        promoCode: promoApplied ? promoCode.toUpperCase() : undefined,
      };

      const response = await bookingsAPI.create(bookingData);

      if (response.data.success) {
        navigate('/result', {
          state: {
            success: true,
            booking: response.data.data,
            experience,
            slot
          }
        });
      }
    } catch (error: any) {
      navigate('/result', {
        state: {
          success: false,
          message: error.response?.data?.message || 'Booking failed. Please try again.'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const subtotal = totalPrice;
  const taxes = Math.round(subtotal * 0.06);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Checkout</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Information Card */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50 ${
                        errors.userName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.userName && (
                      <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleChange}
                      placeholder="test@test.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50 ${
                        errors.userEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.userEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>
                    )}
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    disabled={promoApplied}
                    placeholder="Promo code"
                    className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50 disabled:opacity-60 disabled:bg-gray-100`}
                  />
                  {!promoApplied ? (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={validatingPromo}
                      className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {validatingPromo ? 'Applying...' : 'Apply'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Promo Message */}
                {promoMessage && (
                  <div className={`mt-3 text-sm font-medium ${
                    promoSuccess ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {promoMessage}
                  </div>
                )}

                {/* Terms Checkbox */}
                <div className="mt-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (e.target.checked && errors.terms) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.terms;
                          return newErrors;
                        });
                      }
                    }}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    I agree to the terms and safety policy
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                )}
              </div>
            </form>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Experience Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold text-gray-900">{experience.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(slot.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-900">{slot.time_slot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Qty</span>
                  <span className="font-semibold text-gray-900">{numberOfPeople}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold text-gray-900">₹{taxes}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discountAmount}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{finalPrice}</span>
              </div>

              {/* Pay and Confirm Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !termsAccepted}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Pay and Confirm'
                )}
              </button>

              {/* Security Info */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
