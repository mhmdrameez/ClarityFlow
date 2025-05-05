export default function PrivacyPolicy() {
    return (
      <main className="max-w-3xl mx-auto p-6 prose prose-sm sm:prose-base dark:prose-invert">
        <h1 className="text-3xl font-bold mb-6">ClarityLife Privacy Policy</h1>
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>To provide our wellness services, we collect:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Wellness Data:</strong> Activities you track (meditation, gratitude, etc.)</li>
            <li><strong>Account Information:</strong> Basic profile details for personalization</li>
            <li><strong>Usage Data:</strong> How you interact with features to improve the app</li>
            <li><strong>Device Information:</strong> Basic technical data for compatibility</li>
          </ul>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Information</h2>
          <p>Your data helps us:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Deliver personalized mindfulness features</li>
            <li>Analyze trends to improve the app</li>
            <li>Provide customer support</li>
            <li>Ensure app security and prevent misuse</li>
          </ul>
          <p className="mt-4">We never sell your personal data to third parties.</p>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p>We protect your information with:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Industry-standard encryption</li>
            <li>Regular security audits</li>
            <li>Limited employee access</li>
          </ul>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Choices</h2>
          <p>You can:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Access, edit, or delete your data anytime</li>
            <li>Export your wellness history</li>
            <li>Opt-out of non-essential data collection</li>
          </ul>
        </section>
  
        <div className="mt-12 pt-6 border-t">
          <p>Contact us at <a href="mailto:privacy@claritylife.app" className="text-blue-500 hover:underline">privacy@claritylife.app</a> with any questions.</p>
        </div>
      </main>
    );
  }