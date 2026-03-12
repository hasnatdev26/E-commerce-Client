import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";

import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import QuestionForm from "../QuestionFrom/QuestionFrom";
import Card from "../Card/Card";
import LazyLoader from "../../LazyLoader/LazyLoader";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [role, roleLoading] = useRole();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("Description");

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loadingCart, setLoadingCart] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);

  // ⭐ Scroll to top on product change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // ---------- LOAD MAIN PRODUCT ----------
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axiosPublic.get(`/products/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data?.images?.[0] || "");
      } catch {
        toast.error("Failed to load product ❌");
      }
    };
    loadProduct();
  }, [id, axiosPublic]);

  // ---------- LOAD RELATED PRODUCTS ----------
  useEffect(() => {
    if (!product?.category) return;

    const loadRelated = async () => {
      try {
        const res = await axiosPublic.get(`/products`);
        const filtered = res.data.filter(
          (p) => p.category === product.category && p._id !== product._id
        );
        setRelatedProducts(filtered);
      } catch {
        console.log("related products failed");
      }
    };

    loadRelated();
  }, [product, axiosPublic]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  const {
    _id,
    name,
    description,
    price,
    finalAmount,
    discount,
    quantity,
    images,
    colors,
    sizes,
    keyFeatures = [],
  } = product;

  const isOutOfStock = quantity <= 0;

  // ---------- VALIDATION ----------
  const validateAction = () => {
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return false;
    }

    if (!user) {
      toast.warning("Please login first");
      navigate("/login");
      return false;
    }
    if (roleLoading) {
      toast.info("Please wait...");
      return false;
    }

    if (role === "admin") {
      toast.error("Admin users can't buy or add to cart");
      return false;
    }

    if (colors?.length > 0 && !selectedColor) {
      toast.warning("Please select a color");
      return false;
    }

    if (sizes?.length > 0 && !selectedSize) {
      toast.warning("Please select a size");
      return false;
    }

    return true;
  };

  // ---------- ADD TO CART ----------
  const handleAddToCart = async () => {
    if (!validateAction()) return;

    const cartItem = {
      productId: _id,
      name,
      price: finalAmount,
      productStock: quantity,
      cartImage: selectedImage,
      selectedColor,
      selectedSize,
      cartQuantity: 1,
      userEmail: user.email,
    };

    try {
      setLoadingCart(true);
      await axiosSecure.post("/carts", cartItem);
      toast.success("Added to cart");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Add to cart failed");
    } finally {
      setLoadingCart(false);
    }
  };

  // ---------- BUY NOW ----------
  const handleBuyNow = () => {
    if (!validateAction()) return;

    navigate("/single-checkout", {
      state: {
        product: {
          productId: _id,
          name,
          price: finalAmount,
          quantity: 1,
          productStock: quantity,
          image: selectedImage,
          selectedColor,
          selectedSize,
        },
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 py-6">
      {/* ---------- PRODUCT TOP GRID ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IMAGE SECTION */}
        <div>
          <LazyLoader
            src={selectedImage}
            alt={name}
            className="w-full h-[300px] md:h-[420px] object-contain border border-blue-500 rounded"
          />

          <div className="flex gap-2 mt-3 overflow-x-auto">
            {images?.map((img, i) => (
              <LazyLoader
                key={i}
                src={img}
                alt={`${name}-${i}`}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 border rounded cursor-pointer ${
                  selectedImage === img
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "hover:border-blue-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* TEXT SECTION */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{name}</h2>

          {keyFeatures.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold mb-1">Key Features</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {keyFeatures.slice(0, 5).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {colors?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-1">Color</h4>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 border rounded ${
                      selectedColor === c ? "border-blue-500 bg-blue-50" : ""
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-1">Size</h4>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === s ? "border-blue-500 bg-blue-50" : ""
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 font-semibold">
            {isOutOfStock ? (
              <span className="text-red-600">Out of Stock</span>
            ) : (
              <span className="text-green-600">Stock: {quantity}</span>
            )}
          </div>

          <div className="mt-5">
            <p className="line-through text-gray-400">৳ {price}</p>
            <p className="text-3xl font-bold">৳ {finalAmount}</p>
            <p className="text-sm text-green-600">You save {discount}%</p>
          </div>

          <div className="mt-5 flex gap-3 flex-wrap">
            <button
              onClick={handleAddToCart}
              disabled={loadingCart || roleLoading || role === "admin"}
              className={`border px-4 py-2 rounded-full flex items-center gap-2 ${
                roleLoading || role === "admin"
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-blue-500 text-blue-500 hover:bg-blue-50"
              }`}
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={loadingCart || roleLoading || role === "admin"}
              className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                roleLoading || role === "admin"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
            >
              Buy Now <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- TABS ---------- */}
      <div className="mt-10">
        <div className="flex gap-6 border-b border-gray-300">
          {["Description", "Questions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4 text-gray-700 whitespace-pre-line">
          {activeTab === "Description" && description}
          {activeTab === "Questions" && (
            <QuestionForm productId={_id} productName={name} />
          )}
        </div>
      </div>

      {/* ---------- RELATED PRODUCTS ---------- */}
      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            {relatedProducts.map((item) => (
              <Card key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
