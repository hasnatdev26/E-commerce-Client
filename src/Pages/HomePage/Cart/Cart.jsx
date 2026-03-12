import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import Sidebar from "../../../Components/Sidebar/Sidebar";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useRole from "../../../Hooks/useRole";

const Cart = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, roleLoading] = useRole();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  /* =====================
     LOAD CART
  ===================== */
  useEffect(() => {
    if (!user || roleLoading) return;

    if (role === "admin") {
      setLoading(false);
      return;
    }

    const loadCart = async () => {
      try {
        const res = await axiosSecure.get(`/carts?email=${user.email}`);
        setCart(res.data);
      } catch {
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user, axiosSecure, role, roleLoading]);

  /* =====================
     REMOVE ITEM
  ===================== */
  const handleRemove = async (id) => {
    try {
      await axiosSecure.delete(`/carts/${id}`);

      setCart((prev) => prev.filter((item) => item._id !== id));

      // Instantly update cart badge everywhere
      window.dispatchEvent(new Event("cart-updated"));

      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  /* =====================
     UPDATE QUANTITY
  ===================== */
  const updateQuantity = async (item, newQty) => {
    if (newQty < 1) return;

    if (newQty > item.quantity) {
      toast.error(`Only ${item.quantity} items available`);
      return;
    }

    try {
      await axiosSecure.patch(`/carts/${item._id}`, {
        cartQuantity: newQty,
      });

      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, cartQuantity: newQty }
            : cartItem
        )
      );
    } catch {
      toast.error("Stock limit exceeded");
    }
  };

  /* =====================
     TOTAL PRICE
  ===================== */
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );

  /* =====================
     CHECKOUT
  ===================== */
  const handleCheckout = () => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);

    setTimeout(() => {
      navigate("/checkout", {
        state: {
          cartItems: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.cartQuantity,
            image: item.cartImage,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            stock: item.quantity,
          })),
        },
      });
    }, 1000);
  };

  if (loading || roleLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 bg-white">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (role === "admin") {
    return (
      <div className="max-w-7xl mx-auto p-4 bg-white">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-600">Admin users cannot access cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* ================= SIDEBAR ================= */}
        <aside className="hidden md:block md:w-1/4">
          <Sidebar />
        </aside>

        {/* ================= MAIN ================= */}
        <main className="w-full md:w-3/4 flex flex-col min-h-[80vh]">
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Cart Summary
            </h2>

            {cart.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-gray-400 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <>
                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-12 border-b border-blue-500 pb-2 text-sm font-medium text-gray-500">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-1 text-center">Color</div>
                    <div className="col-span-1 text-center">Size</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-center">Total</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="grid grid-cols-12 items-center border-b border-blue-200 py-4 text-sm"
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <img
                          src={item.cartImage}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border border-blue-200"
                        />
                        <p className="font-medium text-gray-800 line-clamp-3">
                          {item.name}
                        </p>
                      </div>

                      <div className="col-span-1 text-center">
                        {item.selectedColor || "None"}
                      </div>

                      <div className="col-span-1 text-center">
                        {item.selectedSize || "None"}
                      </div>

                      <div className="col-span-2 text-center font-semibold text-red-600">
                        Tk {item.price}
                      </div>

                      <div className="col-span-1 flex justify-center gap-2">
                        <button
                          disabled={item.cartQuantity <= 1}
                          onClick={() =>
                            updateQuantity(item, item.cartQuantity - 1)
                          }
                          className="text-red-500 text-lg disabled:opacity-40"
                        >
                          -
                        </button>

                        <span className="font-medium">{item.cartQuantity}</span>

                        <button
                          onClick={() => {
                            if (item.cartQuantity >= item.quantity) {
                              toast.error("Stock limit reached");
                              return;
                            }
                            updateQuantity(item, item.cartQuantity + 1);
                          }}
                          className={`text-red-500 text-lg ${
                            item.cartQuantity >= item.quantity
                              ? "opacity-40 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <div className="col-span-2 text-center font-semibold">
                        Tk {item.price * item.cartQuantity}
                      </div>

                      <div className="col-span-1 text-center">
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ================= MOBILE VIEW ================= */}
                <div className="md:hidden space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="border border-blue-300 rounded-lg p-4"
                    >
                      <div className="flex gap-3 mb-3">
                        <img
                          src={item.cartImage}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded border border-blue-200"
                        />
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-3">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Color: {item.selectedColor || "None"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {item.selectedSize || "None"}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between mb-2 text-sm">
                        <span>Price</span>
                        <span className="font-semibold text-red-600">
                          Tk {item.price}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span>Quantity</span>
                        <div className="flex gap-2 items-center">
                          <button
                            disabled={item.cartQuantity <= 1}
                            onClick={() =>
                              updateQuantity(item, item.cartQuantity - 1)
                            }
                            className="text-lg text-red-500 disabled:opacity-40"
                          >
                            -
                          </button>

                          <span>{item.cartQuantity}</span>

                          <button
                            onClick={() => {
                              if (item.cartQuantity >= item.quantity) {
                                toast.error("Stock limit reached");
                                return;
                              }
                              updateQuantity(item, item.cartQuantity + 1);
                            }}
                            className={`text-lg text-red-500 ${
                              item.cartQuantity >= item.quantity
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between font-semibold mb-2">
                        <span>Total</span>
                        <span>Tk {item.price * item.cartQuantity}</span>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* ================= TOTAL SECTION ================= */}
                <div className="mt-auto border border-blue-400 bg-blue-50 p-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total Item Price</span>
                    <span className="font-bold text-lg">Tk {totalPrice}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full bg-red-600 text-white py-2 font-semibold hover:bg-red-700 disabled:opacity-70"
                  >
                    {checkoutLoading ? "Processing..." : "PROCEED TO CHECKOUT"}
                  </button>
                </div>
              </>
            )}

            <Link to="/all-products">
              <button className="w-full mt-3 border border-blue-500 py-2 text-blue-600 font-semibold hover:bg-blue-50">
                CONTINUE SHOPPING
              </button>
            </Link>
          </>
        </main>
      </div>
    </div>
  );
};

export default Cart;
