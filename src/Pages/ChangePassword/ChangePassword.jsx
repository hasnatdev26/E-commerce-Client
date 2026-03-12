import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import Sidebar from "../../Components/Sidebar/Sidebar";

const ChangePassword = () => {
  const { changeUserPassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordStrength =
    newPassword.length >= 10
      ? "strong"
      : newPassword.length >= 6
      ? "medium"
      : "weak";

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await changeUserPassword(currentPassword, newPassword);
      toast.success("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 bg-white flex items-center justify-center lg:block">

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:block lg:w-1/4 sticky top-4 h-fit">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 flex justify-center">

          <div className="w-full max-w-xl rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-b from-white to-blue-50">

            {/* Header */}
            <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-8 py-6 sm:py-8 text-center text-white">
              <div className="flex justify-center mb-2">
                <FaLock className="text-3xl sm:text-5xl" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold tracking-wide">
                Change Password
              </h2>
              <p className="text-xs sm:text-sm text-blue-100">
                Keep your account secure by updating your password regularly
              </p>
            </div>

            {/* Tips */}
            <div className="mx-3 sm:mx-8 mt-4 p-3 sm:p-4 rounded-xl bg-blue-50 border text-[11px] sm:text-sm text-gray-700">
              ✓ Minimum 6 characters • ✓ Use letters & numbers • ✓ Avoid reusing old passwords
            </div>

            {/* Form */}
            <form
              onSubmit={handleChangePassword}
              className="p-3 sm:p-8 space-y-4 sm:space-y-6"
            >
              {/* Current password */}
              <div>
                <label className="text-sm font-semibold">Current Password</label>
                <div className="relative mt-1">
                  <input
                    type={showCurrent ? "text" : "password"}
                    className="w-full px-3 py-2 sm:py-3 pr-10 border rounded-xl bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <span
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showCurrent ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* New password */}
              <div>
                <div className="flex justify-between">
                  <label className="text-sm font-semibold">New Password</label>

                  {newPassword && (
                    <span
                      className={`text-xs ${
                        passwordStrength === "strong"
                          ? "text-green-600"
                          : passwordStrength === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordStrength === "strong" && "Strong"}
                      {passwordStrength === "medium" && "Medium"}
                      {passwordStrength === "weak" && "Weak"}
                    </span>
                  )}
                </div>

                <div className="relative mt-1">
                  <input
                    type={showNew ? "text" : "password"}
                    className="w-full px-3 py-2 sm:py-3 pr-10 border rounded-xl bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <span
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-sm font-semibold">Confirm New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="w-full px-3 py-2 sm:py-3 pr-10 border rounded-xl bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-blue-600 text-white font-semibold tracking-wide hover:bg-blue-700 active:scale-95 transition disabled:opacity-60"
              >
                {loading ? "Updating..." : "Save New Password"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangePassword;
