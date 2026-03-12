import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import ManageProductsTable from "./ManageProductsTable";

const ManageProducts = () => {
  const axiosSecure = useAxiosSecure();

  /* ================= LOAD PRODUCTS ================= */
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manage-products"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/products");
      return data;
    },
  });

  /* ================= DELETE PRODUCT ================= */
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      await axiosSecure.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <p className="text-center py-20 text-gray-500">
        Loading products...
      </p>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">
        Manage Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-400">
          No products found
        </p>
      ) : (
        <ManageProductsTable
          products={products}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ManageProducts;
