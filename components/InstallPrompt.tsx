'use client';

import { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    // Check if already installed
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone
    );

    // For Android - listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
        }
        setDeferredPrompt(null);
        setIsVisible(false);
      });
    }
  };

  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            Install ClarityLife
          </h3>
          {isIOS ? (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Tap <span className="font-bold">Share</span> then{' '}
              <span className="font-bold">Add to Home Screen</span>
            </p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Get the full app experience
            </p>
          )}
        </div>
        {!isIOS && (
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
}