import toast from 'react-hot-toast';

/**
 * Custom hook to provide toast notifications with predefined styles
 */
const useToast = () => {
  /**
   * Show a success toast notification
   * @param {string} message - The message to display
   * @param {Object} options - Additional toast options
   */
  const success = (message, options = {}) => {
    toast.success(message, options);
  };

  /**
   * Show an error toast notification
   * @param {string} message - The message to display
   * @param {Object} options - Additional toast options
   */
  const error = (message, options = {}) => {
    // Añadir un ID basado en el mensaje para prevenir duplicados
    const id = options.id || `error-${message}`;
    // Verificar si ya existe este toast
    if (!toast.isActive(id)) {
      toast.error(message, { ...options, id });
    }
  };

  /**
   * Show a loading toast notification
   * @param {string} message - The message to display
   * @param {Object} options - Additional toast options
   * @returns {string} - Toast ID that can be used to dismiss the toast
   */
  const loading = (message, options = {}) => {
    return toast.loading(message, options);
  };

  /**
   * Show a custom toast notification
   * @param {Function} content - Function that returns JSX for custom toast
   * @param {Object} options - Additional toast options
   * @returns {string} - Toast ID that can be used to dismiss the toast
   */
  const custom = (content, options = {}) => {
    return toast.custom(content, options);
  };

  /**
   * Dismiss a specific toast or all toasts
   * @param {string} toastId - ID of toast to dismiss, or undefined to dismiss all
   */
  const dismiss = (toastId) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    success,
    error,
    loading,
    custom,
    dismiss,
    promise: toast.promise
  };
};

export default useToast;