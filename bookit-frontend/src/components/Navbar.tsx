import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">BookIt</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            {/* <a href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Experiences
            </a>
            <a href="/checkout" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
            <a href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </a> */}
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Experiences
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </Link>
          </div>
          
          <button className="btn-primary">
            Sign In
          </button>
        </div>
      </div>
    </nav>
    // <div className=''>hi</div>
  );
};

export default Navbar;
