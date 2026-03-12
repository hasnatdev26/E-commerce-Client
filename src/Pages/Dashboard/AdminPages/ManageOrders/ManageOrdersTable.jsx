import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const ManageOrdersTable = ({ orders, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const sortedOrders = useMemo(() => {
    const now = Date.now();
    const normalizedSearch = searchText.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      const orderStatus = order.status?.toLowerCase() || "";

      if (statusFilter !== "all" && orderStatus !== statusFilter) {
        return false;
      }

      const orderTimeMs = new Date(order.orderTime).getTime();
      if (dateFilter === "today") {
        const today = new Date();
        const orderDate = new Date(orderTimeMs);
        if (
          orderDate.getFullYear() !== today.getFullYear() ||
          orderDate.getMonth() !== today.getMonth() ||
          orderDate.getDate() !== today.getDate()
        ) {
          return false;
        }
      } else if (dateFilter === "7days") {
        if (!Number.isFinite(orderTimeMs) || now - orderTimeMs > 7 * 24 * 60 * 60 * 1000) {
          return false;
        }
      } else if (dateFilter === "30days") {
        if (!Number.isFinite(orderTimeMs) || now - orderTimeMs > 30 * 24 * 60 * 60 * 1000) {
          return false;
        }
      }

      if (selectedDate) {
        const start = new Date(`${selectedDate}T00:00:00`).getTime();
        const end = new Date(`${selectedDate}T23:59:59`).getTime();
        if (!Number.isFinite(orderTimeMs) || orderTimeMs < start || orderTimeMs > end) {
          return false;
        }
      }

      if (normalizedSearch) {
        const searchSource = [
          order._id,
          order.userName,
          order.userEmail,
          ...(Array.isArray(order.items) ? order.items.map((item) => item?.name) : []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchSource.includes(normalizedSearch)) {
          return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      if (sortFilter === "oldest") return new Date(a.orderTime) - new Date(b.orderTime);
      if (sortFilter === "amount-high") return Number(b.totalPrice ?? 0) - Number(a.totalPrice ?? 0);
      if (sortFilter === "amount-low") return Number(a.totalPrice ?? 0) - Number(b.totalPrice ?? 0);
      return new Date(b.orderTime) - new Date(a.orderTime);
    });
  }, [orders, searchText, statusFilter, dateFilter, sortFilter, selectedDate]);

  const totalPages = Math.max(Math.ceil(sortedOrders.length / rowsPerPage), 1);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, dateFilter, sortFilter, selectedDate]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedOrders.slice(start, start + rowsPerPage);
  }, [sortedOrders, currentPage]);

  const allSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((o) => selectedIds.includes(o._id));

  const toggleSelect = (orderId) => {
    setSelectedIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      const currentPageIds = paginatedOrders.map((o) => o._id);
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      const currentPageIds = paginatedOrders.map((o) => o._id);
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  /* ================= STATUS STYLE ================= */
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
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

  /* ================= DELETE ORDER (ONLY CANCELLED) ================= */
  const handleDeleteOrder = async (order) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/orders/${order._id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Cancelled order has been deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to delete order. Please try again.",
      });
    }
  };

  /* ================= BULK DELETE (CANCELLED ONLY) ================= */
  const handleBulkDelete = async () => {
    const deletableIds = [...selectedIds];

    if (deletableIds.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "No orders selected",
        text: "Please select at least one order.",
        confirmButtonColor: "#2563eb",
      });
    }

    const result = await Swal.fire({
      title: "Delete selected orders?",
      text: `You are deleting ${deletableIds.length} cancelled order(s). This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await Promise.all(
        deletableIds.map((id) => axiosSecure.delete(`/orders/${id}`))
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Selected cancelled orders deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setSelectedIds((prev) =>
        prev.filter((id) => !deletableIds.includes(id))
      );
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to delete selected orders.",
      });
    }
  };

  /* ================= DATE FORMAT ================= */
  const formatDateTime = (time) =>
    new Date(time).toLocaleString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  /* ================= TEXT SHORTENER ================= */
  const truncateText = (text, maxLength = 22) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.slice(0, maxLength) + "…"
      : text;
  };

  /* ================= PRODUCT NAME LOGIC ================= */
  const getProductNames = (order) => {
    if (!order.items || order.items.length === 0) return "N/A";

    const firstProductName = truncateText(order.items[0].name);

    if (order.items.length === 1) {
      return firstProductName;
    }

    return `${firstProductName} and ${order.items.length - 1} more`;
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      <div className="mb-3 rounded-xl border border-blue-400 bg-gradient-to-r from-blue-600 to-cyan-500 p-3 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search name, email, product..."
            className="w-full rounded-md border border-white/70 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-white"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-white/70 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-md border border-white/70 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>

          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            className="w-full rounded-md border border-white/70 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Amount High-Low</option>
            <option value="amount-low">Amount Low-High</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Date"
            className="w-full rounded-md border border-white/70 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-white"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchText("");
                setStatusFilter("all");
                setDateFilter("all");
                setSortFilter("newest");
                setSelectedDate("");
                setRowsPerPage(15);
                setCurrentPage(1);
                setSelectedIds([]);
              }}
              className="w-full whitespace-nowrap rounded-md border border-white/70 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-col items-start justify-between gap-3 rounded-xl border border-blue-400 bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 shadow-sm sm:flex-row sm:items-center">
        <div className="text-sm text-white">
          Selected:{" "}
          <span className="font-semibold text-white">
            {selectedIds.length}
          </span>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <button
            onClick={toggleSelectAll}
            disabled={paginatedOrders.length === 0}
            className={`w-full rounded border px-3 py-1.5 text-sm sm:w-auto ${
              paginatedOrders.length === 0
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-white/70 bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            {allSelected ? "Unselect All" : "Select All"}
          </button>

          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className={`w-full rounded px-3 py-1.5 text-sm sm:w-auto ${
              selectedIds.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700"
            }`}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block overflow-x-auto">
        <div className="grid grid-cols-12 rounded-t-xl border border-blue-400 bg-gradient-to-r from-blue-600 to-cyan-500 px-2 py-3 text-sm font-semibold text-white shadow-sm">
          <div className="col-span-1 text-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              disabled={paginatedOrders.length === 0}
            />
          </div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Product</div>
          <div className="col-span-2 text-center">Date</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        {paginatedOrders.map((order) => {
          const isSelected = selectedIds.includes(order._id);

          return (
            <div
              key={order._id}
              className="grid grid-cols-12 items-center border-b border-blue-200 py-4 text-sm"
            >
              {/* SELECT */}
              <div className="col-span-1 flex justify-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(order._id)}
                  title="Select order"
                />
              </div>

              {/* CUSTOMER */}
              <div className="col-span-3">
                <p className="font-medium">
                  {order.userName || "Unknown User"}
                </p>
                <p className="text-sm font-bold text-red-600">
                  ৳ {order.totalPrice}
                </p>
              </div>

              {/* PRODUCT */}
              <div className="col-span-3">
                <p
                  className="font-medium text-gray-700 truncate"
                  title={order.items?.[0]?.name}
                >
                  {getProductNames(order)}
                </p>
              </div>

              {/* DATE */}
              <div className="col-span-2 text-center text-xs">
                {formatDateTime(order.orderTime)}
              </div>

              {/* STATUS */}
              <div className="col-span-1 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* ACTION */}
              <div className="col-span-2 flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    navigate(`/admin/manage-orders/${order._id}`, {
                      state: order,
                    })
                  }
                  className="text-blue-600 hover:text-blue-800"
                  title="View order details"
                >
                  <FaEye />
                </button>

                <button
                  onClick={() => handleDeleteOrder(order)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete order"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          );
        })}
        {sortedOrders.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500">
            No orders match current filters.
          </div>
        )}
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-4">
        {paginatedOrders.map((order) => {
          const isSelected = selectedIds.includes(order._id);

          return (
            <div
              key={order._id}
              className="border border-blue-300 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Select</span>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(order._id)}
                />
              </div>

              <div>
                <p className="font-medium">
                  {order.userName || "Unknown User"}
                </p>
                <p className="text-sm font-bold text-red-600">
                  ৳ {order.totalPrice}
                </p>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Product: </span>
                <span
                  className="font-medium"
                  title={order.items?.[0]?.name}
                >
                  {getProductNames(order)}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span>Date</span>
                <span>{formatDateTime(order.orderTime)}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span>Status</span>
                <span
                  className={`px-2 py-1 rounded ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex justify-end gap-4 border-t border-blue-300 pt-2">
                <button
                  onClick={() =>
                    navigate(`/admin/manage-orders/${order._id}`, {
                      state: order,
                    })
                  }
                  className="text-blue-600"
                >
                  <FaEye />
                </button>

                <button
                  onClick={() => handleDeleteOrder(order)}
                  className="text-red-500"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          );
        })}
        {sortedOrders.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
            No orders match current filters.
          </div>
        )}
      </div>

      {sortedOrders.length > 0 && (
        <div className="mt-5 flex flex-col items-stretch justify-between gap-3 rounded-xl border border-indigo-200 bg-gradient-to-r from-white to-indigo-50 px-3 py-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="rounded-md bg-white px-2 py-1 text-xs font-medium text-indigo-700 shadow-sm">
              Showing {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, sortedOrders.length)} of {sortedOrders.length}
            </p>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
                setSelectedIds([]);
              }}
              className="w-full rounded-md border border-cyan-200 bg-white px-2 py-1 text-xs font-medium text-cyan-800 shadow-sm outline-none focus:border-cyan-500 sm:w-auto"
            >
              <option value={5}>5 / page</option>
              <option value={15}>15 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>

          <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`rounded-md border px-3 py-1.5 text-sm whitespace-nowrap ${
                currentPage === 1
                  ? "cursor-not-allowed border-gray-200 text-gray-400"
                  : "border-blue-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(currentPage - 2, 0), Math.max(currentPage - 2, 0) + 5)
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 min-w-8 rounded-md px-2 text-sm whitespace-nowrap ${
                    currentPage === page
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                      : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`rounded-md border px-3 py-1.5 text-sm whitespace-nowrap ${
                currentPage === totalPages
                  ? "cursor-not-allowed border-gray-200 text-gray-400"
                  : "border-blue-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrdersTable;
