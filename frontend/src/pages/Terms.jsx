import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-lg">
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Crypto Tracker website.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Crypto Tracker, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. License to Use</h2>
            <p>
              You are granted a limited license to use the Crypto Tracker site for personal, non-commercial purposes only. You may not:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose;</li>
              <li>remove copyright or proprietary notices;</li>
              <li>transfer the materials to another person or replicate them.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Conduct</h2>
            <p>
              You agree not to misuse our services or interfere with them. Prohibited behavior includes harassing, infringing on the rights of others, or disrupting the integrity or performance of Crypto Tracker.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Intellectual Property</h2>
            <p>
              All design, text, graphics, logos, and content are the property of Crypto Tracker or licensed to us and are protected under applicable laws. You may not reproduce or distribute such materials without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Third-Party Links</h2>
            <p>
              Our site may contain links to external sites. We are not responsible for the content or practices of those third-party websites. Accessing them is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Termination</h2>
            <p>
              We may suspend or terminate access to our service for any violation of these Terms, or if we determine continued access poses risk to us or others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
            <p>
              Crypto Tracker and its affiliates are not liable for any indirect, incidental, or consequential damages arising from your use of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms at any time. The updated version will be posted here, and your continued use constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Governing Law</h2>
            <p>
              These Terms shall be governed in accordance with the laws of [Your Jurisdiction] without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@cryptotracker.com" className="text-blue-400 hover:text-blue-300">
                legal@cryptotracker.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
