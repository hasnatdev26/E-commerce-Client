import { Link } from "react-router-dom";

const MyOrdersTable = ({ orders }) => {
  const sortedOrders = [...orders].sort(
    (a, b) => b.orderTimestamp - a.orderTimestamp
  );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "returned":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDateTime = (time) =>
    new Date(time).toLocaleString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <div className="grid grid-cols-12 border-b border-blue-500 pb-2 text-sm font-medium text-gray-500">
          <div className="col-span-5">Products</div>
          <div className="col-span-2 text-center">Date & Time</div>
          <div className="col-span-1 text-center">Payment</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Total</div>
        </div>

        {sortedOrders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-12 items-start border-b border-blue-200 py-4 text-sm"
          >
            <div className="col-span-5 space-y-2">
              {order.items.map((item, index) => (
                <div key={index}>
                  <p className="font-medium truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} | Color: {item.color || "N/A"} | Size:{" "}
                    {item.size || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            <div className="col-span-2 text-center text-xs text-gray-600">
              {formatDateTime(order.orderTime)}
            </div>

            <div className="col-span-1 text-center uppercase text-gray-600">
              {order.paymentMethod}
            </div>

            <div className="col-span-2 text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="col-span-2 text-center font-semibold text-red-600">
              ৳ {order.totalPrice}
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE VIEW ================= */}
  {/* ================= MOBILE VIEW ================= */}
<div className="md:hidden space-y-4">
  {sortedOrders.map((order) => (
    <div
      key={order._id}
      className="border border-blue-300 rounded-lg p-4 space-y-4"
    >
      {/* PRODUCTS */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Products</p>

        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 mb-3"
          >
            {/* LEFT TEXT */}
            <div className="flex-1">
              <p
                className="text-sm font-medium max-w-[160px]"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.name}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Qty: {item.quantity} | Color: {item.color || "N/A"} | Size:{" "}
                {item.size || "N/A"}
              </p>
            </div>

            {/* RIGHT IMAGE */}
            <div className="w-14 h-14 flex-shrink-0 border border-blue-600 rounded">
              <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* DATE */}
      <div className="flex justify-between text-xs">
        <span>Date</span>
        <span>{formatDateTime(order.orderTime)}</span>
      </div>

      {/* PAYMENT */}
      <div className="flex justify-between text-xs">
        <span>Payment</span>
        <span className="uppercase">{order.paymentMethod}</span>
      </div>

      {/* STATUS */}
      <div className="flex justify-between text-xs">
        <span>Status</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* TOTAL */}
      <div className="flex justify-between font-semibold pt-2 border-t border-gray-300">
        <span>Total</span>
        <span className="text-red-600">
          ৳ {order.totalPrice}
        </span>
      </div>
    </div>
  ))}
</div>


      {/* ================= CONTINUE SHOPPING ================= */}
      <div className="mt-auto pt-6">
        <Link to="/all-products">
          <button className="w-full border border-blue-500 py-2 text-blue-600 font-semibold hover:bg-blue-50 transition">
            CONTINUE SHOPPING
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MyOrdersTable;
