import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const role = location.state?.role;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/auth/verify-email", {
                email,
                otp
            });

            // Store token
            localStorage.setItem("token", response.data.access_token);

            // Navigate to complete signup with role
            navigate("/complete-signup", { state: { role } });
        } catch (err) {
            setError(err.response?.data?.detail || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");

        try {
            await axios.post("http://localhost:8000/auth/start-signup", { email });
            alert("New verification code sent!");
        } catch (err) {
            setError("Failed to resend code");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-indigo-50 p-4">
            <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/50 relative z-10">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">📧</div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-indigo-600">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-500 mt-2">
                        We sent a 6-digit code to <br />
                        <span className="font-semibold text-gray-700">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="Enter 6-digit code"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all text-center text-2xl tracking-widest font-bold"
                            required
                            maxLength={6}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
                            >
                                {resending ? "Sending..." : "Resend"}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
