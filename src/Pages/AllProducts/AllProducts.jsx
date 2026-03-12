// AllProducts.jsx
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Card from "../../Components/Card/Card";

const AllProducts = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await axiosPublic.get("/all-products");
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute cache
    refetchOnWindowFocus: false,
  });

  /* ================= LOADING STATE ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load products</p>
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (!isLoading && !isError && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  /* ================= DATA RENDER ================= */
  return (
    <div className="py-6 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>
    </div>
  </div>
  );
};

export default AllProducts;
