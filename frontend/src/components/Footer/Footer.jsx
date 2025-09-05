import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiTwitter, FiLinkedin, FiGithub, FiRss } from 'react-icons/fi';

const Footer = () => {
  const footerSections = [
    {
      title: 'News & Analysis',
      links: [
        { name: 'Latest News', path: '/news' },
        { name: 'Market Analysis', path: '/analysis' },
        { name: 'Price Predictions', path: '/predictions' },
        { name: 'Featured Articles', path: '/features' },
        { name: 'Opinion', path: '/opinion' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms', path: '/terms' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <FiTwitter className="w-5 h-5" />, name: 'Twitter', url: 'https://twitter.com/cryptonews' },
    { icon: <FiLinkedin className="w-5 h-5" />, name: 'LinkedIn', url: 'https://linkedin.com/company/cryptonews' },
    { icon: <FiGithub className="w-5 h-5" />, name: 'GitHub', url: 'https://github.com/cryptonews' },
    { icon: <FiRss className="w-5 h-5" />, name: 'RSS', url: '/rss' },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white font-bold text-xl">Crypto Tracker</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted source for cryptocurrency news, market analysis, and educational content.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email for updates"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                  <FiMail className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>
              © {new Date().getFullYear()} Crypto Tracker. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <span className="mr-4">Made with ❤️ for the crypto community</span>
              <span className="text-xs">v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
