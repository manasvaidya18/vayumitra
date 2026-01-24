import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, LayoutDashboard, Trees, Bird, MessageCircle, Lightbulb, ArrowRight, Sparkles, TrendingUp, Shield, Heart } from 'lucide-react';
import Button from '../components/common/Button';
import MetricCard from '../components/common/MetricCard';

const Home = () => {
  const features = [
    { icon: LayoutDashboard, title: 'Real-Time Dashboard', description: 'Monitor AQI and air quality metrics in real-time', link: '/city-selector', color: 'indigo' },
    { icon: Trees, title: 'Tree Impact Simulator', description: 'Visualize how trees improve air quality', link: '/tree-impact', color: 'green' },
    { icon: Bird, title: 'Wildlife Monitoring', description: 'Track pollution impact on local species', link: '/wildlife', color: 'blue' },
    { icon: MessageCircle, title: 'AI Chatbot', description: 'Get instant answers about air quality', link: '/chatbot', color: 'purple' },
    { icon: Lightbulb, title: 'Green Suggestions', description: 'AI-powered recommendations for cleaner air', link: '/green-suggestions', color: 'yellow' },
    { icon: Shield, title: 'Health Risk Prediction', description: 'Personalized health risk assessment', link: '/city-selector', color: 'red' },
  ];

  const stats = [
    { icon: Wind, title: 'Current AQI', value: '87', unit: 'Moderate', trend: 'down' },
    { icon: TrendingUp, title: 'Clean Air Score', value: '73', unit: '/100', trend: 'up' },
    { icon: Trees, title: 'Trees Planted', value: '2.4K', unit: 'this year', trend: 'up' },
    { icon: Heart, title: 'Lives Improved', value: '15K', unit: 'people', trend: 'up' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 mb-6"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
            <span className="text-sm font-semibold text-indigo-700">AI-Powered Air Quality Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">Breathe Cleaner,</span>
            <br />
            <span className="text-slate-800">Live Healthier</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            Advanced AI technology combined with real-time data to monitor, predict, and improve air quality in your community. Join thousands making a difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/city-selector">
              <Button icon={LayoutDashboard}>
                Explore Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button variant="secondary" icon={MessageCircle}>
                Talk to AI Assistant
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <MetricCard
              key={idx}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              unit={stat.unit}
              trend={stat.trend}
              delay={idx * 0.1 + 0.5}
            />
          ))}
        </motion.div>
      </section> */}

      {/* Features Grid */}
      <section>
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold gradient-text mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Everything you need to understand and improve air quality in one intelligent platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={feature.link}>
                  <div className="glass-card p-6 hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-${feature.color}-400/20 to-${feature.color}-600/20 inline-block mb-4 group-hover:shadow-glow transition-shadow`}>
                      <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-2 border-indigo-200"
        >
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold gradient-text mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Join our community of environmental champions using AI to create cleaner, healthier cities for everyone.
          </p>
          <Link to="/city-selector">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                    >
                      Get Started Now 
                    </motion.button>
                    </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;