import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaBoxes, FaClipboardList, FaExclamationTriangle, FaPlus } from "react-icons/fa";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const StatCard = ({ title, value, icon, color }) => (
  <div className={`rounded-2xl border p-4 shadow-md ${color}`}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-white/90">{title}</p>
        <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className="rounded-xl bg-white/20 p-3 backdrop-blur-[1px]">
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();
  const salesChartRef = useRef(null);
  const productsChartRef = useRef(null);
  const usersChartRef = useRef(null);
  const [animateBars, setAnimateBars] = useState({
    sales: false,
    products: false,
    users: false,
  });

  const {
    data: products = [],
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/products");
      return data;
    },
  });

  const {
    data: orders = [],
    isLoading: ordersLoading,
  } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/orders");
      return data;
    },
  });

  const {
    data: users = [],
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users");
      return data;
    },
  });

  const stats = useMemo(() => {
    const lowStockCount = products.filter((p) => Number(p.quantity) <= 5).length;
    const pendingOrders = orders.filter(
      (o) => o.status?.toLowerCase() === "pending" || o.status?.toLowerCase() === "processing"
    ).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      lowStockCount,
      pendingOrders,
    };
  }, [orders, products]);

  const statusChartData = useMemo(() => {
    const map = {
      Pending: 0,
      Processing: 0,
      Delivered: 0,
      Cancelled: 0,
      Returned: 0,
    };

    orders.forEach((order) => {
      const status = order.status?.toLowerCase();
      if (status === "pending") map.Pending += 1;
      else if (status === "processing") map.Processing += 1;
      else if (status === "delivered") map.Delivered += 1;
      else if (status === "cancelled") map.Cancelled += 1;
      else if (status === "returned") map.Returned += 1;
    });

    return [
      { label: "Pending", value: map.Pending, color: "bg-amber-500" },
      { label: "Processing", value: map.Processing, color: "bg-blue-500" },
      { label: "Delivered", value: map.Delivered, color: "bg-emerald-500" },
      { label: "Cancelled", value: map.Cancelled, color: "bg-rose-500" },
      { label: "Returned", value: map.Returned, color: "bg-violet-500" },
    ];
  }, [orders]);

  const monthlySalesData = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("en-US", { month: "short" }),
        value: 0,
      });
    }

    const monthMap = new Map(months.map((m) => [m.key, m]));
    orders.forEach((order) => {
      const status = order.status?.toLowerCase();
      if (status !== "delivered") return;

      const date = new Date(order.orderTime);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const amount = Number(order.subTotal ?? 0);
      if (monthMap.has(key)) monthMap.get(key).value += amount;
    });

    return months;
  }, [orders]);

  const monthlyProductSoldData = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("en-US", { month: "short" }),
        value: 0,
      });
    }

    const monthMap = new Map(months.map((m) => [m.key, m]));

    orders.forEach((order) => {
      const status = order.status?.toLowerCase();
      if (status !== "delivered") return;

      const date = new Date(order.orderTime);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthMap.has(key)) return;

      const soldUnits = Array.isArray(order.items)
        ? order.items.reduce(
            (sum, item) => sum + Number(item?.quantity ?? 0),
            0
          )
        : 0;

      monthMap.get(key).value += soldUnits;
    });

    return months;
  }, [orders]);

  const monthlyUsersData = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("en-US", { month: "short" }),
        value: 0,
      });
    }

    const monthMap = new Map(months.map((m) => [m.key, m]));
    users.forEach((user) => {
      const date = new Date(user.createdAt);
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthMap.has(key)) return;
      monthMap.get(key).value += 1;
    });

    return months;
  }, [users]);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime))
    .slice(0, 5);
  const nonAdminUsers = users.filter(
    (user) => user.role?.toLowerCase() !== "admin"
  );
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const loading = productsLoading || ordersLoading || usersLoading;

  const handleUserBlockToggle = async (user) => {
    if (!user?._id) return;
    try {
      setUpdatingUserId(user._id);
      await axiosSecure.patch(`/users/${user._id}/block`, {
        isBlocked: !Boolean(user.isBlocked),
      });
      await refetchUsers();
    } catch (error) {
      console.error("Failed to update user block status:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    const observers = [];
    const setupObserver = (ref, key) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          setAnimateBars((prev) => ({
            ...prev,
            [key]: entry.isIntersecting,
          }));
        },
        { threshold: 0.35 }
      );
      observer.observe(ref.current);
      observers.push(observer);
    };

    setupObserver(salesChartRef, "sales");
    setupObserver(productsChartRef, "products");
    setupObserver(usersChartRef, "users");

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 rounded-2xl ">
      <style>
        {`
          @keyframes dashboardBarGrow {
            from { height: 0%; }
            to { height: var(--target-height); }
          }
        `}
      </style>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block md:w-1/4">
          <Sidebar />
        </aside>

        <main className="w-full md:w-3/4 space-y-6">
          <section className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 p-6 shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-blue-50">
              Welcome back. Here is a quick overview of your store.
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Total Products"
              value={loading ? "..." : stats.totalProducts}
              icon={<FaBoxes className="text-xl text-white" />}
              color="bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400"
            />
            <StatCard
              title="Total Orders"
              value={loading ? "..." : stats.totalOrders}
              icon={<FaClipboardList className="text-xl text-white" />}
              color="bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400"
            />
            <StatCard
              title="Low Stock Items"
              value={loading ? "..." : stats.lowStockCount}
              icon={<FaExclamationTriangle className="text-xl text-white" />}
              color="bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400"
            />
            <StatCard
              title="Pending/Processing Orders"
              value={loading ? "..." : stats.pendingOrders}
              icon={<FaClipboardList className="text-xl text-white" />}
              color="bg-gradient-to-r from-fuchsia-500 to-rose-600 border-fuchsia-400"
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 shadow-md">
              <h2 className="text-lg font-semibold text-indigo-900">Orders by Status</h2>
              {loading ? (
                <p className="mt-3 text-sm text-indigo-600">Loading chart...</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {statusChartData.map((item) => {
                    const percent = stats.totalOrders
                      ? Math.round((item.value / stats.totalOrders) * 100)
                      : 0;
                    return (
                      <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-700">
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              ref={salesChartRef}
              className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 p-4 shadow-md"
            >
              <h2 className="text-lg font-semibold text-emerald-900">Monthly Sales (Last 12 Months)</h2>
              {loading ? (
                <p className="mt-3 text-sm text-emerald-600">Loading chart...</p>
              ) : (
                <div className="mt-5 flex h-44 items-end gap-3">
                  {monthlySalesData.map((item, index) => {
                    const maxValue = Math.max(...monthlySalesData.map((m) => m.value), 1);
                    const height = Math.max((item.value / maxValue) * 100, 8);
                    return (
                      <div key={item.label} className="flex flex-1 flex-col items-center">
                        <div className="flex h-32 w-full items-end">
                          <div className="group relative flex h-full w-full items-end">
                            <div
                              className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-cyan-500 cursor-pointer"
                              style={{
                                "--target-height": `${height}%`,
                                height: "var(--target-height)",
                                animation: animateBars.sales
                                  ? "dashboardBarGrow 700ms ease-out both"
                                  : "none",
                                animationDelay: `${index * 45}ms`,
                              }}
                            />
                            <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                              Tk {Math.round(item.value)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{item.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              ref={productsChartRef}
              className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 p-4 shadow-md"
            >
              <h2 className="text-lg font-semibold text-rose-900">
                Monthly Products Sold (Last 12 Months)
              </h2>
              {loading ? (
                <p className="mt-3 text-sm text-rose-600">Loading chart...</p>
              ) : (
                <div className="mt-5 flex h-44 items-end gap-3">
                  {monthlyProductSoldData.map((item, index) => {
                    const maxValue = Math.max(
                      ...monthlyProductSoldData.map((m) => m.value),
                      1
                    );
                    const height = Math.max((item.value / maxValue) * 100, 8);

                    return (
                      <div key={item.label} className="flex flex-1 flex-col items-center">
                        <div className="flex h-32 w-full items-end">
                          <div className="group relative flex h-full w-full items-end">
                            <div
                              className="w-full rounded-t-md bg-gradient-to-t from-rose-500 to-orange-400 cursor-pointer"
                              style={{
                                "--target-height": `${height}%`,
                                height: "var(--target-height)",
                                animation: animateBars.products
                                  ? "dashboardBarGrow 700ms ease-out both"
                                  : "none",
                                animationDelay: `${index * 45}ms`,
                              }}
                            />
                            <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                              {Math.round(item.value)} pcs
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{item.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              ref={usersChartRef}
              className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-md"
            >
              <h2 className="text-lg font-semibold text-cyan-900">
                Monthly Users (Last 12 Months)
              </h2>
              {loading ? (
                <p className="mt-3 text-sm text-cyan-600">Loading chart...</p>
              ) : (
                <div className="mt-5 flex h-44 items-end gap-3">
                  {monthlyUsersData.map((item, index) => {
                    const maxValue = Math.max(...monthlyUsersData.map((m) => m.value), 1);
                    const height = Math.max((item.value / maxValue) * 100, 8);

                    return (
                      <div key={item.label} className="flex flex-1 flex-col items-center">
                        <div className="flex h-32 w-full items-end">
                          <div className="group relative flex h-full w-full items-end">
                            <div
                              className="w-full rounded-t-md bg-gradient-to-t from-cyan-500 to-blue-500 cursor-pointer"
                              style={{
                                "--target-height": `${height}%`,
                                height: "var(--target-height)",
                                animation: animateBars.users
                                  ? "dashboardBarGrow 700ms ease-out both"
                                  : "none",
                                animationDelay: `${index * 45}ms`,
                              }}
                            />
                            <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                              {Math.round(item.value)} users
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{item.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-pink-50 p-4 shadow-md">
            <h2 className="text-lg font-semibold text-violet-800">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/admin/add-products"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-purple-700 hover:to-indigo-700"
              >
                <FaPlus />
                Add New Product
              </Link>
              <Link
                to="/admin/inventory"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:from-cyan-600 hover:to-blue-600"
              >
                <FaBoxes />
                Open Inventory
              </Link>
              <Link
                to="/admin/manage-orders"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow hover:from-emerald-600 hover:to-teal-600"
              >
                <FaClipboardList />
                Manage Orders
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-white to-sky-50 p-4 shadow-md">
              <h2 className="text-lg font-semibold text-sky-900">Recent Orders</h2>
              {loading ? (
                <p className="mt-3 text-sm text-sky-600">Loading recent orders...</p>
              ) : recentOrders.length === 0 ? (
                <p className="mt-3 text-sm text-sky-600">No orders yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between rounded-xl border border-sky-200 bg-white/80 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {order.userName || "Unknown User"}
                        </p>
                        <p className="text-xs text-slate-500">{order.userEmail || "No email"}</p>
                      </div>
                      <span className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1 text-xs font-medium text-white">
                        {order.status || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-violet-200 bg-gradient-to-r from-white to-violet-50 p-4 shadow-md">
              <h2 className="text-lg font-semibold text-violet-900">All Users</h2>
              {loading ? (
                <p className="mt-3 text-sm text-violet-600">Loading users...</p>
              ) : nonAdminUsers.length === 0 ? (
                <p className="mt-3 text-sm text-violet-600">No users found.</p>
              ) : (
                <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                  {nonAdminUsers.map((user, index) => (
                    <div
                      key={user._id || user.email || index}
                      className="rounded-lg border border-violet-200 bg-white/90 px-3 py-2"
                    >
                      <p className="text-sm font-medium text-slate-800">
                        {user.name || user.displayName || "Unnamed User"}
                      </p>
                      <p className="text-xs text-slate-500">{user.email || "No email"}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-700">
                            {user.role || "customer"}
                          </p>
                          {user.isBlocked && (
                            <p className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-rose-700">
                              Blocked
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleUserBlockToggle(user)}
                          disabled={updatingUserId === user._id}
                          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold text-white ${
                            user.isBlocked
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                              : "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {updatingUserId === user._id
                            ? "Updating..."
                            : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
