import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, Target, Users, Award, Wind, Brain, Heart } from 'lucide-react';
import Card from '../components/common/Card';

const About = () => {
  const values = [
    { icon: Wind, title: 'Clean Air', description: 'Committed to reducing pollution and improving air quality for all' },
    { icon: Brain, title: 'AI Innovation', description: 'Leveraging cutting-edge technology to predict and prevent pollution' },
    { icon: Heart, title: 'Community First', description: 'Empowering communities with data and insights for collective action' },
    { icon: Award, title: 'Excellence', description: 'Delivering accurate, reliable, and actionable environmental data' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-4">
          <Info className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">About VāyuMitra</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Pioneering the future of air quality monitoring with artificial intelligence and community engagement
        </p>
      </motion.div>

      {/* Mission Section */}
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              AirCare AI was founded with a simple yet powerful mission: to make clean air accessible to everyone through the power of artificial intelligence and data-driven insights.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We believe that by combining advanced AI technology with real-time environmental data, we can empower communities to take meaningful action against air pollution and create healthier, more sustainable cities for future generations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200"
          >
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold mr-4">
                  15K+
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Lives Impacted</div>
                  <div className="text-sm text-slate-600">Across multiple cities</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold mr-4">
                  2.4K
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Trees Planted</div>
                  <div className="text-sm text-slate-600">This year alone</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold mr-4">
                  98%
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Prediction Accuracy</div>
                  <div className="text-sm text-slate-600">AI-powered forecasts</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Values Grid */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold gradient-text mb-4">Our Core Values</h2>
          <p className="text-slate-600">The principles that guide everything we do</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.5 }}
              >
                <Card hover={true} className="text-center h-full">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-4">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-600">{value.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Team Section */}
      <Card>
        <div className="flex items-center mb-6">
          <Users className="w-6 h-6 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">Our Team</h2>
        </div>
        <p className="text-slate-600 mb-6">
          We are a dedicated group of students passionate about building technology that creates real environmental impact. We aim to develop solutions that improve air quality awareness, support sustainability, and contribute to a healthier future
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Environmental Science', 'AI & Machine Learning', 'Web Development'].map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.6 }}
              className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 text-center"
            >
              <div className="font-semibold text-indigo-700">{area}</div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-2 border-indigo-200 text-center">
          <h2 className="text-2xl font-bold gradient-text mb-4">Join Our Mission</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            Together, we can create cleaner, healthier communities. Start monitoring your local air quality today and be part of the solution.
          </p>
          <Link to="/city-selector">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            Get Started
          </motion.button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
};

export default About;