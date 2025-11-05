import { Heart, Users, Zap, Globe, Award, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Adventures',
      description: 'We believe travel experiences create lasting memories and transform lives.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a community where travelers can share their experiences and discover new adventures.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Using cutting-edge technology to make booking experiences seamless and accessible.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting people from around the world to local experiences and hidden gems.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Co-Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      bio: 'Travel enthusiast with 10+ years in tourism industry'
    },
    {
      name: 'Michael Chen',
      role: 'Co-Founder & CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      bio: 'Full-stack developer passionate about building scalable solutions'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      bio: 'Expert in logistics and customer experience management'
    },
    {
      name: 'David Lee',
      role: 'Experience Curator',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      bio: 'Adventure planner with expertise in travel marketing'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Bookings Completed' },
    { number: '200+', label: 'Unique Experiences' },
    { number: '35+', label: 'Cities Across India' },
    { number: '4.8★', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section*/}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">About BookIt</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We're on a mission to make unforgettable travel experiences accessible to everyone. 
            From adventure seekers to culture enthusiasts, BookIt connects you with the best experiences.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-blue-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To revolutionize the way people discover and book travel experiences by providing 
                a seamless platform that connects adventurers with unforgettable moments. We believe 
                that everyone deserves access to extraordinary experiences that enrich their lives.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-purple-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Globe className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To become the world's most trusted platform for booking unique travel experiences, 
                empowering local communities and creating positive social impact through sustainable 
                tourism and cultural exchange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <Icon className="h-10 w-10 text-primary-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-primary-600 font-semibold text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary-200 top-0 bottom-0"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* 2020 */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-0">
                <div className="md:w-1/2 md:text-right md:pr-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-bold text-primary-600 mb-2">2020</h3>
                    <p className="text-gray-600">BookIt founded with a vision to revolutionize travel bookings</p>
                  </div>
                </div>
                <div className="hidden md:flex md:w-1/2"></div>
              </div>

              {/* 2021 */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-0 md:flex-row-reverse">
                <div className="md:w-1/2 md:pl-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-bold text-primary-600 mb-2">2021</h3>
                    <p className="text-gray-600">Launched in 5 cities across India with 50+ experiences</p>
                  </div>
                </div>
                <div className="hidden md:flex md:w-1/2"></div>
              </div>

              {/* 2022 */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-0">
                <div className="md:w-1/2 md:text-right md:pr-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-bold text-primary-600 mb-2">2022</h3>
                    <p className="text-gray-600">Expanded to 20 cities with 150+ experiences and 20K+ bookings</p>
                  </div>
                </div>
                <div className="hidden md:flex md:w-1/2"></div>
              </div>

              {/* 2024 */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-0 md:flex-row-reverse">
                <div className="md:w-1/2 md:pl-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-bold text-primary-600 mb-2">2024</h3>
                    <p className="text-gray-600">Reached 50K+ bookings across 35 cities in India</p>
                  </div>
                </div>
                <div className="hidden md:flex md:w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have experienced unforgettable moments with BookIt
          </p>
          <button className="bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors">
            Explore Experiences
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
