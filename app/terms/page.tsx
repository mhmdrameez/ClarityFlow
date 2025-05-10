export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto p-6 prose prose-sm sm:prose-base dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">ClarityLife Terms of Service</h1>
      <p className="text-muted-foreground">Effective: {new Date().toLocaleDateString()}</p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>By using ClarityLife, you agree to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Use the app for personal spiritual and wellness purposes</li>
          <li>Use the app responsibly and respectfully</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">2. App Usage</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Reverse engineer, copy, or alter the app code</li>
          <li>Use automated tools to interact with the app</li>
          <li>Misuse the app in a way that goes against its intended purpose</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">3. Local Storage Only</h2>
        <p>ClarityLife does not collect, transmit, or store any personal data on external servers. All your activity and preferences remain stored locally in your browser.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">4. Spiritual Disclaimer</h2>
        <p>ClarityLife is a self-guided tool intended to support your mindfulness and worship habits. Features such as prayer tracking are user-managed.</p>
        <p className="mt-4 italic">Note: Any prayer times or reminders are approximate — always confirm with your local masjid or trusted sources.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">5. Modifications</h2>
        <p>These terms may be updated if app functionality changes. Continued use of the app implies acceptance of the latest terms.</p>
      </section>

      <div className="mt-12 pt-6 border-t">
        <p>This app is provided as-is with no guarantees. Use at your own discretion.</p>
      </div>
    </main>
  );
}
