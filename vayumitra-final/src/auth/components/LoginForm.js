import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role) => {
    login(role);
    navigate(`/${role}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          onClick={() => handleLogin("citizen")}
        >
          <span>🌿</span> Login as Citizen
        </button>

        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          onClick={() => handleLogin("policymaker")}
        >
          <span>🏛️</span> Login as Government Body
        </button>
      </div>

      <p className="text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-emerald-600 font-semibold cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;