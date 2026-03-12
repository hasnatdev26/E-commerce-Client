import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaReceipt,
  FaTimesCircle,
  FaUndoAlt,
  FaUser,
} from "react-icons/fa";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { state: order } = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [status, setStatus] = useState(order?.status);
  const [updating, setUpdating] = useState(false);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-rose-600 text-lg">
        Order data not found
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];

  const formatCurrency = (value) => `Tk ${Number(value || 0).toLocaleString("en-BD")}`;

  const formatDateTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusStyle = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case "pending":
        return "bg-amber-500 text-white";
      case "processing":
        return "bg-blue-600 text-white";
      case "delivered":
        return "bg-emerald-600 text-white";
      case "returned":
        return "bg-violet-600 text-white";
      case "cancelled":
        return "bg-rose-600 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case "pending":
        return <FaClock className="text-xs" />;
      case "processing":
        return <FaCog className="text-xs" />;
      case "delivered":
        return <FaCheckCircle className="text-xs" />;
      case "returned":
        return <FaUndoAlt className="text-xs" />;
      case "cancelled":
        return <FaTimesCircle className="text-xs" />;
      default:
        return <FaBoxOpen className="text-xs" />;
    }
  };

  const handleStatusUpdate = async () => {
    if (status === order.status) return;

    try {
      setUpdating(true);
      await axiosSecure.patch(`/orders/${order._id}`, { status });
      toast.success("Order status updated");
      order.status = status;
    } catch {
      toast.error("Failed to update status");
      setStatus(order.status);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 rounded-2xl">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block md:w-1/4">
          <Sidebar />
        </aside>

        <main className="w-full md:w-3/4 space-y-6">
          <section className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 p-5 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Order Details</h1>
                <p className="mt-1 text-blue-50 text-sm">
                  Order ID: {order._id}
                </p>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-md border border-white/60 bg-white text-blue-700 px-4 py-2 text-sm font-semibold hover:bg-blue-50"
              >
                <FaArrowLeft />
                Back
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-white to-sky-50 p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-sky-800">
                <FaUser />
                Customer Information
              </h2>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p className="text-xl font-bold text-sky-700">{order.userName || "Unknown Customer"}</p>
                <p><strong>Email:</strong> {order.userEmail || "N/A"}</p>
                <p className="inline-flex items-center gap-2"><FaPhoneAlt className="text-xs" /> {order.phone || "N/A"}</p>
                <p><strong>District:</strong> {order.district || "N/A"}</p>
                <p><strong>Area Type:</strong> {order.areaType || "N/A"}</p>
                <p className="inline-flex items-start gap-2"><FaMapMarkerAlt className="mt-0.5 text-xs" /> {order.address || "N/A"}</p>
                {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50 p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-800">
                <FaReceipt />
                Order Information
              </h2>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p><strong>Payment:</strong> {order.paymentMethod || "N/A"}</p>
                <p><strong>Transaction ID:</strong> {order.transactionId || order.trxId || "N/A"}</p>
                <p><strong>Order Time:</strong> {formatDateTime(order.orderTime)}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <strong>Status:</strong>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}>
                    {getStatusIcon(status)}
                    {status || "N/A"}
                  </span>
                </div>

                <div className="rounded-xl border border-indigo-200 bg-white/80 p-3">
                  <label className="text-xs font-medium text-indigo-700">Change Status</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="rounded-md border border-indigo-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="returned">Returned</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating}
                      className="rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1.5 text-sm font-medium text-white hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
                    >
                      {updating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-800">
              <FaBoxOpen />
              Ordered Items
            </h2>

            {items.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No items found in this order.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {items.map((item, index) => {
                  const imageSrc =
                    item.image ||
                    item.imageUrl ||
                    (Array.isArray(item.images) ? item.images[0] : null);

                  return (
                    <div
                      key={`${item?.productId || item?.name || "item"}-${index}`}
                      className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-20 overflow-hidden rounded-md border border-emerald-300 bg-emerald-50">
                          {imageSrc ? (
                            <img src={imageSrc} alt={item?.name || "Product"} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-emerald-500">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{item?.name || "Unnamed Product"}</p>
                          <div className="mt-2 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                            <p><strong>Price:</strong> {formatCurrency(item?.price)}</p>
                            <p><strong>Qty:</strong> {item?.quantity ?? 0}</p>
                            <p><strong>Color:</strong> {item?.color || "N/A"}</p>
                            <p><strong>Size:</strong> {item?.size || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-violet-50 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-fuchsia-800">
              <FaMoneyBillWave />
              Price Summary
            </h2>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between rounded-md bg-white/80 px-3 py-2">
                <span>Sub Total</span>
                <strong>{formatCurrency(order.subTotal)}</strong>
              </div>
              <div className="flex items-center justify-between rounded-md bg-white/80 px-3 py-2">
                <span>Delivery Fee</span>
                <strong>{formatCurrency(order.deliveryFee)}</strong>
              </div>
              <div className="flex items-center justify-between rounded-md bg-white/80 px-3 py-2">
                <span>Total Quantity</span>
                <strong>{order.totalQuantity || 0}</strong>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-fuchsia-300 bg-white px-4 py-3">
              <span className="font-semibold text-fuchsia-800">Total Price</span>
              <span className="text-2xl font-bold text-fuchsia-700">{formatCurrency(order.totalPrice)}</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default OrderDetails;
