import React from 'react';
import { Twitter, Linkedin, Github, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    
   
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Contact Us', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' }
      ]
    }
  ];

  return (
    <div className="min-h-[60vh] bg-gray-50 flex flex-col">

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Brand section */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Samvidhan.AI
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Empowering citizens with AI-driven constitutional knowledge and making India's Constitution accessible to everyone.
              </p>
              
              {/* Contact info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-2" />
                  contact@samvidhan.ai
                </div>
                
              </div>
              
              {/* Social links */}
              <div className="flex space-x-4">
                <a href="#" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-emerald-600 focus:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 rounded transition-colors duration-200">
                  <Twitter size={20} />
                </a>
                <a href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-emerald-600 focus:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 rounded transition-colors duration-200">
                  <Linkedin size={20} />
                </a>
                <a href="#" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-emerald-600 focus:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 rounded transition-colors duration-200">
                  <Github size={20} />
                </a>
              </div>
            </div>

            {/* Footer links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 pt-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-600 hover:text-emerald-700 focus:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 rounded text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-200 pt-6 pb-0">
            <div className="items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0 text-center">
                © 2025 Samvidhan.AI. All rights reserved.
              </p>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;