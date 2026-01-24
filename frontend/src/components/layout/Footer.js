import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-card mt-20 border-t border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                <img src="./logo2.png" className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-xl font-bold gradient-text">VāyuMitra</span>
            </div>
            <p className="text-slate-600 max-w-md mb-4">
              Empowering communities with AI-driven insights for cleaner air and healthier living. 
              Monitor, predict, and improve air quality together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                <Github className="w-5 h-5 text-slate-600" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                <Twitter className="w-5 h-5 text-slate-600" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                <Linkedin className="w-5 h-5 text-slate-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link></li>
              <li><Link to="/tree-impact" className="text-slate-600 hover:text-indigo-600 transition-colors">Tree Impact</Link></li>
              <li><Link to="/wildlife" className="text-slate-600 hover:text-indigo-600 transition-colors">Wildlife</Link></li>
              <li><Link to="/chatbot" className="text-slate-600 hover:text-indigo-600 transition-colors">AI Chatbot</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/green-suggestions" className="text-slate-600 hover:text-indigo-600 transition-colors">Green Tips</Link></li>
              <li><Link to="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 text-sm flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for a cleaner planet
            </p>
            <p className="text-slate-500 text-sm mt-2 md:mt-0">
              © {new Date().getFullYear()} VāyuMitra. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;