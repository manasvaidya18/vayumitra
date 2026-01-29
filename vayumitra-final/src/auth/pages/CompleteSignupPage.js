import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";

const CompleteSignupPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const location = useLocation();
    const preSelectedRole = location.state?.role;

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
        role: preSelectedRole || "citizen",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:8000/auth/complete-signup",
                {
                    password: formData.password,
                    role: formData.role,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Store final token
            localStorage.setItem("token", response.data.access_token);

            // Update auth state
            login({ role: formData.role });

            // Navigate based on role
            if (formData.role === "citizen") {
                navigate("/citizen/dashboard");
            } else {
                navigate("/policymaker/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-indigo-50 via-white to-emerald-50 p-4">
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-10 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/50 relative z-10">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-600">
                        Complete Your Signup
                    </h1>
                    <p className="text-gray-500 mt-2">Set your password and choose your role</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            placeholder="Enter password"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            placeholder="Confirm password"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            I am a:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "citizen" })}
                                className={`p-4 border-2 rounded-xl font-semibold transition-all ${formData.role === "citizen"
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                    : "border-gray-200 hover:border-emerald-300"
                                    }`}
                            >
                                🧍 Citizen
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "policymaker" })}
                                className={`p-4 border-2 rounded-xl font-semibold transition-all ${formData.role === "policymaker"
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                    : "border-gray-200 hover:border-indigo-300"
                                    }`}
                            >
                                🏛️ Government
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Complete Signup"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteSignupPage;
