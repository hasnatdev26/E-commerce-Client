import {
  FaHeart,
  FaShoppingCart,
  FaAngleDown,
  FaThLarge,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import MobileSidebar from "./MobileSidebar ";

const MainNavbar = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [role, roleLoading] = useRole();

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const [mobileSearch, setMobileSearch] = useState("");
  const [mobileSuggestions, setMobileSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryRef = useRef();
  const mobileSearchRef = useRef();

  const activeClass = "text-blue-500 font-semibold";
  const normalClass = "text-blue-500 hover:text-blue-600";

  /* ================= Fetch Categories ================= */
  useEffect(() => {
    axiosPublic
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [axiosPublic]);

  /* ================= Wishlist & Cart Count (AUTO-UPDATE) ================= */
  useEffect(() => {
    if (!user?.email || roleLoading || role === "admin") {
      setWishlistCount(0);
      setCartCount(0);
      return;
    }

    const loadCounts = async () => {
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          axiosPublic.get(`/wishlists?email=${user.email}`),
          axiosPublic.get(`/carts?email=${user.email}`),
        ]);

        setWishlistCount(wishlistRes.data?.length || 0);
        setCartCount(cartRes.data?.length || 0);
      } catch {
        console.log("Count load failed");
      }
    };

    // first load
    loadCounts();

    // ⭐ realtime listeners
    const handler = () => loadCounts();

    window.addEventListener("wishlist-updated", handler);
    window.addEventListener("cart-updated", handler);

    return () => {
      window.removeEventListener("wishlist-updated", handler);
      window.removeEventListener("cart-updated", handler);
    };
  }, [user, axiosPublic, role, roleLoading]);

  /* ================= MOBILE LIVE SEARCH ================= */
  useEffect(() => {
    if (!mobileSearch.trim()) {
      setMobileSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get(
          `/products/search?q=${mobileSearch}`
        );
        setMobileSuggestions(res.data.slice(0, 6));
      } catch {
        setMobileSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [mobileSearch, axiosPublic]);

  const handleMobileSearch = () => {
    if (!mobileSearch.trim()) return;

    navigate(`/search?q=${encodeURIComponent(mobileSearch)}`);
    setMobileSuggestions([]);
    setMobileSearch("");
    setMenuOpen(false);
  };

  const handleMobileKeyDown = (e) => {
    if (e.key === "Enter") handleMobileSearch();
  };

  /* ================= Outside Click ================= */
  useEffect(() => {
    const close = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setMobileSuggestions([]);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="w-full shadow-md bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-6">

          {/* Categories Dropdown */}
          <div ref={categoryRef} className="relative hidden md:block">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-2 font-medium text-blue-500"
            >
              <FaThLarge />
              <span>All Categories</span>
              <FaAngleDown />
            </button>

            {categoriesOpen && (
              <div className="absolute bg-white shadow-md rounded-md mt-2 w-64 z-50 max-h-80 overflow-y-auto">
                <ul className="flex flex-col text-sm">
                  {categories.map((cat, index) => (
                    <li key={index}>
                      <Link
                        to={`/category/${encodeURIComponent(cat.name)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 ml-8">
            <NavLink to="/" className={({isActive}) => isActive ? activeClass : normalClass}>Home</NavLink>
            <NavLink to="/all-Products" className={({isActive}) => isActive ? activeClass : normalClass}>All Products</NavLink>
            <NavLink to="/contact-Us" className={({isActive}) => isActive ? activeClass : normalClass}>Contact Us</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? activeClass : normalClass}>About</NavLink>
            <NavLink to="/outlets" className={({isActive}) => isActive ? activeClass : normalClass}>Outlets</NavLink>
          </div>
        </div>

        {/* ================= RIGHT (DESKTOP) ================= */}
        <div className="hidden md:flex items-center gap-8">

          {/* Wishlist */}
          <NavLink to="/wishlist" className="relative flex items-center gap-2 text-blue-500">
            <FaHeart className="text-xl" />
            <span className="text-sm">Wishlist</span>

            {wishlistCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          {/* Cart (hide for admin) */}
          {!roleLoading && role !== "admin" && (
            <NavLink to="/cart" className="relative flex items-center gap-2 text-blue-500">
              <FaShoppingCart className="text-xl" />
              <span className="text-sm">Cart</span>

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>
          )}
        </div>

        {/* ================= MOBILE ================= */}
        <div
          className="md:hidden flex items-center gap-2 w-full"
          ref={mobileSearchRef}
        >
          <button
            className="text-2xl text-blue-500"
            onClick={() => setMenuOpen(true)}
          >
            <FaBars />
          </button>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              onKeyDown={handleMobileKeyDown}
              className="w-full px-3 py-1 border border-blue-500 rounded"
            />

            <FaSearch
              onClick={handleMobileSearch}
              className="absolute right-3 top-2.5 text-blue-500 cursor-pointer"
            />

            {/* ===== MOBILE SUGGESTIONS ===== */}
            {mobileSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border shadow-md rounded mt-1 z-50">
                {loading && (
                  <p className="px-3 py-2 text-sm text-gray-400">
                    Searching...
                  </p>
                )}

                {mobileSuggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(`/product-details/${item._id}`);
                      setMobileSearch("");
                      setMobileSuggestions([]);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    <img
                      src={
                        item.images?.[0] ||
                        item.categoryImage ||
                        "https://via.placeholder.com/40"
                      }
                      className="w-8 h-8 object-contain border rounded"
                    />
                    <span className="text-sm line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  );
};

export default MainNavbar;
