import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Card from "../../Components/Card/Card";

const CategoryProducts = () => {
  const { category } = useParams();
  const axiosPublic = useAxiosPublic();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category-products", category],
    enabled: !!category,
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/products?category=${encodeURIComponent(category)}`
      );
      return data;
    },
  });

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base">
          Loading products...
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm sm:text-base">
          Failed to load products
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
      {/* ================= HEADER ================= */}
      <h2
        className="
          text-lg sm:text-xl md:text-2xl
          font-semibold mb-4 sm:mb-6 capitalize
        "
      >
        {decodeURIComponent(category)} Products
      </h2>

      {/* ================= EMPTY ================= */}
      {products.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-gray-400 text-sm sm:text-base">
            No products found in this category
          </p>
        </div>
      ) : (
        /* ================= GRID ================= */
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-3 sm:gap-4
          "
        >
          {products.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
