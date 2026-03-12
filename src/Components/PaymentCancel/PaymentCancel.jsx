import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-50 px-4">
      <div className="bg-white w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-gray-100 animate-fadeIn">
        <div className="h-2 w-24 mx-auto rounded-full bg-yellow-500 mb-4"></div>

        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-yellow-500 w-16 h-16 sm:w-20 sm:h-20" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
          Payment Cancelled
        </h2>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
          You cancelled the payment. Your order has not been completed.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5 mb-6 text-sm sm:text-base text-yellow-700 shadow-sm">
          You can return to checkout anytime to complete the payment.
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/checkout">
            <button className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 active:scale-[.98] transition">
              Go To Checkout
            </button>
          </Link>

          <Link to="/all-products">
            <button className="w-full border border-gray-300 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 active:scale-[.98] transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
