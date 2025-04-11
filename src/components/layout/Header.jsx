import { useState, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { FiMenu, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useAuth } from '../../features/auth/context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  return (
    <header className="h-16 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left section with hamburger menu */}
      <div className="flex items-center">
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
          onClick={toggleSidebar}
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>

      {/* Right section with notifications and user menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
            <span className="sr-only">Notifications</span>
            <div className="relative">
              <FiBell className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <a
                        href={notification.link}
                        className={`block px-4 py-2 text-sm ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        {notification.message}
                      </a>
                    )}
                  </Menu.Item>
                ))
              )}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* User dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center text-sm focus:outline-none">
            <span className="sr-only">Open user menu</span>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                <FiUser className="h-5 w-5" />
              </div>
              <span className="ml-2 hidden md:block font-medium text-gray-700">
                {user?.email || 'Admin User'}
              </span>
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    <FiUser className="mr-3 h-4 w-4" />
                    Your Profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/settings"
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    <FiSettings className="mr-3 h-4 w-4" />
                    Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => logout()}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    <FiLogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;