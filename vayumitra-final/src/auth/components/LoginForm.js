import { useNavigate } from "react-router-dom";
import { useAuth } from "./../AuthContext";
import { loginUser } from "../../api/auth";
import { useState } from "react";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // get login function

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (role) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      // data.access_token
      // We need to decode token to verify role? Or just trust the button click for now? 
      // Ideally getting user info from backend. 
      // For this step, we will persist the token and navigate.
      login(role, data.access_token);
      navigate(`/${role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border px-3 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        className="w-full bg-green-600 text-white py-2 rounded"
        onClick={() => handleLogin("citizen")}
      >
        Login as Citizen
      </button>

      <button
        className="w-full bg-blue-600 text-white py-2 rounded"
        onClick={() => handleLogin("policymaker")}
      >
        Login as Government Body
      </button>

      <p className="text-sm text-center text-gray-500">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-blue-600 cursor-pointer"
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
