import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 px-4 flex items-center justify-center">
      <div className="absolute -top-24 -left-28 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl" />

      <div className="relative w-full max-w-2xl">
        <section className="rounded-3xl border border-emerald-100 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(5,150,105,0.18)] p-6 sm:p-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <CheckCircle className="h-4 w-4" />
            Payment Confirmed
          </div>

          <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            Order Placed Successfully
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Thank you for your purchase. Your order has been verified and moved
            to processing. You can track every update from your order history.
          </p>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
            <p className="text-sm sm:text-base font-semibold text-emerald-900">
              What happens next
            </p>
            <p className="mt-2 text-sm text-emerald-800">
              Our team will confirm your order, prepare the package, and notify
              you before dispatch.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link to="/purchase-history" className="w-full">
              <button className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 active:scale-[.99]">
                View My Orders
              </button>
            </Link>

            <Link to="/all-products" className="w-full">
              <button className="w-full rounded-xl border border-emerald-300 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 active:scale-[.99]">
                Continue Shopping
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuccessPage;
