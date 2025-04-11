import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';
import Toast from '../ui/Toast';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications container */}
      <Toast />
      
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isSidebarOpen} 
        toggleMobile={toggleSidebar} 
      />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;