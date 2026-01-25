import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatBot from "./ChatBot";

const CitizenLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />  {/* ✅ Nested routes will render here */}
      </main>
      <ChatBot />
      <Footer />
    </div>
  );
};

export default CitizenLayout;
