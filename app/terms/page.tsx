export default function TermsOfService() {
    return (
      <main className="max-w-3xl mx-auto p-6 prose prose-sm sm:prose-base dark:prose-invert">
        <h1 className="text-3xl font-bold mb-6">ClarityLife Terms of Service</h1>
        <p className="text-muted-foreground">Effective: {new Date().toLocaleDateString()}</p>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>By using ClarityLife, you agree to</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Use the app for personal spiritual growth</li>
            <li>Provide accurate information</li>
          </ul>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">2. App Usage</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Reverse engineer or modify the app</li>
            <li>Use automated systems to access the service</li>
            <li>Share inappropriate content through the app</li>
          </ul>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">3. Spiritual Disclaimer</h2>
          <p>ClarityLife is a tool for:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Supporting your mindfulness practice</li>
            <li>Tracking personal worship habits</li>
          </ul>
          <p className="mt-4 italic">Note: Prayer times are approximations - always verify with local masjid announcements.</p>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">4. Modifications</h2>
          <p>We may update these terms periodically. Continued use constitutes acceptance.</p>
        </section>
  
        <div className="mt-12 pt-6 border-t">
          <p>For questions, contact <a href="mailto:support@claritylife.app" className="text-blue-500 hover:underline">support@claritylife.app</a></p>
        </div>
      </main>
    );
  }