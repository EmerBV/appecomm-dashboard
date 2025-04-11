import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ProductsPage from '../features/products/pages/ProductsPage';
import AddProductPage from '../features/products/pages/AddProductPage';
import EditProductPage from '../features/products/pages/EditProductPage';
import ProductDetailPage from '../features/products/pages/ProductDetailPage';
import CategoriesPage from '../features/categories/pages/CategoriesPage';
import NotFoundPage from '../features/errors/pages/NotFoundPage';
import UnauthorizedPage from '../features/errors/pages/UnauthorizedPage';

// Roles constants
const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER'
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Products routes */}
            <Route path="products">
              <Route index element={<ProductsPage />} />
              <Route 
                path="add" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <AddProductPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="view/:productId" element={<ProductDetailPage />} />
              <Route 
                path="edit/:productId" 
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <EditProductPage />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* Categories routes */}
            <Route path="categories">
              <Route index element={<CategoriesPage />} />
            </Route>
            
            {/* Add more routes as needed */}
            
            {/* Catch-all for dashboard routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;