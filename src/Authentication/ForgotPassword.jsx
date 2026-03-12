import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../Hooks/useAuth";

const ForgotPassword = () => {
  const { resetPasswordByEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Enter a valid email address");
      toast.error("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      await resetPasswordByEmail(email);

      toast.success("Password reset link sent to your email");
      setEmail("");

    } catch (err) {
      console.error(err);
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <h2 className="text-3xl font-bold text-blue-700 text-center mb-1">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Enter your email and we will send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-semibold text-blue-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-white border border-blue-400 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-full font-semibold flex justify-center items-center gap-2"
          >
            {loading && (
              <span className="loading loading-infinity loading-lg"></span>
            )}
            Send reset link
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remembered your password?
          <Link to="/login" className="text-blue-700 font-semibold hover:underline ml-1">
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;
