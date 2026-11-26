import { SCHOOL_BRAND, SCHOOL_IMAGES } from '../config/schoolImages';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  tone?: 'dark' | 'light';
}

export function Logo({ size = 'md', showTagline = false, tone = 'dark' }: LogoProps) {
  const iconBox = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const textSize = size === 'sm' ? 'text-base sm:text-lg' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl';
  const titleColor = tone === 'light' ? 'text-white' : 'text-[#0F2744]';
  const accentColor = tone === 'light' ? 'text-amber-300' : 'text-amber-600';
  const taglineColor = tone === 'light' ? 'text-sky-100' : 'text-slate-500';

  return (
    <div className="inline-flex items-center gap-3 shrink-0">
      {SCHOOL_IMAGES.logo.customLogoSrc ? (
        <img
          src={SCHOOL_IMAGES.logo.customLogoSrc}
          alt={SCHOOL_IMAGES.logo.alt}
          className={`${iconBox} rounded-xl object-contain bg-white border border-amber-200/80 p-0.5 shadow-xs shrink-0`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`${iconBox} rounded-xl bg-gradient-to-br from-[#0F2744] via-[#1E3A5F] to-[#1D4ED8] flex items-center justify-center shadow-sm border border-amber-400/50 text-white shrink-0`}
          aria-label={SCHOOL_IMAGES.logo.alt}
        >
          <svg viewBox="0 0 36 36" fill="none" className="h-6 w-6" aria-hidden="true">
            <path
              d="M18 4L30 8.5V17.5C30 25 24.8 30.2 18 32.5C11.2 30.2 6 25 6 17.5V8.5L18 4Z"
              fill="#1E3A5F"
              stroke="#FBBF24"
              strokeWidth="1.6"
            />
            <path
              d="M11 13.5C11 12.67 11.67 12 12.5 12H17.2V23.2C15.6 22.5 13.8 22.1 12 22.1C11.45 22.1 11 21.65 11 21.1V13.5Z"
              fill="#FFFFFF"
              fillOpacity="0.95"
            />
            <path
              d="M25 13.5C25 12.67 24.33 12 23.5 12H18.8V23.2C20.4 22.5 22.2 22.1 24 22.1C24.55 22.1 25 21.65 25 21.1V13.5Z"
              fill="#DBEAFE"
              fillOpacity="0.9"
            />
            <path
              d="M18 7.6L19 10H21.5L19.5 11.4L20.3 13.8L18 12.3L15.7 13.8L16.5 11.4L14.5 10H17L18 7.6Z"
              fill="#FBBF24"
            />
          </svg>
        </div>
      )}
      <div className="leading-tight">
        <div className={`font-display font-bold tracking-tight ${titleColor} ${textSize}`}>
          Indo American <span className={accentColor}>School</span>
        </div>
        {showTagline && (
          <p className={`text-[11px] font-medium ${taglineColor} whitespace-nowrap`}>
            {SCHOOL_BRAND.tagline}
          </p>
        )}
      </div>
    </div>
  );
}
