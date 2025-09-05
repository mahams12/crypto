import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Editor-in-Chief',
    },
    {
      name: 'Mike Chen',
      role: 'News Editor',
    },
    {
      name: 'Alex Rodriguez',
      role: 'Features Reporter',
    },
    {
      name: 'Emily Davis',
      role: 'Weekend Editor',
    },
    {
      name: 'Anthony Patrick',
      role: 'Senior Reporter',
    },
    {
      name: 'Anish Jain',
      role: 'Markets Analyst',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* About Section */}
        <section className="mb-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">About Crypto Tracker</h1>
          <p className="text-lg text-gray-300 mb-4">
            Crypto Tracker is an independent platform providing transparent insights into cryptocurrency
            markets. We started in 2019 with the mission to make digital assets more understandable for
            everyone — from beginners to professionals.
          </p>
          <p className="text-lg text-gray-300 mb-4">
            Our goal is to deliver accurate, objective, and timely reporting — going beyond the hype to
            explain, analyze and simplify the fast-evolving crypto industry.
          </p>
          <p className="text-lg text-gray-300">
            Have a tip, question or correction?{' '}
            <a href="/contact" className="text-blue-400 underline">Contact us.</a>
          </p>
        </section>

        {/* Revenue Model */}
        <section className="mb-16 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Revenue Model</h2>
          <p className="text-lg text-gray-300 mb-4">
            All content on Crypto Tracker is always free to access — no paywalls or subscriptions.
          </p>
          <p className="text-lg text-gray-300 mb-4">
            Our revenue comes from ad placements and partner content. Our editorial team operates
            independently, maintaining a strict separation between our editorial and business decisions.
          </p>
          <p className="text-lg text-gray-300">
            All paid content (sponsored content, partner content, press releases, etc.) is clearly
            marked and attributed.
          </p>
        </section>

        {/* Editorial Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Editorial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="flex items-center bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-blue-400 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
