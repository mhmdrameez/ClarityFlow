export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto p-6 prose prose-sm sm:prose-base dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">ClarityLife Privacy Policy</h1>
      <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">1. Data Collection</h2>
        <p>ClarityLife does not collect or store any personal data on external servers. All data, including your wellness activities and preferences, is stored locally in your browser using local storage.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">2. How Your Data Is Used</h2>
        <p>Your data is only used locally within your browser to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Display your saved wellness activities</li>
          <li>Maintain your app preferences</li>
        </ul>
        <p className="mt-4">Your data never leaves your device.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
        <p>Since all data is stored locally, it is only as secure as your device. We recommend not sharing your device with others if you wish to keep your data private.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">4. Your Control</h2>
        <p>You have full control over your data. You can:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Clear your browser’s local storage to remove all saved data</li>
          <li>Use your browser tools to export or inspect saved data</li>
        </ul>
      </section>

      <div className="mt-12 pt-6 border-t">
        <p>This privacy policy is subject to change if the app’s data handling practices change in the future.</p>
      </div>
    </main>
  );
}
