import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiTag, 
  FiShoppingCart, 
  FiHome, 
  FiSettings, 
  FiMenu, 
  FiX 
} from 'react-icons/fi';

const navItems = [
  { 
    name: 'Dashboard', 
    to: '/dashboard', 
    icon: FiHome 
  },
  { 
    name: 'Products', 
    to: '/products', 
    icon: FiShoppingBag,
  },
  { 
    name: 'Categories', 
    to: '/categories', 
    icon: FiTag 
  },
  { 
    name: 'Orders', 
    to: '/orders', 
    icon: FiShoppingCart 
  },
  { 
    name: 'Users', 
    to: '/users', 
    icon: FiUsers 
  },
  { 
    name: 'Settings', 
    to: '/settings', 
    icon: FiSettings 
  },
];

const Sidebar = ({ isMobileOpen, toggleMobile }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine if sidebar should be shown
  const shouldShowSidebar = !isMobile || isMobileOpen;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={twMerge(
          'fixed top-0 bottom-0 left-0 z-30 flex w-64 flex-col bg-white transition-all duration-300 shadow-md',
          isMobile ? 'transform -translate-x-full' : '',
          isMobileOpen && isMobile ? 'transform translate-x-0' : ''
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">Admin Panel</span>
          </div>
          {isMobile && (
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleMobile}
            >
              <FiX className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    twMerge(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }
                  onClick={isMobile ? toggleMobile : undefined}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isMobileOpen: PropTypes.bool.isRequired,
  toggleMobile: PropTypes.func.isRequired,
};

export default Sidebar;