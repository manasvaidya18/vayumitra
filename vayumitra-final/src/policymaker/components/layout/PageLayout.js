import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import { CityProvider } from "../../../context/CityContext";

const PageLayout = () => {
  return (
    <CityProvider>
      {/* Sidebar (fixed) */}
      <Sidebar isOpen={true} />

      {/* Navbar (fixed or sticky) */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16 ml-64 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <ChatBot />
    </CityProvider>
  );
};

export default PageLayout;
