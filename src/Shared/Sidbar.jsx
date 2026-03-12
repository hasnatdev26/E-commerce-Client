import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef();
  const axiosPublic = useAxiosPublic();
  const [categories, setCategories] = useState([]);

  /* ================= Fetch Categories ================= */
  useEffect(() => {
    axiosPublic
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [axiosPublic]);

  /* ================= Outside Click ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  /* ================= Body Scroll Lock ================= */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 w-64 h-full bg-white shadow-md z-50 transform transition-transform duration-300 overflow-y-auto ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-blue-600">
        <h2 className="font-bold text-lg text-blue-600">Categories</h2>

        <button onClick={onClose} className="text-blue-600 font-bold">
          X
        </button>
      </div>

      <ul className="p-4">

        {/* 🔥 যদি কোনো category না থাকে */}
        {categories.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-3">
            No categories available
          </p>
        )}

        {/* 🔵 categories থাকলে দেখাবে */}
        {categories.length > 0 &&
          categories.map((cat, index) => (
            <li
              key={cat._id || `${cat.name}-${index}`}
              className="py-2 border-b text-blue-600 hover:text-blue-800"
            >
              <Link
                to={`/category/${encodeURIComponent(cat.name)}`}
                onClick={onClose}
              >
                {cat.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
