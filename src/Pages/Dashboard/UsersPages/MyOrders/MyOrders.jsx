import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import MyOrdersTable from "./MyOrdersTable";

const MyOrders = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/customer-orders/${user.email}`
      );
      return data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 bg-white">
      <div className="flex flex-col md:flex-row gap-6">

        {/* ================= SIDEBAR ================= */}
        <aside className="hidden md:block md:w-1/4">
          <Sidebar />
        </aside>

        {/* ================= MAIN ================= */}
        <main className="w-full md:w-3/4 flex flex-col min-h-[80vh]">

          {/* ===== LOADING STATE ===== */}
          {isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500 text-lg">Loading orders...</p>
            </div>
          )}

          {/* ===== ERROR STATE ===== */}
          {isError && !isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-red-500 text-lg">Failed to load orders</p>
            </div>
          )}

          {/* ===== SUCCESS CONTENT ===== */}
          {!isLoading && !isError && (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                Purchase History
              </h2>

              {orders.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-gray-400 text-lg">
                    🛒 You have no orders yet
                  </p>
                </div>
              ) : (
                <MyOrdersTable orders={orders} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyOrders;
