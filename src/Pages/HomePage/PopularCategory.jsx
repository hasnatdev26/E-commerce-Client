import { Link } from "react-router-dom";
import { useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import LazyLoader from "../../LazyLoader/LazyLoader";


const PopularCategory = () => {
  const axiosPublic = useAxiosPublic();
  const [showAll, setShowAll] = useState(false);

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["popular-categories"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/popular-categories");
      return data;
    },
  });

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading categories...
      </p>
    );
  }

  /* ================= ERROR ================= */
  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load categories
      </p>
    );
  }

  /* ================= EMPTY ================= */
  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">
          No categories available right now
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Please check back later
        </p>
      </div>
    );
  }

  /* ================= VIEW LIMIT ================= */
  const visibleCategories = showAll
    ? categories
    : categories.slice(0, 6);

  return (
    <div className="px-4 py-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-medium">
            Popular Categories
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Find your perfect product in just one click.
          </p>
        </div>

        {/* View All / Show Less */}
        {categories.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-500 text-xs sm:text-sm font-medium hover:underline"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* ================= GRID ================= */}
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          gap-4
        "
      >
        {visibleCategories.map((category, index) => (
          <Link
            to={`/category/${category.category}`}
            key={index}
            className="
              border border-blue-500 rounded-lg bg-white
              h-48 flex flex-col items-center justify-between
              p-4 hover:shadow-lg transition
            "
          >
            {/* Image (Lazy Loaded) */}
            <div className="w-24 h-24 flex items-center justify-center">
              <LazyLoader
                src={category.categoryImage}
                alt={category.category || "Category image"}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Text */}
            <div className="text-center">
              <h4 className="font-medium text-sm truncate w-32 mx-auto">
                {category.category || "Unnamed Category"}
              </h4>
              <p className="text-blue-500 text-xs mt-1">
                {category.count || 0}{" "}
                {category.count === 1 ? "Item" : "Items"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularCategory;
