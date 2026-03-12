import { X } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Sidebar from "../../../Components/Sidebar/Sidebar";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

const WishList = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  /* =====================
        LOAD WISHLIST
  ===================== */
  const {
    data: wishlist = [],
    isLoading,
    isError,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["wishlist", user?.email],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/wishlists?email=${user.email}`
      );
      return data;
    },
  });

  /* =====================
        REMOVE ITEM
  ===================== */
const handleRemove = async (productId) => {
  try {
    await axiosPublic.delete(
      `/wishlists?productId=${productId}&email=${user.email}`
    );

    toast.success("Removed from wishlist");

    // ⭐ instantly update navbar / badges
    window.dispatchEvent(new Event("wishlist-updated"));

    // 🔄 react-query refetch
    queryClient.invalidateQueries(["wishlist", user?.email]);

  } catch {
    toast.error("Failed to remove item");
  }
};


  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 bg-white">
      <div className="flex flex-col md:flex-row gap-6">

        {/* ================= SIDEBAR ================= */}
        <aside className="hidden md:block md:w-1/4">
          <Sidebar />
        </aside>

        {/* ================= MAIN ================= */}
        <main className="w-full md:w-3/4 flex flex-col min-h-[80vh]">

          {isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500 text-lg">Loading wishlist...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-red-500 text-lg">
                Failed to load wishlist
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                Wishlist
              </h2>

              {wishlist.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-gray-400 text-lg">
                    ❤️ Your wishlist is empty
                  </p>
                </div>
              ) : (
                <>
                  {/* ================= DESKTOP ================= */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-12 border-b border-blue-500 pb-2 text-sm font-medium text-gray-500">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-2 text-center">Price</div>
                      <div className="col-span-2 text-center">Stock</div>
                      <div className="col-span-2 text-center">Action</div>
                    </div>

                    {wishlist.map((item) => (
                      <div
                        key={item._id}
                        className="grid grid-cols-12 items-center border-b border-blue-200 py-4 text-sm"
                      >
                        <Link
                          to={`/product-details/${item.productId}`}
                          className="col-span-6 flex items-center gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded border border-blue-200"
                          />
                          <p className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                            {item.name}
                          </p>
                        </Link>

                        <div className="col-span-2 text-center font-semibold text-red-600">
                          ৳ {item.price}
                        </div>

                        <div
                          className={`col-span-2 text-center ${
                            item.quantity > 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {item.quantity > 0
                            ? `In stock (${item.quantity})`
                            : "Out of stock"}
                        </div>

                        <div className="col-span-2 text-center">
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ================= MOBILE ================= */}
                  <div className="md:hidden space-y-4">
                    {wishlist.map((item) => (
                      <div
                        key={item._id}
                        className="border border-blue-300 rounded-lg p-4 relative"
                      >
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <X size={18} />
                        </button>

                        <Link
                          to={`/product-details/${item.productId}`}
                          className="flex gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded border border-blue-200"
                          />

                          <div>
                            <p className="font-medium text-gray-800 line-clamp-2">
                              {item.name}
                            </p>

                            <p className="font-semibold text-red-600">
                              ৳ {item.price}
                            </p>

                            <p
                              className={`text-sm ${
                                item.quantity > 0
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {item.quantity > 0
                                ? `In stock (${item.quantity})`
                                : "Out of stock"}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-auto pt-6">
                <Link to="/products">
                  <button className="w-full border border-blue-500 py-2 text-blue-600 font-semibold hover:bg-blue-50 transition">
                    CONTINUE SHOPPING
                  </button>
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default WishList;
