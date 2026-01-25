import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate(`/${role}`);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleLogin("citizen")}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Continue as Citizen
      </button>

      <button
        onClick={() => handleLogin("policymaker")}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Continue as Policymaker
      </button>
    </div>
  );
};

export default AuthForm;
