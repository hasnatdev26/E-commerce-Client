import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Grid,
  ShoppingBag,
  LayoutDashboard,
  ShoppingCart,
  User,
  Boxes,
  PlusSquare,
} from "lucide-react";

import Sidebar from "./Sidbar";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useRole from "../Hooks/useRole";

const MobileBottomNav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, roleLoading] = useRole();

  const [cartCount, setCartCount] = useState(0);

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders-badge-mobile"],
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

  /* ================= CART COUNT (REALTIME AUTO UPDATE) ================= */
  useEffect(() => {
    if (!user?.email || roleLoading || role === "admin") {
      setCartCount(0);
      return;
    }

    const loadCartCount = async () => {
      try {
        const res = await axiosSecure.get(`/carts?email=${user.email}`);
        setCartCount(res.data?.length || 0);
      } catch {
        setCartCount(0);
      }
    };

    // 🔹 first load
    loadCartCount();

    // 🔹 realtime listen
    const handler = () => loadCartCount();

    window.addEventListener("cart-updated", handler);

    return () => window.removeEventListener("cart-updated", handler);

  }, [user?.email, axiosSecure, role, roleLoading]);

  if (roleLoading) return null;

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ================= BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md z-30 block md:hidden">
        <div className="flex justify-around items-center py-2">

          {role === "admin" ? (
            <>
              <Link to="/" className="flex flex-col items-center text-blue-600">
                <Home size={22} />
                <span className="text-xs">Home</span>
              </Link>

              <Link to="/admin/inventory" className="flex flex-col items-center text-blue-600">
                <Boxes size={22} />
                <span className="text-xs">Inventory</span>
              </Link>

              <Link
                to="/admin/dashboard"
                className="flex flex-col items-center bg-white rounded-full -mt-6 p-3 shadow-lg text-blue-600 animate-bounce"
              >
                <LayoutDashboard size={26} />
                <span className="sr-only">Dashboard</span>
              </Link>

              <Link to="/admin/add-products" className="flex flex-col items-center text-blue-600">
                <PlusSquare size={22} />
                <span className="text-xs">Add</span>
              </Link>

              <Link to="/admin/manage-orders" className="relative flex flex-col items-center text-blue-600">
                <ShoppingCart size={22} />
                <span className="text-xs">Orders</span>
                {newOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {newOrdersCount > 99 ? "99+" : newOrdersCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              {/* ================= CUSTOMER NAV ================= */}
              <Link to="/" className="flex flex-col items-center text-blue-600">
                <Home size={22} />
                <span className="text-xs">Home</span>
              </Link>

              <button
                onClick={() => setSidebarOpen(true)}
                className="flex flex-col items-center text-blue-600"
              >
                <Grid size={22} />
                <span className="text-xs">Category</span>
              </button>

              <Link
                to="/all-products"
                className="flex flex-col items-center bg-white rounded-full -mt-6 p-3 shadow-lg text-blue-600 animate-bounce"
              >
                <ShoppingBag size={26} />
                <span className="text-xs">Shop</span>
              </Link>

              <Link to="/cart" className="relative flex flex-col items-center text-blue-600">
                <ShoppingCart size={22} />
                <span className="text-xs">Cart</span>

                {cartCount > 0 && (
                  <span className="absolute -top-1 right-0 bg-red-500 text-white text-[10px] px-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/purchase-history" className="flex flex-col items-center text-blue-600">
                <User size={22} />
                <span className="text-xs">Purchase</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;
