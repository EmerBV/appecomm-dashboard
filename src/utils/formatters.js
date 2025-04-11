/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} [currency='USD'] - The currency code
 * @param {string} [locale='en-US'] - The locale for formatting
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    if (amount === null || amount === undefined) return '-';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${amount}`;
    }
  };
  
  /**
   * Format a date
   * @param {string|Date} date - The date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @param {string} [locale='en-US'] - The locale for formatting
   * @returns {string} - Formatted date string
   */
  export const formatDate = (date, options = {}, locale = 'en-US') => {
    if (!date) return '-';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      const defaultOptions = {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        ...options
      };
      
      return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(date);
    }
  };
  
  /**
   * Format a number
   * @param {number} number - The number to format
   * @param {Object} options - Intl.NumberFormat options
   * @param {string} [locale='en-US'] - The locale for formatting
   * @returns {string} - Formatted number string
   */
  export const formatNumber = (number, options = {}, locale = 'en-US') => {
    if (number === null || number === undefined) return '-';
    
    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (error) {
      console.error('Error formatting number:', error);
      return String(number);
    }
  };
  
  /**
   * Truncate text to a specific length
   * @param {string} text - The text to truncate
   * @param {number} length - Maximum length
   * @param {string} [suffix='...'] - Suffix to add when truncated
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, length, suffix = '...') => {
    if (!text) return '';
    
    if (text.length <= length) return text;
    
    return text.substring(0, length) + suffix;
  };
  
  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @param {number} [decimals=2] - Number of decimal places
   * @returns {string} - Formatted file size
   */
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };