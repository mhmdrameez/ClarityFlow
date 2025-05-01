'use client';

import { useState, useEffect } from 'react';
import { Info } from 'lucide-react'; // Assuming you're using lucide-react for icons

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

      // Show the prompt after a 5-second delay
      setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      alert(
        'To install the app, tap the "Share" button in Safari and select "Add to Home Screen".'
      );
    } else if (deferredPrompt) {
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
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleInstallClick}
        className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Install App"
      >
        <Info size={20} />
      </button>
    </div>
  );
}