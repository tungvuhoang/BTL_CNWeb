/**
 * PlayerContainer - Reusable component for player page content
 *
 * Provides consistent styling for all player-facing pages:
 * - Centered rounded card
 * - Shadow and spacing
 * - Responsive padding
 * - White background with subtle styling
 */
export const PlayerContainer = ({ 
  children, 
  className = '',
  title,
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full ${className}`}>
      {title && (
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
};

/**
 * PlayerButton - Reusable button component for player UI
 */
export const PlayerButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 active:scale-95';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl w-full',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * PlayerInput - Reusable input component for player UI
 */
export const PlayerInput = ({
  className = '',
  ...props
}) => {
  return (
    <input
      className={`
        w-full px-4 py-3 text-lg
        rounded-lg border-2 border-gray-300
        focus:border-indigo-600 focus:outline-none
        transition-colors duration-200
        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  );
};