import styles from './OAuthButtons.module.css';

/**
 * OAuthButtons - Social login buttons component
 * Facebook, Google, Microsoft, Apple
 */
export const OAuthButtons = ({ onGoogleSuccess, onMicrosoftClick, onAppleClick }) => {
  return (
    <div className={styles.container}>
      {/* OAuth Provider Buttons */}
      <div className={styles.grid}>
        {[
          { name: 'Google', emoji: '🔍', color: styles.hoverRed },
          { name: 'Microsoft', emoji: '⊞', color: styles.hoverBlue },
          { name: 'Apple', emoji: '🍎', color: styles.hoverGray },
          { name: 'GitHub', emoji: '⚫', color: styles.hoverGray },
        ].map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() => {
              if (provider.name === 'Google') onGoogleSuccess?.();
              else if (provider.name === 'Microsoft') onMicrosoftClick?.();
              else if (provider.name === 'Apple') onAppleClick?.();
            }}
            className={`${styles.button} ${provider.color}`}
          >
            <span className={styles.icon}>{provider.emoji}</span>
            <span className={styles.label}>{provider.name}</span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className={styles.divider}>
        <div className={styles.dividerLineContainer}>
          <div className={styles.dividerLine}></div>
        </div>
        <div className={styles.dividerTextContainer}>
          <span className={styles.dividerText}>hoặc</span>
        </div>
      </div>
    </div>
  );
};

export default OAuthButtons;
