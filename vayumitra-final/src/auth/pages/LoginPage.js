import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-indigo-50 p-4">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/50 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-indigo-600">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Sign in to VayuMitra</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;