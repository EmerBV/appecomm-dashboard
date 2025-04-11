import axiosInstance from '../../../services/axiosInstance';
import { jwtDecode } from 'jwt-decode';

/**
 * Service for authentication related operations
 */
const authService = {
  /**
   * Login with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} - User data with token
   */
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      if (response.data?.data) {
        const { id, token } = response.data.data;
        
        // Store token in local storage
        localStorage.setItem('token', token);
        
        // Try to get user info from token
        let user = { id };
        try {
          const decoded = jwtDecode(token);
          user = { ...user, ...decoded };
        } catch (error) {
          console.error('Error decoding token:', error);
        }
        
        // Store user in local storage
        localStorage.setItem('user', JSON.stringify(user));
        
        return user;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  /**
   * Get current user from localStorage
   * @returns {Object|null} - User data or null if not logged in
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.logout();
      return false;
    }
  }
};

export default authService;