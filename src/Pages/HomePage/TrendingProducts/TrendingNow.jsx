import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Card from "../../../Components/Card/Card";

const TrendingNow = () => {
  const axiosPublic = useAxiosPublic();
  const [showAll, setShowAll] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/products");
      return data;
    },
  });

  /* ============ Loading State ============ */
  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading products...
      </p>
    );
  }

  /* ============ Error State ============ */
  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load products
      </p>
    );
  }

  /* ============ FILTER: ONLY Trending Now ============ */
  const trendingProducts = products.filter(
    (product) => product.productType === "Trending Now"
  );

  /* ============ LIMIT LOGIC ============ */
  const visibleProducts = showAll
    ? trendingProducts
    : trendingProducts.slice(0, 6);

  return (
    <div className="px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-2 sm:mb-0">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Trending Now
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            What’s hot and trending right now.
          </p>
        </div>

        {/* View All / Show Less */}
        {trendingProducts.length > 6 && (
          <div className="flex justify-end w-full sm:w-auto">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-500 text-xs sm:text-sm font-medium hover:underline"
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          </div>
        )}
      </div>

      {/* ============ Empty State ============ */}
      {trendingProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">
            No trending products available
          </p>
          <p className="text-sm mt-2">
            Trending items will appear here soon
          </p>
        </div>
      ) : (
        /* ============ Products Grid ============ */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {visibleProducts.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingNow;
