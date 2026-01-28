import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate=useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [spawnedBubbles, setSpawnedBubbles] = useState([]);
  const [bubbleClickCounts, setBubbleClickCounts] = useState({});

  const handleNavigation = (path) => {
    // In your actual app, this would use navigate(path)
    navigate(`${path}`);
  };

  const handleSectionClick = useCallback((e) => {
    // Only trigger if clicking on the background, not on buttons or other elements
    if (e.target === e.currentTarget || e.target.closest('.bubble-container')) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Random pollutant for spawned bubbles
      const pollutants = ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'O₃'];
      const pollutant = pollutants[Math.floor(Math.random() * pollutants.length)];
      const colors = {
        'PM2.5': { border: 'border-red-200', bg: 'bg-gradient-to-br from-red-50 to-red-100/40', text: 'text-red-600' },
        'PM10': { border: 'border-orange-200', bg: 'bg-gradient-to-br from-orange-50 to-orange-100/40', text: 'text-orange-600' },
        'NO₂': { border: 'border-amber-200', bg: 'bg-gradient-to-br from-amber-50 to-amber-100/40', text: 'text-amber-600' },
        'SO₂': { border: 'border-purple-200', bg: 'bg-gradient-to-br from-purple-50 to-purple-100/40', text: 'text-purple-600' },
        'O₃': { border: 'border-sky-200', bg: 'bg-gradient-to-br from-sky-50 to-sky-100/40', text: 'text-sky-600' }
      };
      const color = colors[pollutant];

      // Reduced number of bubbles per click for better performance
      const spawnCount = 6 + Math.floor(Math.random() * 3);

      // Create new bubbles with unique timestamp
      const timestamp = Date.now();
      const newBubbles = Array.from({ length: spawnCount }, (_, i) => {
        const angle = (Math.PI * 2 * i) / spawnCount + Math.random() * 0.3;
        
        return {
          id: `spawn-${timestamp}-${i}`,
          x: x,
          y: y,
          pollutant,
          color,
          size: 30 + Math.random() * 20,
          offsetX: Math.cos(angle) * (40 + Math.random() * 30),
          offsetY: Math.sin(angle) * (40 + Math.random() * 30) - 100
        };
      });

      setSpawnedBubbles(prev => [...prev, ...newBubbles]);

      // Remove bubbles after animation completes
      setTimeout(() => {
        setSpawnedBubbles(prev => 
          prev.filter(bubble => !bubble.id.startsWith(`spawn-${timestamp}`))
        );
      }, 1800);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              V
            </div>
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-indigo-600">
              VayuMitra
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => handleNavigation("/login")}
              className="text-gray-700 hover:text-gray-900 font-medium px-3 md:px-5 py-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              Login
            </button>
            <button 
              onClick={() => handleNavigation("/signup")}
              className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="pt-32 pb-20 px-6 relative overflow-hidden cursor-crosshair"
        onClick={handleSectionClick}
      >
        {/* Animated Background with Air Quality Bubbles */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 via-emerald-50 to-green-50 bubble-container">
          {/* Rising bubbles with pollutants */}
          {Array.from({ length: 25 }, (_, i) => {
            const pollutants = ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'O₃'];
            const pollutant = pollutants[Math.floor(Math.random() * pollutants.length)];
            const colors = {
              'PM2.5': { border: 'border-red-200', bg: 'bg-gradient-to-br from-red-50 to-red-100/40', text: 'text-red-600' },
              'PM10': { border: 'border-orange-200', bg: 'bg-gradient-to-br from-orange-50 to-orange-100/40', text: 'text-orange-600' },
              'NO₂': { border: 'border-amber-200', bg: 'bg-gradient-to-br from-amber-50 to-amber-100/40', text: 'text-amber-600' },
              'SO₂': { border: 'border-purple-200', bg: 'bg-gradient-to-br from-purple-50 to-purple-100/40', text: 'text-purple-600' },
              'O₃': { border: 'border-sky-200', bg: 'bg-gradient-to-br from-sky-50 to-sky-100/40', text: 'text-sky-600' }
            };
            const color = colors[pollutant];
            const size = 50 + Math.random() * 40;
            const bubbleId = `bubble-${i}`;
            
            return (
              <div
                key={i}
                id={bubbleId}
                className={`absolute rounded-full border ${color.border} ${color.bg} backdrop-blur-sm shadow-sm pointer-events-none`}
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '-100px',
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `rise ${6 + Math.random() * 5}s linear infinite`,
                  animationDelay: `${Math.random() * 4}s`
                }}
              >
                <span className={`absolute inset-0 flex items-center justify-center ${color.text} font-semibold text-xs`}>
                  {pollutant}
                </span>
              </div>
            );
          })}

          {/* Spawned bubbles from clicks */}
          {spawnedBubbles.map(bubble => (
            <div
              key={bubble.id}
              className={`absolute rounded-full border ${bubble.color.border} ${bubble.color.bg} backdrop-blur-sm shadow-sm pointer-events-none will-change-transform`}
              style={{
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                transform: 'translate(-50%, -50%)',
                animation: 'spawnFloat 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                '--offset-x': `${bubble.offsetX}px`,
                '--offset-y': `${bubble.offsetY}px`
              }}
            >
              <span className={`absolute inset-0 flex items-center justify-center ${bubble.color.text} font-semibold text-xs`}>
                {bubble.pollutant}
              </span>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/90 backdrop-blur-sm text-emerald-700 rounded-full text-sm font-semibold">
            <span className="text-lg">🌍</span>
            AI-Powered Urban Air Quality Intelligence
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
            VayuMitra
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Helping <span className="font-semibold text-emerald-600">citizens breathe safer</span> and <span className="font-semibold text-indigo-600">governments make data-driven</span> environmental decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 pointer-events-auto">
            <button 
              onClick={() => handleNavigation("/signup")}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">🌱</span>
              Continue as Citizen
            </button>
            <button 
              onClick={() => handleNavigation("/signup")}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">🏛️</span>
              Continue as Government
            </button>
          </div>

          <div className="pt-4 pointer-events-auto">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button 
                onClick={() => handleNavigation("/login")}
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        <style>{`
          @keyframes rise {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            50% { opacity: 1; }
            100% { transform: translateY(-120vh) scale(0.8); opacity: 0; }
          }
          
          @keyframes spawnFloat {
            0% { 
              transform: translate(-50%, -50%) scale(1); 
              opacity: 1; 
            }
            100% { 
              transform: translate(calc(-50% + var(--offset-x)), calc(-50% + var(--offset-y))) scale(0.3); 
              opacity: 0; 
            }
          }
          
          .will-change-transform {
            will-change: transform, opacity;
          }
        `}</style>
      </section>

      {/* Role Split Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Who Is This For?
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Tailored experiences for different stakeholders
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Citizen Card */}
            <div 
              onMouseEnter={() => setHoveredCard('citizen')}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-emerald-200"
            >
              <div className="text-5xl mb-4">🧍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Citizens</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Live Air Quality</h4>
                    <p className="text-gray-600 text-sm">Real-time monitoring of your city's air</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Health Alerts</h4>
                    <p className="text-gray-600 text-sm">Personalized pollution warnings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Green Lifestyle Tips</h4>
                    <p className="text-gray-600 text-sm">Sustainable living suggestions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌳</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Environmental Impact</h4>
                    <p className="text-gray-600 text-sm">Track trees and wildlife benefits</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleNavigation("/signup")}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                👉 Explore Citizen Dashboard
              </button>
            </div>

            {/* Government Card */}
            <div 
              onMouseEnter={() => setHoveredCard('government')}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-indigo-200"
            >
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Government Bodies</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">City-Wide Analytics</h4>
                    <p className="text-gray-600 text-sm">Comprehensive air quality data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hotspot Detection</h4>
                    <p className="text-gray-600 text-sm">Identify pollution problem areas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔮</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Policy Simulation</h4>
                    <p className="text-gray-600 text-sm">Forecast environmental impacts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📑</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Reports & Exports</h4>
                    <p className="text-gray-600 text-sm">Professional documentation tools</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleNavigation("/signup")}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                👉 Access Government Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why VayuMitra Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Why VayuMitra?
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-3xl mx-auto">
            VayuMitra bridges the gap between citizens and policymakers using transparent, explainable insights.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-bold text-gray-900 mb-2">Data-Driven Insights</h3>
              <p className="text-gray-600 text-sm">AI-powered analytics for accurate environmental monitoring</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="font-bold text-gray-900 mb-2">Citizen-Centric</h3>
              <p className="text-gray-600 text-sm">Empowering communities with actionable information</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">Decision Support</h3>
              <p className="text-gray-600 text-sm">Tools for authorities to create effective policies</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all text-center">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="font-bold text-gray-900 mb-2">Sustainable Design</h3>
              <p className="text-gray-600 text-sm">Scalable solution for long-term impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl md:text-2xl opacity-90">
            Join thousands making data-driven environmental decisions
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={() => handleNavigation("/signup")}
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              🌱 Continue as Citizen
            </button>
            <button 
              onClick={() => handleNavigation("/signup")}
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              🏛️ Continue as Government
            </button>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => handleNavigation("/login")}
              className="text-white hover:text-gray-200 font-semibold underline text-lg"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                  V
                </div>
                <span className="text-2xl font-bold text-white">VayuMitra</span>
              </div>
              <p className="text-gray-400">
                AI-powered urban air quality intelligence for healthier cities and informed policy decisions.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleNavigation("/signup")} className="hover:text-white transition">Sign up</button></li>
                <li><button onClick={() => handleNavigation("/login")} className="hover:text-white transition">Login</button></li>
                {/* <li><button onClick={() => handleNavigation("/contact")} className="hover:text-white transition">Contact</button></li> */}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleNavigation("/signup")}
                    className="hover:text-white transition"
                  >
                    Sign Up
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation("/login")}
                    className="hover:text-white transition"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2026 VayuMitra. Built for a sustainable future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;