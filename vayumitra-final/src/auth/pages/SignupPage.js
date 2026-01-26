import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[360px]">
        <h2 className="text-2xl font-bold text-center mb-6">
          VayuMitra Signup
        </h2>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
