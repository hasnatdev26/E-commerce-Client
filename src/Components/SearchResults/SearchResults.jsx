import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Card from "../../Components/Card/Card";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q");
  const axiosPublic = useAxiosPublic();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["search-products", query],
    enabled: !!query,
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/products/search?q=${query}`
      );
      return data;
    },
  });

  /* =====================
     LOADING STATE
  ===================== */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Searching products...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-6">
        Search Results for "{query}"
      </h2>

      {products.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh] text-gray-400">
          No products found
        </div>
      ) : (
        <div
          className="
            grid grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            gap-4
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

export default SearchResults;
