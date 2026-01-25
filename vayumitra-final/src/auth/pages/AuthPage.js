import AuthForm from "../components/AuthForm";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">
          VayuMitra Login
        </h2>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
