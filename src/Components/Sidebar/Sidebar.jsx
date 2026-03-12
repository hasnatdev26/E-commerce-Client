import { NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUserCircle,
  FaLock,
  FaSignOutAlt,
  FaPlus,
  FaBoxes,
  FaThLarge,
} from "react-icons/fa";
import { RiFileList3Line } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Sidebar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [role, isLoading] = useRole();
  const axiosSecure = useAxiosSecure();

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders-badge"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/orders");
      return data;
    },
    enabled: role === "admin",
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  const newOrdersCount = orders.filter(
    (order) => order.status?.toLowerCase() === "pending"
  ).length;

  /* =====================
     LOGOUT HANDLER
  ===================== */
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  /* =====================
     ACTIVE / HOVER CLASS
  ===================== */
  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 text-sm font-medium transition-colors duration-200
     ${isActive ? "text-blue-600" : "text-gray-700"}
     hover:text-red-500`;

  /* =====================
     LOADING
  ===================== */
  if (isLoading) {
    return (
      <div className="w-full md:w-60 h-screen flex items-center justify-center">
        <span className="loading loading-bars loading-lg text-blue-500"></span>
      </div>
    );
  }

  return (
    <div
      className="
        w-full
      
        bg-white
        shadow-md
        p-4 md:p-6
        md:h-[calc(100vh-64px)]
        md:sticky md:top-[64px]
        overflow-y-auto
        rounded-lg md:rounded-none
      "
    >
      {/* ================= PROFILE ================= */}
      <div className="flex flex-col items-center text-center mb-6">
        {user?.photoURL ? (
          <div className="w-24 h-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-full h-full object-contain rounded-full p-2"
            />
          </div>
        ) : (
          <FaUserCircle className="text-gray-400 text-7xl" />
        )}

        <h2 className="mt-3 font-semibold text-gray-800 text-sm md:text-base">
          {user?.displayName || "User"}
        </h2>

        <p className="text-gray-500 text-xs md:text-sm break-all">
          {user?.email}
        </p>
      </div>

      {/* ================= MENU ================= */}
      <ul className="space-y-3 md:space-y-4">
        {/* ===== ADMIN MENU ===== */}
        {role === "admin" && (
          <>
            <li>
              <NavLink to="/admin/dashboard" className={menuClass}>
                <FaThLarge className="text-lg" />
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/inventory" className={menuClass}>
                <FaBoxes className="text-lg" />
                Inventory
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/add-products" className={menuClass}>
                <FaPlus className="text-lg" />
                Add Products
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/manage-orders" className={menuClass}>
                <MdManageAccounts className="text-lg" />
                Manage Orders
                {newOrdersCount > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                    {newOrdersCount > 99 ? "99+" : newOrdersCount}
                  </span>
                )}
              </NavLink>
            </li>
          </>
        )}

        {/* ===== CUSTOMER MENU ===== */}
        {role === "customer" && (
          <>
            <li>
              <NavLink to="/cart" className={menuClass}>
                <FaShoppingCart className="text-lg" />
                Cart History
              </NavLink>
            </li>

            <li>
              <NavLink to="/wishlist" className={menuClass}>
                <FaHeart className="text-lg" />
                Wishlist
              </NavLink>
            </li>

            <li>
              <NavLink to="/purchase-history" className={menuClass}>
                <RiFileList3Line className="text-lg" />
                Purchase History
              </NavLink>
            </li>
          </>
        )}

        {/* ===== COMMON ===== */}
        <li>
          <NavLink to="/change-password" className={menuClass}>
            <FaLock className="text-lg" />
            Change Password
          </NavLink>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-500 transition-colors w-full text-left"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
