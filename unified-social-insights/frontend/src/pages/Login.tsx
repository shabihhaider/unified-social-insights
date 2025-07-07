// src/pages/Login.tsx
const Login = () => {
  const handleLogin = () => {
    // Use local backend during development
    window.location.href = 'http://localhost:5050/api/auth/facebook';
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Login with Facebook</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Login with Facebook
      </button>
    </div>
  );
};

export default Login;