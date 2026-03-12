import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import { toast } from "react-toastify";

const SingleCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, roleLoading] = useRole();

  const product = state?.product || null;

  const [orderLoading, setOrderLoading] = useState(false);

  // User info
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [areaType, setAreaType] = useState("inside");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Payment
  const [paymentMethod] = useState("sslcommerz");

  const [errors, setErrors] = useState({});


  /* =====================
     SAFETY
  ===================== */
  useEffect(() => {
    if (!product) navigate("/");
  }, [product, navigate]);

  if (!product) return null;
  if (roleLoading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading checkout...
      </p>
    );
  }
  if (role === "admin") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-600">
        Admin users can’t place orders. Please use a customer account.
      </div>
    );
  }

  const DELIVERY_FEE = areaType === "inside" ? 100 : 150;

  /* =====================
     PRICE
  ===================== */
  const subTotal = product.price * product.quantity;
  const totalQuantity = product.quantity;
  const totalPrice = subTotal;

  /* =====================
     VALIDATION
  ===================== */
  const validate = () => {
    const newErrors = {};

    if (!phone) newErrors.phone = "Phone number is required";
    else if (!/^01\d{9}$/.test(phone))
      newErrors.phone = "Enter valid Bangladeshi number";

    if (!district) newErrors.district = "District is required";
    if (!address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =====================
     PLACE ORDER
  ===================== */
  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setOrderLoading(true);

    const orderData = {
      userEmail: user.email,
      userName: user.displayName || user.name || "Guest User",
      phone,
      district,
      areaType,
      address,
      notes,

      items: [
        {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.image,
          color: product.selectedColor || null,
          size: product.selectedSize || null,
        },
      ],

      totalQuantity,
      subTotal,
      deliveryFee: DELIVERY_FEE,
      totalAmount: totalPrice + DELIVERY_FEE,
      paymentMethod,
      customer: {
        name: user.displayName || user.name || "Customer",
        phone,
        address,
        city: district,
        postcode: "0000",
        country: "Bangladesh",
      },
      shipping: {
        name: user.displayName || user.name || "Customer",
        phone,
        address,
        city: district,
        postcode: "0000",
        country: "Bangladesh",
      },
    };

    try {
      const res = await axiosSecure.post("/payment/init", orderData);
      const gatewayUrl = res.data?.gatewayUrl;

      if (!gatewayUrl) {
        throw new Error("Gateway URL missing");
      }

      window.location.replace(gatewayUrl);
    } catch (error) {
      setOrderLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to place order ???"
      );
    }
  };

  /* =====================
     UI HELPERS
  ===================== */
  const inputClass = (field) =>
    `w-full px-3 py-2 rounded border ${
      errors[field] ? "border-red-500" : "border-blue-400"
    } focus:outline-none focus:border-blue-600`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">
        Checkout
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 bg-white border border-blue-400 rounded-lg p-6 space-y-5">
          <h3 className="text-lg font-semibold text-blue-600">
            Shipping Details
          </h3>

          <input
            value={user?.email || ""}
            disabled
            className="w-full border border-blue-300 px-3 py-2 rounded bg-blue-50"
          />

          <input
            className={inputClass("phone")}
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className={inputClass("district")}
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />

          <select
            className="w-full border border-blue-400 px-3 py-2 rounded focus:border-blue-600"
            value={areaType}
            onChange={(e) => setAreaType(e.target.value)}
          >
            <option value="inside">Dhaka (Inside) – ৳100</option>
            <option value="outside">Outside Dhaka – ৳150</option>
          </select>

          <textarea
            rows="3"
            className={inputClass("address")}
            placeholder="Full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <textarea
            rows="2"
            className="w-full border border-blue-400 px-3 py-2 rounded focus:border-blue-600"
            placeholder="Order notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            Delivery charge: Tk {DELIVERY_FEE} will be added to the total
            amount.
          </p>

        </div>

        {/* RIGHT */}
        <div className="bg-white border border-blue-400 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">
            Order Summary
          </h3>

          <p className="text-sm text-gray-500 mb-3">
            Total Quantity: {totalQuantity}
          </p>

          <div className="flex gap-3 items-center border-b border-blue-200 py-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 object-cover rounded border border-blue-300"
            />

            <div className="flex-1">
              <p className="text-sm font-medium">
                {product.name} × {product.quantity}
              </p>
              <p className="text-xs text-gray-500">
                {product.selectedColor && `Color: ${product.selectedColor}`}{" "}
                {product.selectedSize && `| Size: ${product.selectedSize}`}
              </p>
            </div>

            <span className="text-sm font-semibold">
              ৳ {subTotal}
            </span>
          </div>

          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total</span>
            <span>Tk {totalPrice + DELIVERY_FEE}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={orderLoading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-70"
          >
            {orderLoading ? "Processing..." : "PAY NOW"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleCheckout;
