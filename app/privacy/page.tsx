export default function PrivacyPolicy() {
    return (
      <main className="max-w-3xl mx-auto p-6 prose prose-sm sm:prose-base dark:prose-invert">
        <h1 className="text-3xl font-bold mb-6">ClarityLife Privacy Policy</h1>
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>ClarityLife collects minimal data to enhance your wellness journey:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Wellness Data:</strong> Prayer times, meditation sessions, gratitude entries, and dhikr counts you voluntarily record</li>
            <li><strong>Device Information:</strong> Basic device data for app functionality</li>
            <li><strong>Usage Analytics:</strong> Anonymous usage patterns to improve features</li>
          </ul>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
          <p>Your data serves your spiritual growth:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Personalize your mindfulness experience</li>
            <li>Generate progress insights and analytics</li>
            <li>Improve app functionality</li>
            <li>Never for third-party advertising</li>
          </ul>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p>We implement industry-standard measures:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Local storage encryption</li>
            <li>Secure authentication protocols</li>
            <li>Regular security audits</li>
          </ul>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
          <p>You may:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Access, update, or delete your data anytime</li>
            <li>Export your wellness records</li>
            <li>Opt-out of analytics collection</li>
          </ul>
        </section>
  
        <div className="mt-12 pt-6 border-t">
          <p>Contact us at <a href="mailto:privacy@claritylife.app" className="text-blue-500 hover:underline">privacy@claritylife.app</a> for any questions.</p>
        </div>
      </main>
    );
  }