import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../Hooks/useAuth";

const LoginForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const handleLogin = async (event) => {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    let newErrors = {};

    // ---------- VALIDATIONS ----------

    if (!email) {
      newErrors.email = "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix form errors");
      return;
    }

    setErrors({});
    setLoading(true);

    // ---------- LOGIN ----------
    try {
      await signIn(email, password);

      toast.success("Login successful!");

      // ⏳ 4 seconds loading then redirect to Home
      setTimeout(() => {
        navigate("/");
      }, 4000);

      form.reset();
    } catch (error) {
      console.error(error);

      const msg = error?.message || "";

      if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        toast.error("Incorrect password");
      } else if (msg.includes("user-not-found")) {
        toast.error("No account found with this email");
      } else {
        toast.error("Enter valid email and password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <h2 className="text-3xl font-bold text-blue-700 text-center mb-1">
          Log In
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Welcome back! Please enter your details
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold text-blue-700">
              Email Address
            </label>

            <input
              name="email"
              type="email"
              placeholder="Enter email address"
              className="mt-1 w-full bg-white border border-blue-400 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="text-sm font-semibold text-blue-700">
              Password
            </label>

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="mt-1 w-full bg-white border border-blue-400 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-blue-600 text-sm cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </span>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-full font-semibold flex justify-center items-center gap-2"
          >
            {loading && (
              <span className="loading loading-infinity loading-lg"></span>
            )}
            Log In
          </button>
        </form>

        {/* Forgot password */}
        <div className="text-center mt-3">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgotten password?
          </Link>
        </div>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?
          <Link to="/sign-up" className="text-blue-700 font-semibold hover:underline ml-1">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
