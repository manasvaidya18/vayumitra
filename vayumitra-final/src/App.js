import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LoginPage from "./auth/pages/LoginPage";
import SignupPage from "./auth/pages/SignupPage";
import ProtectedRoute from "./auth/ProtectedRoute";

// Citizen
import CitizenLayout from "./citizen/components/layout/Layout";


// Policymaker
import PolicymakerLayout from "./policymaker/components/layout/PageLayout";
import DashBoard from "./policymaker/pages/Dashboard";
import LiveAirQuality from "./policymaker/pages/LiveAirQuality";
import PollutionHotspots from "./policymaker/pages/PollutionHotspots";
import ForecastWarnings from "./policymaker/pages/ForecastWarnings";
import PolicySimulator from "./policymaker/pages/PolicySimulator";
import HealthImpact from "./policymaker/pages/HealthImpact";
import TrafficUrban from "./policymaker/pages/TrafficUrban";
import ReportsExports from "./policymaker/pages/ReportsExports";
// Citizen Pages
import Home from "./citizen/pages/Home";
import CitySelector from "./citizen/pages/CitySelector";
import Dashboard from "./citizen/pages/Dashboard";
import TreeImpact from "./citizen/pages/TreeImpact";
import Wildlife from "./citizen/pages/Wildlife";
import GreenSuggestionsPage from "./citizen/pages/GreenSuggestionsPage";
import About from "./citizen/pages/About";
import Contact from "./citizen/pages/Contact";
import LandingPage from "./pages/LandingPage"



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<h2>Unauthorized</h2>} />

      {/* CITIZEN */}
      {/* CITIZEN ROUTES */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute role="citizen">
            <CitizenLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />                     {/* /citizen */}
        <Route path="city-selector" element={<CitySelector />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tree-impact" element={<TreeImpact />} />
        <Route path="wildlife" element={<Wildlife />} />
        <Route path="green-suggestions" element={<GreenSuggestionsPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>



      {/* POLICYMAKER */}
      <Route
        path="/policymaker"
        element={
          <ProtectedRoute role="policymaker">
            <PolicymakerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashBoard />} />            {/* /policymaker */}
        <Route path="dashboard" element={<DashBoard />} /> {/* /policymaker/dashboard */}
        <Route path="live-air-quality" element={<LiveAirQuality />} />
        <Route path="pollution-hotspots" element={<PollutionHotspots />} />
        <Route path="forecast-warnings" element={<ForecastWarnings />} />
        <Route path="policy-simulator" element={<PolicySimulator />} />
        <Route path="health-impact" element={<HealthImpact />} />
        <Route path="traffic-urban" element={<TrafficUrban />} />
        <Route path="reports-exports" element={<ReportsExports />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default App;
