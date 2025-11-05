import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { experiencesAPI, Experience } from '../services/api';
import { Search, Loader2, MapPin } from 'lucide-react';

const HomePage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await experiencesAPI.getAll();
        setExperiences(response.data.data);
        setFilteredExperiences(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Handle search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = experiences.filter(exp =>
      exp.title.toLowerCase().includes(query) ||
      exp.location.toLowerCase().includes(query) ||
      exp.category.toLowerCase().includes(query) ||
      exp.description.toLowerCase().includes(query)
    );
    setFilteredExperiences(filtered);
  };

  // Handle Enter key in search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Experiences</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Book unforgettable adventures and create memories that last a lifetime
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar Section */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={handleSearch}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No experiences found matching your search.</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredExperiences.length}</span> experiences
              </p>
            </div>

            {/* Experiences Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredExperiences.map((experience) => (
                <div
                  key={experience.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image Container */}
                  <div className="relative h-40 overflow-hidden bg-gray-200">
                    <img
                      src={experience.image_url}
                      alt={experience.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 h-8">
                      {experience.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {experience.location}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3 h-8">
                      {experience.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-600">From</span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{experience.price}
                      </span>
                    </div>

                    {/* View Details Button */}
                    <Link
                      to={`/experience/${experience.id}`}
                      className="block w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded text-center text-sm transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
