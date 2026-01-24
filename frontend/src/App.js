import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import CitySelector from './pages/CitySelector';
import Dashboard from './pages/Dashboard';
import TreeImpact from './pages/TreeImpact';
import Wildlife from './pages/Wildlife';
import Chatbot from './pages/Chatbot';
import GreenSuggestionsPage from './pages/GreenSuggestionsPage';
import About from './pages/About';
import Contact from './pages/Contact';

import ChatBot from './components/ChatBot';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city-selector" element={<CitySelector />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tree-impact" element={<TreeImpact />} />
          <Route path="/wildlife" element={<Wildlife />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/green-suggestions" element={<GreenSuggestionsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <ChatBot />
      </Layout>
    </Router>
  );
}

export default App;