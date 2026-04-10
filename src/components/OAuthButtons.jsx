/**
 * OAuthButtons - Social login buttons component
 * Facebook, Google, Microsoft, Apple
 */
export const OAuthButtons = ({ onGoogleSuccess, onMicrosoftClick, onAppleClick }) => {
  return (
    <div className="space-y-3">
      {/* OAuth Provider Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { name: 'Google', emoji: '🔍', color: 'hover:bg-red-50' },
          { name: 'Microsoft', emoji: '⊞', color: 'hover:bg-blue-50' },
          { name: 'Apple', emoji: '🍎', color: 'hover:bg-gray-50' },
          { name: 'GitHub', emoji: '⚫', color: 'hover:bg-gray-50' },
        ].map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() => {
              if (provider.name === 'Google') onGoogleSuccess?.();
              else if (provider.name === 'Microsoft') onMicrosoftClick?.();
              else if (provider.name === 'Apple') onAppleClick?.();
            }}
            className={`
              w-full py-3 px-2 rounded-lg border-2 border-gray-200
              flex flex-col items-center justify-center gap-1
              transition-all duration-200
              ${provider.color}
              hover:border-indigo-400
            `}
          >
            <span className="text-2xl">{provider.emoji}</span>
            <span className="text-xs font-semibold text-gray-700">{provider.name}</span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-600 font-medium">hoặc</span>
        </div>
      </div>
    </div>
  );
};

export default OAuthButtons;
