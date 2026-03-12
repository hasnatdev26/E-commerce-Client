import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { imageUpload } from "../../../../Api/utils";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const AddProducts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [colors, setColors] = useState([""]);
  const [sizes, setSizes] = useState([""]);
  const [features, setFeatures] = useState([""]);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const inputClass =
    "w-full mt-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm sm:text-base";
  const fileClass =
    "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm";
  const labelClass = "block text-sm font-medium text-gray-700";

  /* ================= FINAL PRICE ================= */
  const calculateFinalAmount = (p, d) => {
    const priceNum = Number(p) || 0;
    const discountNum = Number(d) || 0;
    setFinalAmount(priceNum - (priceNum * discountNum) / 100);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target;

    if (features.filter(Boolean).length === 0) {
      toast.error("Please add at least one key feature");
      setIsLoading(false);
      return;
    }

    try {
      const productImages = [
        form.productImage1.files[0],
        form.productImage2.files[0],
        form.productImage3.files[0],
      ];
      const categoryImageFile = form.categoryImage.files[0];

      if (productImages.some((img) => !img) || !categoryImageFile) {
        toast.error("Please select all required images");
        setIsLoading(false);
        return;
      }

      const productImageUrls = await Promise.all(
        productImages.map((img) => imageUpload(img))
      );
      const categoryImageUrl = await imageUpload(categoryImageFile);

      const product = {
        name: form.name.value,
        description: form.description.value,
        price,
        discount,
        finalAmount,
        quantity: Number(form.quantity.value),
        category: form.category.value,
        productType: form.productType.value,
        colors: colors.filter(Boolean),
        sizes: sizes.filter(Boolean),
        keyFeatures: features.filter(Boolean),
        images: productImageUrls,
        categoryImage: categoryImageUrl,
        admin: {
          name: user?.displayName,
          email: user?.email,
        },
      };

      const res = await axiosSecure.post("/products", product);

      if (res.data.insertedId) {
        toast.success("Product added successfully");
        form.reset();
        setColors([""]);
        setSizes([""]);
        setFeatures([""]);
        setPrice(0);
        setDiscount(0);
        setFinalAmount(0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 bg-white">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">

        {/* Sidebar */}
        <aside className="hidden md:block md:w-1/4">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="w-full md:w-3/4">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg border border-blue-500 p-4 sm:p-6 space-y-4 sm:space-y-5"
          >

            {/* Product Name */}
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                name="name"
                placeholder="e.g. Apple AirPods Pro (3rd Gen)"
                className={inputClass}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Write a detailed product description"
                className={inputClass}
                required
              />
            </div>

            {/* Key Features */}
            <div>
              <div className="flex justify-between items-center">
                <label className={labelClass}>
                  Key Features <span className="text-xs text-gray-400">(max 5)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (features.length >= 5) {
                      toast.error("Maximum 5 key features allowed");
                      return;
                    }
                    setFeatures([...features, ""]);
                  }}
                  className="text-blue-600 text-sm flex items-center gap-1"
                >
                  <FaPlus /> Add
                </button>
              </div>

              {features.map((f, i) => (
                <input
                  key={i}
                  value={f}
                  placeholder={`Feature ${i + 1} (e.g. Fast Charging)`}
                  onChange={(e) => {
                    const arr = [...features];
                    arr[i] = e.target.value;
                    setFeatures(arr);
                  }}
                  className={inputClass}
                />
              ))}
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="number"
                placeholder="Price (e.g. 5000)"
                className={inputClass}
                onChange={(e) => {
                  setPrice(e.target.value);
                  calculateFinalAmount(e.target.value, discount);
                }}
                required
              />
              <input
                type="number"
                placeholder="Discount % (e.g. 10)"
                className={inputClass}
                onChange={(e) => {
                  setDiscount(e.target.value);
                  calculateFinalAmount(price, e.target.value);
                }}
                required
              />
              <input
                type="number"
                value={finalAmount}
                placeholder="Final price (auto)"
                readOnly
                className={`${inputClass} bg-gray-100`}
              />
              <input
                name="quantity"
                type="number"
                placeholder="Available quantity"
                className={inputClass}
                required
              />
            </div>

            {/* Category */}
            <select name="category" className={inputClass} required>
              <option value="">Select product category</option>
              <option>Electronics</option>
              <option>Fashion & Clothing</option>
              <option>Home & Kitchen</option>
              <option>Grocery & Daily Needs</option>
              <option>Beauty & Personal Care</option>
              <option>Health & Pharmacy</option>
              <option>Sports & Fitness</option>
              <option>Toys & Baby Products</option>
              <option>Books & Stationery</option>
              <option>Automobile Accessories</option>
              <option>Furniture & Home Decor</option>
            </select>

            {/* Product Type */}
            <select name="productType" className={inputClass} required>
              <option value="">Select product type</option>
              <option>New Arrivals</option>
              <option>Trending Now</option>
              <option>Popular Products</option>
            </select>

            {/* Colors */}
            <div>
              <label className={labelClass}>Colors</label>
              {colors.map((c, i) => (
                <input
                  key={i}
                  value={c}
                  placeholder={`Color ${i + 1} (e.g. Black)`}
                  onChange={(e) => {
                    const arr = [...colors];
                    arr[i] = e.target.value;
                    setColors(arr);
                  }}
                  className={inputClass}
                />
              ))}
              <button
                type="button"
                onClick={() => setColors([...colors, ""])}
                className="text-blue-600 text-sm mt-1"
              >
                <FaPlus /> Add Color
              </button>
            </div>

            {/* Sizes */}
            <div>
              <label className={labelClass}>Sizes</label>
              {sizes.map((s, i) => (
                <input
                  key={i}
                  value={s}
                  placeholder={`Size ${i + 1} (e.g. M / XL)`}
                  onChange={(e) => {
                    const arr = [...sizes];
                    arr[i] = e.target.value;
                    setSizes(arr);
                  }}
                  className={inputClass}
                />
              ))}
              <button
                type="button"
                onClick={() => setSizes([...sizes, ""])}
                className="text-blue-600 text-sm mt-1"
              >
                <FaPlus /> Add Size
              </button>
            </div>

            {/* Images */}
            <div>
              <label className={labelClass}>Product Images (3)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input type="file" name="productImage1" className={fileClass} required />
                <input type="file" name="productImage2" className={fileClass} required />
                <input type="file" name="productImage3" className={fileClass} required />
              </div>
            </div>

            {/* Category Image */}
            <div>
              <label className={labelClass}>Category Image</label>
              <input type="file" name="categoryImage" className={fileClass} required />
            </div>

            {/* Submit */}
            <button
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>

          </form>
        </main>
      </div>
    </div>
  );
};

export default AddProducts;
