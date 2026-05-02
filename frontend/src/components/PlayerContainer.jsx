import styles from './PlayerContainer.module.css';

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
    <div className={`${styles.container} ${className}`}>
      {title && (
        <h1 className={styles.title}>
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
  const variantClass = {
    primary: styles.variantPrimary,
    secondary: styles.variantSecondary,
    danger: styles.variantDanger,
    success: styles.variantSuccess,
  }[variant] || styles.variantPrimary;

  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
    xl: styles.sizeXl,
  }[size] || styles.sizeMd;

  return (
    <button
      className={`${styles.buttonBase} ${variantClass} ${sizeClass} ${className}`}
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
      className={`${styles.inputField} ${className}`}
      {...props}
    />
  );
};