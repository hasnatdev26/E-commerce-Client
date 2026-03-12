import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const ManageProductsTable = ({ products, onDelete }) => {
  return (
    <>
      {/* ================= DESKTOP / LAPTOP ================= */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 border-b border-blue-500 pb-2 text-sm font-medium text-gray-500">
          <div className="col-span-4">Product</div>
          <div className="col-span-2 text-center">Category</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Stock</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        {products.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-12 items-center border-b border-blue-200 py-4 text-sm hover:bg-blue-50"
          >
            <div className="col-span-4 flex items-center gap-3">
              <img
                src={
                  product.images?.[0] ||
                  product.categoryImage ||
                  "https://via.placeholder.com/80"
                }
                alt={product.name}
                className="w-16 h-16 object-contain rounded border border-blue-300"
              />
              <p className="font-medium line-clamp-2">
                {product.name}
              </p>
            </div>

            <div className="col-span-2 text-center">
              {product.category}
            </div>

            <div className="col-span-2 text-center font-semibold text-red-600">
              ৳ {product.finalAmount || product.price}
            </div>

            <div className="col-span-2 text-center">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${product.quantity <= 5
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                  }`}
              >
                {product.quantity} pcs
              </span>
            </div>

            <div className="col-span-2 flex justify-center gap-4">
              <Link to={`/admin/edit-products/${product._id}`}>
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit size={18} />
                </button>
              </Link>

              <button
                onClick={() => onDelete(product._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE + TABLET ================= */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border border-blue-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex gap-4">
              <img
                src={
                  product.images?.[0] ||
                  product.categoryImage ||
                  "https://via.placeholder.com/80"
                }
                alt={product.name}
                className="w-24 h-24 sm:w-20 sm:h-20 object-contain rounded border border-blue-600"
              />


              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Category: {product.category}
                </p>

                <p className="text-red-600 font-semibold mt-1">
                  ৳ {product.finalAmount || product.price}
                </p>

                <span
                  className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${product.quantity <= 5
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                    }`}
                >
                  Stock: {product.quantity}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Link to={`/admin/edit-products/${product._id}`}>
                <button className="px-4 py-1.5 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-50">
                  Edit
                </button>
              </Link>

              <button
                onClick={() => onDelete(product._id)}
                className="px-4 py-1.5 text-sm border border-red-500 text-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManageProductsTable;
