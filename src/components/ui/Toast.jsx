import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

const Toast = ({ position = 'top-right', toastOptions }) => {
  return (
    <Toaster
      position={position}
      toastOptions={{
        // Default options
        id: (t) => t.message,  // Usa el mensaje como ID único

        duration: 4000,
        custom: {
          preventDuplicates: true,
          maxToasts: 5  // Limitar el número máximo de toasts
        },
        style: {
          borderRadius: '8px',
          background: '#fff',
          color: '#363636',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        
        // Style based on toast type
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#ECFDF5',
          },
          style: {
            border: '1px solid #D1FAE5',
            padding: '16px',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FEF2F2',
          },
          style: {
            border: '1px solid #FEE2E2',
            padding: '16px',
          },
        },
        loading: {
          duration: Infinity,
          iconTheme: {
            primary: '#3B82F6',
            secondary: '#EFF6FF',
          },
          style: {
            border: '1px solid #DBEAFE',
            padding: '16px',
          },
        },
        
        // Override with custom options if provided
        ...toastOptions,
      }}
    />
  );
};

Toast.propTypes = {
  position: PropTypes.oneOf([
    'top-left', 
    'top-center', 
    'top-right', 
    'bottom-left', 
    'bottom-center', 
    'bottom-right'
  ]),
  toastOptions: PropTypes.object,
};

export default Toast;