import React from 'react';

interface BrandLogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon-only';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const isLight = theme === 'light'; // Light text on dark bg

  // Dimension mapping
  const iconSizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizeMap = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  // The circular PET Jar emblem matching petcans.in authentic logo
  const LogoIcon = (
    <div className={`relative ${iconSizeMap[size]} shrink-0 flex items-center justify-center select-none`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xs"
      >
        {/* Outer Circular Ring with subtle depth */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={isLight ? '#FFFFFF' : '#0F1E36'}
          strokeWidth="4"
          className="transition-colors"
        />
        {/* Inner subtle concentric ring */}
        <circle
          cx="50"
          cy="50"
          r="41"
          stroke="#C88214"
          strokeWidth="1.5"
          strokeDasharray="2 2"
          opacity="0.6"
        />

        {/* PET Can / Jar Silhouette */}
        {/* Cap / Lid Top */}
        <rect
          x="34"
          y="22"
          width="32"
          height="7"
          rx="2"
          fill={isLight ? '#FFFFFF' : '#0F1E36'}
          stroke="#C88214"
          strokeWidth="1.5"
        />
        
        {/* Jar Neck Collar */}
        <path
          d="M38 29 L38 34 L62 34 L62 29 Z"
          fill="#C88214"
        />

        {/* Jar Shoulder & Cylindrical Body */}
        <path
          d="M38 34 C38 37 30 40 30 45 L30 72 C30 76 34 78 40 78 L60 78 C66 78 70 76 70 72 L70 45 C70 40 62 37 62 34 Z"
          fill="none"
          stroke={isLight ? '#FFFFFF' : '#0F1E36'}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Liquid / Clarity Reflection Highlight */}
        <path
          d="M35 48 C35 48 37 54 37 68"
          stroke="#C88214"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Base Rim line */}
        <line
          x1="36"
          y1="74"
          x2="64"
          y2="74"
          stroke={isLight ? '#FFFFFF' : '#0F1E36'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {LogoIcon}
        <div className="mt-2">
          <div
            className={`font-display font-black tracking-tight leading-none ${titleSizeMap[size]} ${
              isLight ? 'text-white' : 'text-[#0F1E36]'
            }`}
          >
            PETCANS<span className="text-[#C88214]">.IN</span>
          </div>
          {showSubtitle && (
            <div
              className={`text-[9px] font-mono tracking-widest uppercase mt-1 ${
                isLight ? 'text-[#CBD5E1]' : 'text-[#71695D]'
              }`}
            >
              A Unit of Uunique • uunique.in
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal Layout
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {LogoIcon}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-display font-black tracking-tight leading-none ${titleSizeMap[size]} ${
              isLight ? 'text-white' : 'text-[#0F1E36]'
            }`}
          >
            PETCANS<span className="text-[#C88214]">.IN</span>
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 font-medium ${
              isLight ? 'text-[#94A3B8]' : 'text-[#71695D]'
            }`}
          >
            A Unit of Uunique • <span className="text-[#C88214] font-semibold">uunique.in</span>
          </span>
        )}
      </div>
    </div>
  );
};
