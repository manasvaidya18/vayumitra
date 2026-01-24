import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle,Github, Twitter, Linkedin } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contact@aircareai.com' },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
    { icon: MapPin, label: 'Location', value: 'Pimpri, Maharashtra, India' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-4">
          <Mail className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">Get in Touch</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have questions about air quality? Want to collaborate? We'd love to hear from you!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <Card key={idx} hover={false}>
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{info.label}</h3>
                    <p className="text-sm text-slate-600">{info.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Social Links */}
          <Card hover={false}>
            <h3 className="font-semibold text-slate-800 mb-4">Follow Us</h3>
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
          </Card>

          {/* Office Hours */}
          {/* <Card hover={false} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Office Hours</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-semibold">9 AM - 6 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-semibold">10 AM - 4 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-semibold">Closed</span>
              </div>
            </div>
          </Card> */}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button type="submit" icon={Send} className="w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-4"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                <p className="text-slate-600">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Map Placeholder */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="h-64 bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold">Interactive Map</p>
            <p className="text-sm text-slate-500 mt-1">Our office location in Pimpri, Maharashtra</p>
          </div>
        </Card>
      </motion.div> */}
    </div>
  );
};

export default Contact;