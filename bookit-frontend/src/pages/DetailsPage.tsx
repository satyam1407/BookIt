import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { experiencesAPI, Experience, Slot } from '../services/api';
import { ChevronLeft, Loader2, Plus, Minus } from 'lucide-react';

const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Record<string, Slot[]>>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        setLoading(true);
        const response = await experiencesAPI.getById(Number(id));
        setExperience(response.data.data.experience);
        setSlots(response.data.data.slots);
        
        // Auto-select first available date
        const dates = Object.keys(response.data.data.slots).sort();
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load experience details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperienceDetails();
    }
  }, [id]);

  const handleBooking = () => {
    if (!selectedSlot || !experience) {
      alert('Please select a date and time slot');
      return;
    }

    if (numberOfPeople > selectedSlot.available_capacity) {
      alert(`Only ${selectedSlot.available_capacity} spots available`);
      return;
    }

    // Navigate to checkout with booking details
    navigate('/checkout', {
      state: {
        experience,
        slot: selectedSlot,
        numberOfPeople,
        totalPrice: experience.price * numberOfPeople
      }
    });
  };

  const handleQuantityChange = (value: number) => {
    const newValue = Math.max(1, Math.min(value, selectedSlot?.available_capacity || 1));
    setNumberOfPeople(newValue);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Experience not found'}
        </div>
      </div>
    );
  }

  const availableDates = Object.keys(slots).sort();
  const currentSlots = selectedDate ? slots[selectedDate] : [];
  
  // Calculate totals
  const subtotal = experience.price * numberOfPeople;
  const taxes = Math.round(subtotal * 0.06); // 6% tax
  const total = subtotal + taxes;

  // Check if both date and time are selected
  const isConfirmEnabled = selectedDate && selectedSlot;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="rounded-xl overflow-hidden shadow-lg h-80">
              <img
                src={experience.image_url}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {experience.title}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {experience.description}
              </p>
            </div>

            {/* Choose Date Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose date</h2>
              <div className="flex flex-wrap gap-3">
                {availableDates.map((date) => {
                  const dateObj = new Date(date);
                  const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                  const dayNum = dateObj.getDate();
                  
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        selectedDate === date
                          ? 'bg-yellow-400 text-gray-900'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {formattedDate}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Choose Time Section */}
            {selectedDate && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose time</h2>
                <div className="flex flex-wrap gap-3">
                  {currentSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={slot.available_capacity === 0}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        selectedSlot?.id === slot.id
                          ? 'bg-yellow-400 text-gray-900'
                          : slot.available_capacity === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-sm">{slot.time_slot}</div>
                      <div className="text-xs">
                        {slot.available_capacity > 0
                          ? `${slot.available_capacity} left`
                          : 'Sold out'}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  All times are in IST (GMT +5:30)
                </p>
              </div>
            )}

            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-gray-700">
                  Scenic routes, trained guides, and safety briefing. Minimum age 10.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Price & Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20 space-y-6">
              {/* Starts At Price */}
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600">Starts at</span>
                <span className="text-3xl font-bold text-gray-900">
                  ₹{experience.price}
                </span>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(numberOfPeople - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-5 w-5 text-gray-600" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedSlot?.available_capacity || 1}
                    value={numberOfPeople}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="flex-1 text-center py-2 border-none outline-none font-semibold"
                  />
                  <button
                    onClick={() => handleQuantityChange(numberOfPeople + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                {selectedSlot && (
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedSlot.available_capacity} spots available
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold text-gray-900">₹{taxes}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Confirm Button - ACTIVE ONLY WHEN DATE & TIME SELECTED */}
              <button
                onClick={handleBooking}
                disabled={!isConfirmEnabled}
                className={`w-full font-bold py-3 px-6 rounded-lg transition-all ${
                  isConfirmEnabled
                    ? 'bg-yellow-400 hover:bg-gray-400 text-gray-900 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                }`}
              >
                Confirm
              </button>

              {/* Info Message */}
              {!isConfirmEnabled && (
                <p className="text-xs text-gray-500 text-center">
                  Please select a date and time to proceed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
