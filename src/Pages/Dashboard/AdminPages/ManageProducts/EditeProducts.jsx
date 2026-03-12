import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { imageUpload } from "../../../../Api/utils";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [product, setProduct] = useState(null);
  const [colors, setColors] = useState([""]);
  const [sizes, setSizes] = useState([""]);

  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const inputClass =
    "w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400";

  const fileClass =
    "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md";

  const labelClass = "block text-sm font-medium text-gray-700";

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    axiosPublic.get(`/products/${id}`).then((res) => {
      const data = res.data;
      setProduct(data);
      setColors(data.colors?.length ? data.colors : [""]);
      setSizes(data.sizes?.length ? data.sizes : [""]);
      setPrice(data.price);
      setDiscount(data.discount);
      setFinalAmount(data.finalAmount);
    });
  }, [id, axiosPublic]);

  /* ================= FINAL AMOUNT ================= */
  const calculateFinalAmount = (p, d) => {
    const priceNum = Number(p) || 0;
    const discountNum = Number(d) || 0;
    setFinalAmount(priceNum - (priceNum * discountNum) / 100);
  };

  /* ================= COLORS ================= */
  const addColorField = () => setColors([...colors, ""]);
  const handleColorChange = (i, v) => {
    const updated = [...colors];
    updated[i] = v;
    setColors(updated);
  };

  /* ================= SIZES ================= */
  const addSizeField = () => setSizes([...sizes, ""]);
  const handleSizeChange = (i, v) => {
    const updated = [...sizes];
    updated[i] = v;
    setSizes(updated);
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setIsLoading(true);

    try {
      let images = product.images;
      let categoryImage = product.categoryImage;

      /* ===== PRODUCT IMAGES (same rule as AddProducts) ===== */
      const productImages = [
        form.productImage1.files[0],
        form.productImage2.files[0],
        form.productImage3.files[0],
      ];

      // যদি ১টা image দিলেই → ৩টাই দিতে হবে
      if (productImages.some((img) => img)) {
        if (productImages.some((img) => !img)) {
          toast.error("৩টি Product Image একসাথে দিন");
          setIsLoading(false);
          return;
        }

        images = await Promise.all(
          productImages.map((img) => imageUpload(img))
        );
      }

      /* ===== CATEGORY IMAGE (optional) ===== */
      if (form.categoryImage.files[0]) {
        categoryImage = await imageUpload(form.categoryImage.files[0]);
      }

      const updatedProduct = {
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
        images,
        categoryImage,
      };

      await axiosSecure.put(`/products/${id}`, updatedProduct);
      toast.success("Product updated successfully");
      navigate("/admin/inventory");

    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return <p className="text-center py-20">Loading...</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Product Name */}
        <div>
          <label className={labelClass}>Product Name</label>
          <input
            name="name"
            defaultValue={product.name}
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
            defaultValue={product.description}
            className={inputClass}
            required
          />
        </div>

        {/* Price / Discount / Final / Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              value={price}
              className={inputClass}
              onChange={(e) => {
                setPrice(e.target.value);
                calculateFinalAmount(e.target.value, discount);
              }}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Discount (%)</label>
            <input
              type="number"
              value={discount}
              className={inputClass}
              onChange={(e) => {
                setDiscount(e.target.value);
                calculateFinalAmount(price, e.target.value);
              }}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Final Amount</label>
            <input
              value={finalAmount}
              readOnly
              className={`${inputClass} bg-gray-100`}
            />
          </div>

          <div>
            <label className={labelClass}>Quantity</label>
            <input
              name="quantity"
              defaultValue={product.quantity}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            defaultValue={product.category}
            className={inputClass}
            required
          >
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
          <select
            name="productType"
            defaultValue={product.productType}
            className={inputClass}
            required
          >
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
            <input type="file" name="productImage1" className={fileClass} />
            <input type="file" name="productImage2" className={fileClass} />
            <input type="file" name="productImage3" className={fileClass} />
          </div>
        </div>

        {/* Category Image */}
        <div>
          <label className={labelClass}>Category Image</label>
          <input type="file" name="categoryImage" className={fileClass} />
        </div>

        <button
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProducts;
