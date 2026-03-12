import { useQuery } from "@tanstack/react-query";
import {
  FaBoxOpen,
  FaClock,
  FaCog,
  FaCheckCircle,
  FaUndoAlt,
  FaTimesCircle,
} from "react-icons/fa";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import ManageOrdersTable from "./ManageOrdersTable";

const OrderStatCard = ({ title, value, icon, color }) => (
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

const ManageOrders = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/orders");
      return data;
    },
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  const newOrdersCount = orders.filter(
    (order) => order.status?.toLowerCase() === "pending"
  ).length;

  const orderStats = orders.reduce(
    (acc, order) => {
      const status = order.status?.toLowerCase();
      if (status === "pending") acc.pending += 1;
      else if (status === "processing") acc.processing += 1;
      else if (status === "delivered") acc.delivered += 1;
      else if (status === "returned") acc.returned += 1;
      else if (status === "cancelled") acc.cancelled += 1;
      return acc;
    },
    { pending: 0, processing: 0, delivered: 0, returned: 0, cancelled: 0 }
  );

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 rounded-2xl">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block md:w-1/4">
          <Sidebar />
        </aside>

        <main className="w-full md:w-3/4 flex flex-col min-h-[80vh] space-y-6">
          {isLoading && (
            <section className="flex flex-1 items-center justify-center rounded-2xl border border-cyan-200 bg-gradient-to-r from-white to-cyan-50 p-8 shadow-sm">
              <p className="text-gray-500 text-lg">Loading orders...</p>
            </section>
          )}

          {isError && !isLoading && (
            <section className="flex flex-1 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-8">
              <p className="text-red-500 text-lg">Failed to load orders</p>
            </section>
          )}

          {!isLoading && !isError && (
            <>
              <section className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Manage Orders
                  </h1>
                  {newOrdersCount > 0 && (
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-rose-600">
                      {newOrdersCount > 99 ? "99+" : newOrdersCount}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-blue-50">
                  Track every order status and take actions instantly.
                </p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <OrderStatCard
                  title="Total Orders"
                  value={orders.length}
                  icon={<FaBoxOpen className="text-xl text-white" />}
                  color="bg-gradient-to-r from-slate-600 to-slate-800 border-slate-500"
                />
                <OrderStatCard
                  title="Pending"
                  value={orderStats.pending}
                  icon={<FaClock className="text-xl text-white" />}
                  color="bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400"
                />
                <OrderStatCard
                  title="Processing"
                  value={orderStats.processing}
                  icon={<FaCog className="text-xl text-white" />}
                  color="bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400"
                />
                <OrderStatCard
                  title="Delivered"
                  value={orderStats.delivered}
                  icon={<FaCheckCircle className="text-xl text-white" />}
                  color="bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400"
                />
                <OrderStatCard
                  title="Returned"
                  value={orderStats.returned}
                  icon={<FaUndoAlt className="text-xl text-white" />}
                  color="bg-gradient-to-r from-violet-500 to-fuchsia-600 border-violet-400"
                />
                <OrderStatCard
                  title="Cancelled"
                  value={orderStats.cancelled}
                  icon={<FaTimesCircle className="text-xl text-white" />}
                  color="bg-gradient-to-r from-rose-500 to-red-600 border-rose-400"
                />
              </section>

              {orders.length === 0 ? (
                <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-8 shadow-sm">
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-gray-400 text-lg">No orders found</p>
                  </div>
                </section>
              ) : (
                <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50 p-4 shadow-md">
                  <div className="-mx-3 sm:-mx-4 md:mx-0">
                    <ManageOrdersTable orders={orders} refetch={refetch} />
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageOrders;
