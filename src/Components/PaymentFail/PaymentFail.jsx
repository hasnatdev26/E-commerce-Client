import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentFail = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-red-100/60 px-4 flex items-center justify-center">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl" />
      <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-red-200/50 blur-3xl" />

      <div className="relative w-full max-w-xl rounded-3xl border border-rose-100 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(225,29,72,0.18)] p-6 sm:p-9 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700">
          <XCircle className="h-4 w-4" />
          Transaction Unsuccessful
        </div>

        <div className="flex justify-center mt-5 mb-3">
          <XCircle className="text-rose-500 w-14 h-14 sm:w-16 sm:h-16" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Payment Failed
        </h2>

        <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
          Your payment could not be completed. Please try again or choose a
          different method.
        </p>

        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5 text-sm sm:text-base text-rose-700">
          If the amount was deducted, it will be reversed automatically by your
          bank or provider.
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link to="/checkout">
            <button className="w-full rounded-xl bg-rose-600 text-white py-3 font-semibold transition hover:bg-rose-700 active:scale-[.99]">
              Try Again
            </button>
          </Link>

          <Link to="/all-products">
            <button className="w-full rounded-xl border border-rose-200 py-3 font-semibold text-rose-700 transition hover:bg-rose-50 active:scale-[.99]">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
