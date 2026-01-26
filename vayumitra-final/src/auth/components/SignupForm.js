import { useNavigate } from "react-router-dom";
import { useAuth } from "./../AuthContext";
import { signupUser } from "../../api/auth";
import { useState } from "react";

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // get login function

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (role) => {
    setError(null);
    try {
      const data = await signupUser(email, password, role);
      // login(role); // AuthContext should probably handle the token
      // For now, let's just use the role from the response or the one passed
      login(role, data.access_token);
      navigate(`/${role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name / Organization Name"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="email"
        placeholder="Official Email"
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
        onClick={() => handleSignup("citizen")}
      >
        Sign up as Citizen
      </button>

      <button
        className="w-full bg-blue-600 text-white py-2 rounded"
        onClick={() => handleSignup("policymaker")}
      >
        Sign up as Government Body
      </button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-blue-600 cursor-pointer"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
