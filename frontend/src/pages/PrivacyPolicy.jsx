import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg">
            Your privacy matters to us. This Privacy Policy explains how Crypto
            Tracker collects, uses, and protects your information.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              1. Information We Collect
            </h2>
            <p>
              We may collect personal information you provide directly, such as
              your name, email address, or any details you submit through our
              forms. We also collect non-personal information, including device
              data, browser type, and usage statistics to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              2. How We Use Your Information
            </h2>
            <p>
              Your information is used to provide and improve our services,
              communicate with you, respond to inquiries, and ensure a safe and
              reliable experience on Crypto Tracker.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              3. Sharing of Information
            </h2>
            <p>
              We do not sell or rent your personal information. We may share it
              with trusted partners or service providers to operate our platform
              or comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              4. Data Security
            </h2>
            <p>
              We use industry-standard measures to protect your data. However,
              no method of transmission or storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              5. Cookies & Tracking
            </h2>
            <p>
              Crypto Tracker uses cookies and similar tracking technologies to
              enhance your browsing experience and gather analytics to improve
              our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              6. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of those sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              7. Your Rights
            </h2>
            <p>
              You have the right to access, update, or delete your personal
              information. Please contact us if you wish to exercise any of
              these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              8. Updates to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be
              posted here with the updated date at the top of the page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              9. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or how your
              data is handled, please contact us at{" "}
              <a
                href="mailto:privacy@cryptotracker.com"
                className="text-blue-400 hover:text-blue-300"
              >
                privacy@cryptotracker.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
