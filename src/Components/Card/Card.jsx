import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import LazyLoader from "../../LazyLoader/LazyLoader";


const Card = ({ product }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const discount = product.discount || 0;
  const finalAmount = product.finalAmount || product.price;

  // CHECK WISHLIST
  useEffect(() => {
    if (!user) return;

    const loadWishlist = async () => {
      try {
        const res = await axiosPublic.get(
          `/wishlists?email=${user.email}`
        );

        const found = res.data?.some(
          (item) => item.productId === product._id
        );

        setIsWishlisted(found);
      } catch {
        console.log("Wishlist check failed");
      }
    };

    loadWishlist();
  }, [user, product._id, axiosPublic]);

  // TOGGLE WISHLIST
  const handleWishlist = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (isWishlisted) {
        await axiosPublic.delete(
          `/wishlists?productId=${product._id}&email=${user.email}`
        );

        toast.info("Removed from wishlist");
        setIsWishlisted(false);
        window.dispatchEvent(new Event("wishlist-updated"));
      } else {
        const wishlistItem = {
          productId: product._id,
          name: product.name,
          image: product.images?.[0],
          price: finalAmount,
          quantity: product.quantity,
          userEmail: user.email,
        };

        await axiosPublic.post("/wishlists", wishlistItem);

        toast.success("Added to wishlist");
        setIsWishlisted(true);
        window.dispatchEvent(new Event("wishlist-updated"));
      }
    } catch {
      toast.error("Wishlist action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/product-details/${product._id}`}>
      <div className="bg-white border border-blue-500 hover:shadow-md transition p-3 flex flex-col w-full relative rounded-lg h-full">
        
        {/* IMAGE */}
        <div className="relative mb-3">
          <LazyLoader
            src={
              product.images?.[0] ||
              product.categoryImage ||
              "https://via.placeholder.com/150"
            }
            alt={product.name}
            className="h-32 sm:h-36 md:h-40 lg:h-44 object-contain mx-auto"
          />

          {/* WISHLIST */}
          <button
            onClick={handleWishlist}
            disabled={loading}
            className={`absolute -top-2 -left-2 text-lg transition ${
              isWishlisted
                ? "text-red-500"
                : "text-blue-500 hover:text-red-600"
            }`}
          >
            {isWishlisted ? <FaHeart /> : <CiHeart />}
          </button>

          {/* DISCOUNT */}
          {discount > 0 && (
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}%
            </div>
          )}
        </div>

        {/* NAME */}
        <h3
          className="text-xs font-medium mb-2 min-h-[32px]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </h3>

        {/* PRICE + CART */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {discount > 0 ? (
              <>
                <span className="text-gray-400 line-through text-xs">
                  ৳ {product.price}
                </span>
                <p className="text-sm font-semibold text-blue-500">
                  ৳ {finalAmount}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-blue-500">
                ৳ {product.price}
              </p>
            )}
          </div>

          <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;
