import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import ManageProductsTable from "../ManageProducts/ManageProductsTable";

const Inventory = () => {
  const axiosSecure = useAxiosSecure();

  /* ================= LOAD PRODUCTS ================= */
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["manage-products"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/products");
      return data;
    },
  });

  /* ================= DELETE PRODUCT (SWEET ALERT) ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB", // blue
      cancelButtonColor: "#DC2626",  // red
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete product");
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

          {/* ===== LOADING ===== */}
          {isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500 text-lg">
                Loading products...
              </p>
            </div>
          )}

          {/* ===== ERROR ===== */}
          {isError && !isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-red-500 text-lg">
                Failed to load products
              </p>
            </div>
          )}

          {/* ===== CONTENT ===== */}
          {!isLoading && !isError && (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                Inventory / Manage Products
              </h2>

              {products.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-gray-400 text-lg">
                    No products found
                  </p>
                </div>
              ) : (
                <ManageProductsTable
                  products={products}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Inventory;
