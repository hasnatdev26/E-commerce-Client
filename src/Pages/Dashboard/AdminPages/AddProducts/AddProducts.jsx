import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { imageUpload } from "../../../../Api/utils";

const AddProducts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [colors, setColors] = useState([""]);
  const [sizes, setSizes] = useState([""]);

  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const inputClass =
    "w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400";

  const fileClass =
    "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400";

  const labelClass = "block text-sm font-medium text-gray-700";

  // 🔹 Final Amount Calculation
  const calculateFinalAmount = (p, d) => {
    const priceNum = Number(p) || 0;
    const discountNum = Number(d) || 0;
    const discountAmount = (priceNum * discountNum) / 100;
    setFinalAmount(priceNum - discountAmount);
  };

  // Colors
  const addColorField = () => setColors([...colors, ""]);
  const handleColorChange = (i, v) => {
    const updated = [...colors];
    updated[i] = v;
    setColors(updated);
  };

  // Sizes
  const addSizeField = () => setSizes([...sizes, ""]);
  const handleSizeChange = (i, v) => {
    const updated = [...sizes];
    updated[i] = v;
    setSizes(updated);
  };

  /* =====================
     SUBMIT HANDLER
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setIsLoading(true);

    try {
      const productImages = [
        form.productImage1.files[0],
        form.productImage2.files[0],
        form.productImage3.files[0],
      ];
      const categoryImageFile = form.categoryImage.files[0];

      if (productImages.some((img) => !img) || !categoryImageFile) {
        toast.error("সব ছবি সিলেক্ট করুন");
        setIsLoading(false);
        return;
      }

      // Upload images
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
        images: productImageUrls,
        categoryImage: categoryImageUrl,
        admin: {
          name: user?.displayName || "Unknown",
          email: user?.email,
        },
      };

      const res = await axiosSecure.post("/products", product);

      if (res.data.insertedId) {
        toast.success("Product added successfully");
        form.reset();
        setColors([""]);
        setSizes([""]);
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
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Product Name */}
        <div>
          <label className={labelClass}>Product Name</label>
          <input name="name" className={inputClass} required />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" rows="4" className={inputClass} required />
        </div>

        {/* Price / Discount / Final Amount / Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              className={inputClass}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                calculateFinalAmount(e.target.value, discount);
              }}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Discount (%)</label>
            <input
              type="number"
              className={inputClass}
              required
              onChange={(e) => {

                setDiscount(Number(e.target.value));
                calculateFinalAmount(price, e.target.value);
              }}
            />
          </div>

          <div>
            <label className={labelClass}>Final Amount</label>
            <input
              type="number"
              value={finalAmount}
              readOnly
              className={`${inputClass} bg-gray-100`}
            />
          </div>

          <div>
            <label className={labelClass}>Quantity</label>
            <input name="quantity" type="number" className={inputClass} required />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <select name="category" className={inputClass} required>
            <option value="">Select Category</option>
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
        </div>

        {/* Product Type */}
        <div>
          <label className={labelClass}>Product Type</label>
          <select name="productType" className={inputClass} required>
            <option value="">Select Product Type</option>
            <option>New Arrivals</option>
            <option>Trending Now</option>
            <option>Popular Products</option>
          </select>
        </div>

        {/* Colors */}
        <div>
          <div className="flex justify-between items-center">
            <label className={labelClass}>Colors</label>
            <button
              type="button"
              onClick={addColorField}
              className="text-blue-600 flex items-center gap-1 text-sm"
            >
              <FaPlus /> Add Color
            </button>
          </div>
          {colors.map((c, i) => (
            <input
              key={i}
              value={c}
              onChange={(e) => handleColorChange(i, e.target.value)}
              className={inputClass}
              placeholder={`Color ${i + 1}`}
            />
          ))}
        </div>

        {/* Sizes */}
        <div>
          <div className="flex justify-between items-center">
            <label className={labelClass}>Sizes</label>
            <button
              type="button"
              onClick={addSizeField}
              className="text-blue-600 flex items-center gap-1 text-sm"
            >
              <FaPlus /> Add Size
            </button>
          </div>
          {sizes.map((s, i) => (
            <input
              key={i}
              value={s}
              onChange={(e) => handleSizeChange(i, e.target.value)}
              className={inputClass}
              placeholder={`Size ${i + 1}`}
            />
          ))}
        </div>

        {/* Product Images */}
        <div>
          <label className={labelClass}>Product Images (3)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input type="file" name="productImage1" className={fileClass} accept="image/*" required />
            <input type="file" name="productImage2" className={fileClass} accept="image/*" required />
            <input type="file" name="productImage3" className={fileClass} accept="image/*" required />
          </div>
        </div>

        {/* Category Image */}
        <div>
          <label className={labelClass}>Category Image</label>
          <input type="file" name="categoryImage" className={fileClass} accept="image/*" required />
        </div>

        {/* Submit Button */}
        <button
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="loading loading-infinity loading-md"></span>
              Adding...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
