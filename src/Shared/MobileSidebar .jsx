import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTimes, FaAngleDown } from "react-icons/fa";
import { toast } from "react-toastify";

import logo from "../../src/assets/Logo/logo.png";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import useAuth from "../Hooks/useAuth";

const MobileSidebar = ({ menuOpen, setMenuOpen }) => {
  const { user, logOut } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("profile");
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const axiosPublic = useAxiosPublic();

  // Fetch Categories
  useEffect(() => {
    axiosPublic
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [axiosPublic]);

  // Static pages
  const pages = [
    { name: "All Products", path: "/all-products" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  const isActivePage = (path) => location.pathname === path;

  const isActiveCategory = (catName) =>
    location.pathname === `/category/${encodeURIComponent(catName)}`;

  useEffect(() => {
    if (location.pathname.includes("/category")) {
      setActiveTab("filter");
      setMobileCategoriesOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      setMenuOpen(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full 
        w-64 sm:w-72 md:w-80 
        bg-white shadow-lg transform transition-transform duration-300 z-[60]
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex-1 flex items-center justify-center"
          >
            <img src={logo} alt="Logo" className="h-10 w-auto max-w-[140px]" />
          </Link>

          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl ml-2 text-blue-500 active:scale-95"
          >
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b text-sm font-semibold">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 ${
              activeTab === "profile"
                ? "text-black border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
          >
            PROFILE
          </button>

          <button
            onClick={() => setActiveTab("filter")}
            className={`flex-1 py-2 ${
              activeTab === "filter"
                ? "text-black border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
          >
            FILTER DATA
          </button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="px-4 py-5 space-y-4 overflow-y-auto h-[calc(100%-110px)]">
            {!user && (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-2 rounded-lg border border-blue-500 text-blue-600 font-semibold hover:bg-blue-50"
                >
                  Login
                </Link>

                <Link
                  to="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Create Account
                </Link>
              </div>
            )}

            {user && (
              <>
                <div className="border border-blue-400 rounded-xl p-4 text-center shadow-sm">
                  <div className="flex justify-center mb-3">
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/2kRZkJX/user.png"
                      }
                      className="w-16 h-16 rounded-full border-2 border-blue-400 shadow object-cover"
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-800">
                    {user?.displayName || "User"}
                  </h3>

                  <p className="text-xs text-gray-500 break-all">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/change-password"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full py-2 text-sm text-blue-600 border border-blue-400 rounded-lg hover:bg-blue-50 text-center"
                >
                  Change Password
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full py-2 text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}

        {/* FILTER TAB */}
        {activeTab === "filter" && (
          <div className="flex flex-col px-4 py-4 space-y-2 text-sm overflow-y-auto h-[calc(100%-110px)]">
            {/* Categories */}
            <button
              onClick={() =>
                setMobileCategoriesOpen(!mobileCategoriesOpen)
              }
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-50"
            >
              <span>Categories</span>
              <FaAngleDown
                className={`transition-transform ${
                  mobileCategoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileCategoriesOpen && (
              <ul className="ml-4 border-l pl-3 space-y-1 max-h-64 overflow-y-auto">

                {/* 🔥 show message when no category */}
                {categories.length === 0 && (
                  <p className="text-sm text-gray-400 px-1 py-1">
                    No categories available
                  </p>
                )}

                {categories.length > 0 &&
                  categories.map((cat, idx) => (
                    <li key={idx}>
                      <Link
                        to={`/category/${encodeURIComponent(cat.name)}`}
                        onClick={() => setMenuOpen(false)}
                        className={`block py-1 ${
                          isActiveCategory(cat.name)
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700"
                        } hover:text-blue-600`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}

            {/* Pages */}
            <button
              onClick={() => setMobilePagesOpen(!mobilePagesOpen)}
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-50"
            >
              <span>Pages</span>
              <FaAngleDown
                className={`transition-transform ${
                  mobilePagesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobilePagesOpen && (
              <ul className="ml-4 border-l pl-3 space-y-1">
                {pages.map((page, idx) => (
                  <li key={idx}>
                    <Link
                      to={page.path}
                      onClick={() => setMenuOpen(false)}
                      className={`block py-1 ${
                        isActivePage(page.path)
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700"
                      } hover:text-blue-600`}
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-50"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default MobileSidebar;
