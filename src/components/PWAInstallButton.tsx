import { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'secondary' | 'compact';
  className?: string;
}

export function PWAInstallButton({ variant = 'secondary', className = '' }: PWAInstallButtonProps) {
  const { canPromptInstall, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (canPromptInstall) {
      await promptInstall();
    } else {
      setShowGuide(true);
    }
  };

  const baseStyles =
    variant === 'primary'
      ? 'bg-[#0F2744] text-white hover:bg-[#1E3A5F] shadow-sm'
      : variant === 'compact'
        ? 'bg-sky-50 text-[#0F2744] hover:bg-sky-100 border border-sky-200/80'
        : 'bg-white text-[#0F2744] hover:bg-sky-50/70 border border-slate-200 shadow-xs';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${baseStyles} ${className}`}
      >
        <Download className="h-4 w-4 shrink-0 text-amber-600" />
        <span>Install Offline App</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F2744]">Install Indo American School Offline App</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Save Indo American School to your device home screen for instant offline access to downloaded CBSE lessons and quizzes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label="Close install guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-sky-50/80 p-4 text-sm text-slate-700 space-y-2 border border-sky-200/70">
              {isIOS ? (
                <>
                  <p className="font-semibold text-[#0F2744] flex items-center gap-1.5">
                    <Share className="h-4 w-4 text-[#1E3A5F]" />
                    On iPhone / iPad (Safari):
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Tap the Share button in the Safari toolbar.</li>
                    <li>Scroll down and tap &ldquo;Add to Home Screen&rdquo;.</li>
                    <li>Tap &ldquo;Add&rdquo; to launch Indo American School as a standalone app.</li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="font-semibold text-[#0F2744]">On Chrome / Edge / Android:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Open the browser menu or look for the Install icon in the address bar.</li>
                    <li>Click &ldquo;Install Indo American School&rdquo; or &ldquo;Add to Home Screen&rdquo;.</li>
                    <li>Downloaded chapters remain accessible anytime without internet.</li>
                  </ol>
                </>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-xl bg-[#0F2744] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3A5F] cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
