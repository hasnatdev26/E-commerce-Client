import { Link, useNavigate } from "react-router-dom";
import signupImg from "../../src/assets/Signup/sign_up.png";
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { toast } from "react-toastify";
import { imageUpload } from "../Api/utils";
import { useRef, useState } from "react";

const SignupFrom = () => {
  const { createUser, updateUserProfile } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  // OTP STATES
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const lastExistsToastEmailRef = useRef("");

  // LOADING
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  // PASSWORD SHOW / HIDE
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // prevent password typing before OTP verify
  const blockPasswordAlert = () => {
    if (!otpVerified) toast.error("Please verify email OTP first");
  };

  // SEND OTP
  const sendOTP = async () => {
    if (!emailForOtp) return toast.error("Enter your email first");

    try {
      setSendingOtp(true);
      const unavailable = await checkEmailAvailability(emailForOtp.trim(), true);
      if (unavailable) return;

      await axiosPublic.post("/send-otp", { email: emailForOtp });
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const checkEmailAvailability = async (email, showToast = false) => {
    if (!email) return false;
    try {
      setCheckingEmail(true);
      const emailCheckRes = await axiosPublic.post("/users/check-email", { email });
      const exists = Boolean(emailCheckRes?.data?.exists);
      setEmailExists(exists);

      if (exists) {
        setOtpSent(false);
        setOtpVerified(false);
        if (showToast && lastExistsToastEmailRef.current !== email) {
          toast.error("This email is already registered. Use another email.");
          lastExistsToastEmailRef.current = email;
        }
      } else if (lastExistsToastEmailRef.current === email) {
        lastExistsToastEmailRef.current = "";
      }

      return exists;
    } catch {
      return false;
    } finally {
      setCheckingEmail(false);
    }
  };

  // VERIFY OTP
  const verifyOTP = async () => {
    try {
      setVerifyingOtp(true);

      const res = await axiosPublic.post("/verify-otp", {
        email: emailForOtp,
        otp: otpCode,
      });

      if (res.data.success) {
        toast.success("Email verified successfully");
        setOtpVerified(true);
      } else {
        toast.error("Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // SIGNUP SUBMIT
  const handleSignup = async (event) => {
    event.preventDefault();
    setCreatingUser(true);

    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const photoFile = form.photo.files[0];

    const newErrors = {};

    // VALIDATION
    if (name.length < 3) newErrors.name = "Name must be at least 3 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";

    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!/\d/.test(password))
      newErrors.password = "Password must contain a number";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error("Password does not match");
    }

    if (!photoFile) newErrors.photo = "Profile photo is required";

    if (Object.keys(newErrors).length > 0) {
      setCreatingUser(false);
      setErrors(newErrors);
      return;
    }

    if (!otpVerified) {
      setCreatingUser(false);
      return toast.error("Verify email OTP before creating account");
    }

    try {
      const unavailable = await checkEmailAvailability(email, true);
      if (unavailable) {
        return;
      }

      let photoURL = null;

      if (photoFile) photoURL = await imageUpload(photoFile);

      await createUser(email, password);
      await updateUserProfile(name, photoURL);

      await axiosPublic.post(`/users/${email}`, { name, email, photoURL });

      toast.success("Account created successfully");
      form.reset();
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-3 py-10">
      <div className="bg-white shadow-2xl rounded-2xl grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full overflow-hidden">

        {/* IMAGE */}
        <div className="bg-blue-50 flex items-center justify-center p-6">
          <img src={signupImg} alt="Signup" className="w-full max-w-md" />
        </div>

        {/* FORM */}
        <div className="p-6 sm:p-10">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
            Create your account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-blue-600">Full Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 w-full bg-white border border-blue-400 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* EMAIL + SEND OTP */}
            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-2">
                <label className="text-sm font-semibold text-blue-600">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 w-full bg-white border border-blue-400 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your email"
                  onChange={(e) => {
                    setEmailForOtp(e.target.value);
                    setEmailExists(false);
                  }}
                  onBlur={(e) => checkEmailAvailability(e.target.value.trim(), true)}
                  disabled={otpVerified}
                />
              </div>

              <button
                type="button"
                onClick={sendOTP}
                disabled={sendingOtp || checkingEmail || emailExists}
                className="bg-blue-600 text-white py-2 rounded font-medium flex items-center justify-center hover:bg-blue-700 transition"
              >
                {sendingOtp || checkingEmail
                  ? <span className="loading loading-infinity loading-xl"></span>
                  : emailExists
                    ? "Unavailable"
                  : otpSent ? "Resend OTP" : "Send OTP"}
              </button>
            </div>

            {/* OTP BOX */}
            {otpSent && (
              <div className="bg-blue-50 p-3 rounded border border-blue-400">
                <label className="text-sm font-semibold text-blue-600">Enter OTP</label>

                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    className="w-full bg-white border border-blue-400 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6 digit OTP"
                    onChange={(e) => setOtpCode(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={verifyingOtp}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    {verifyingOtp
                      ? <span className="loading loading-infinity loading-xl"></span>
                      : "Verify"}
                  </button>
                </div>

                {otpVerified && (
                  <p className="text-green-600 text-sm mt-1 font-semibold">
                    ✔ Email verified successfully
                  </p>
                )}
              </div>
            )}

            {/* PHOTO */}
            <div>
              <label className="text-sm font-semibold text-blue-600">Profile Photo</label>
              <input
                type="file"
                name="photo"
                className="mt-1 w-full border border-blue-400 rounded px-3 py-2"
              />
            </div>

            {/* PASSWORDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* PASSWORD */}
              <div className="relative">
                <label className="text-sm font-semibold text-blue-600">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  disabled={!otpVerified}
                  onFocus={blockPasswordAlert}
                  placeholder="Password"
                  className="mt-1 w-full bg-white border border-blue-400 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 cursor-pointer text-blue-600 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <label className="text-sm font-semibold text-blue-600">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  disabled={!otpVerified}
                  onFocus={blockPasswordAlert}
                  placeholder="Confirm password"
                  className="mt-1 w-full bg-white border border-blue-400 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-9 cursor-pointer text-blue-600 text-sm"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={!otpVerified || creatingUser}
              className="mt-2 w-full bg-blue-700 hover:bg-blue-800 transition text-white py-2 rounded-lg font-semibold flex items-center justify-center"
            >
              {creatingUser
                ? <span className="loading loading-infinity loading-xl"></span>
                : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-5 text-center">
            Already have an account?
            <Link to="/login" className="text-blue-700 font-semibold hover:underline ml-1">
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupFrom;
