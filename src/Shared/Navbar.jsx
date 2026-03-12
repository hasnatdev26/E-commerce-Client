import {
  FaPhoneAlt,
  FaUser,
  FaHeart,
  FaSearch,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../src/assets/Logo/logo.png";

import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [wishlistCount, setWishlistCount] = useState(0);

  const searchRef = useRef(null);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchText)}`);
    setSuggestions([]);
    setSearchText("");
  };

  /* ================= LIVE SEARCH ================= */
  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get(`/products/search?q=${searchText}`);
        setSuggestions(res.data.slice(0, 6));
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText, axiosPublic]);

  /* ================= CLICK OUTSIDE SEARCH ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= WISHLIST COUNT (AUTO UPDATE) ================= */
  useEffect(() => {
    if (!user?.email) {
      setWishlistCount(0);
      return;
    }

    const loadWishlistCount = () => {
      axiosPublic
        .get(`/wishlists?email=${user.email}`)
        .then((res) => setWishlistCount(res.data?.length || 0))
        .catch(() => setWishlistCount(0));
    };

    // first load
    loadWishlistCount();

    // listen wishlist update signal
    window.addEventListener("wishlist-updated", loadWishlistCount);

    return () =>
      window.removeEventListener("wishlist-updated", loadWishlistCount);
  }, [user, axiosPublic]);

  return (
    <nav className="w-full shadow bg-white px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="FastDokan Logo"
              className="h-7 sm:h-10 md:h-12 w-auto"
            />
          </Link>

          {/* ================= SEARCH ================= */}
          <div
            ref={searchRef}
            className="hidden sm:flex flex-1 max-w-xl relative"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border border-blue-500 pl-3 pr-10 py-2 text-sm rounded focus:outline-none"
            />

            <button
              onClick={handleSearch}
              className="absolute right-0 top-0 h-full px-3 bg-blue-500 rounded-r"
            >
              <FaSearch className="text-white text-lg" />
            </button>

            {/* ===== SEARCH SUGGESTIONS ===== */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border shadow-md rounded-md mt-1 z-50 max-h-80 overflow-y-auto">
                {loading && (
                  <p className="px-4 py-2 text-sm text-gray-400">
                    Searching...
                  </p>
                )}

                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(`/product-details/${item._id}`);
                      setSuggestions([]);
                      setSearchText("");
                    }}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-blue-50"
                  >
                    <img
                      src={
                        item.images?.[0] ||
                        item.categoryImage ||
                        "https://via.placeholder.com/40"
                      }
                      alt={item.name}
                      className="w-10 h-10 object-contain border rounded"
                    />

                    <div className="flex flex-col">
                      <span className="text-sm line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-xs text-blue-500 font-semibold">
                        ৳ {item.finalAmount || item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3">

          {/* Phone */}
          <div className="hidden sm:flex items-center gap-1 text-gray-700">
            <FaPhoneAlt />
            <div>
              <p className="text-[10px] text-gray-500">Call Us</p>
              <p className="text-xs font-semibold">0123456789</p>
            </div>
          </div>

          {/* ================= WISHLIST (MOBILE) ================= */}
          <Link
            to="/wishlist"
            className="flex flex-col items-center px-2 py-1 text-blue-500 relative sm:hidden"
          >
            <FaHeart className="text-xl" />

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}

            <span className="text-xs">Wishlist</span>
          </Link>

          {/* Account / Logout */}
          {!user ? (
            <Link
              to="/login"
              className="flex flex-col items-center px-2 py-1 text-blue-500"
            >
              <FaUser className="text-xl" />
              <span className="text-xs">Account</span>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center px-2 py-1 text-red-500"
            >
              <FaUser className="text-xl" />
              <span className="text-xs">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
