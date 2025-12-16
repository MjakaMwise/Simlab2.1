export default function BubblingFlask() {
  return (
    <div className="relative w-32 h-40 mx-auto">
      <svg viewBox="0 0 100 140" className="w-full h-full">
        <defs>
          <linearGradient id="flaskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00A9E0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <path
          d="M35 30 L35 50 L25 80 Q20 100 30 110 L70 110 Q80 100 75 80 L65 50 L65 30 Z"
          fill="url(#flaskGradient)"
          stroke="#00A9E0"
          strokeWidth="2"
          className="drop-shadow-glow-cyan"
        />

        <rect x="30" y="15" width="40" height="15" fill="#003052" stroke="#00A9E0" strokeWidth="2" rx="2" />
        <rect x="45" y="10" width="10" height="10" fill="#003052" stroke="#00A9E0" strokeWidth="2" rx="1" />
      </svg>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-accent-cyan rounded-full animate-bubble opacity-60"
            style={{
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
