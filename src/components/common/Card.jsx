import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Card = ({ 
  children, 
  className, 
  title, 
  description, 
  footer,
  headerActions,
  noPadding = false 
}) => {
  return (
    <div className={twMerge(
      'bg-white rounded-lg shadow overflow-hidden', 
      className
    )}>
      {/* Card Header */}
      {(title || description || headerActions) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {headerActions && (
              <div className="ml-4">{headerActions}</div>
            )}
          </div>
        </div>
      )}
      
      {/* Card Body */}
      <div className={noPadding ? '' : 'px-4 py-5 sm:p-6'}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.node,
  footer: PropTypes.node,
  headerActions: PropTypes.node,
  noPadding: PropTypes.bool
};

export default Card;