import { FiTruck, FiHeadphones, FiShield, FiTag } from "react-icons/fi";

const Section2 = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 1️⃣ Return & Refund */}
        <div className="flex items-center gap-4 bg-[#FFF3E0] rounded-2xl px-5 py-4 shadow-sm">

          <div className="bg-[#FFB300] w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl">
            <FiTruck />
          </div>

          <div>
            <h3 className="font-semibold text-lg">Return & refund</h3>
            <p className="text-gray-500 text-sm">Money back guarantee</p>
          </div>
        </div>

        {/* 2️⃣ Quality Support */}
        <div className="flex items-center gap-4 bg-[#E0F7FF] rounded-2xl px-5 py-4 shadow-sm">

          <div className="bg-[#00B4FF] w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl">
            <FiHeadphones />
          </div>

          <div>
            <h3 className="font-semibold text-lg">Quality Support</h3>
            <p className="text-gray-500 text-sm">Always online 24/7</p>
          </div>
        </div>

        {/* 3️⃣ Secure Payment */}
        <div className="flex items-center gap-4 bg-[#E8F9E8] rounded-2xl px-5 py-4 shadow-sm">

          <div className="bg-[#4CAF50] w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl">
            <FiShield />
          </div>

          <div>
            <h3 className="font-semibold text-lg">Secure Payment</h3>
            <p className="text-gray-500 text-sm">30% off by subscribing</p>
          </div>
        </div>

        {/* 4️⃣ Daily Offers */}
        <div className="flex items-center gap-4 bg-[#DFF7F5] rounded-2xl px-5 py-4 shadow-sm">

          <div className="bg-[#00BFA6] w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl">
            <FiTag />
          </div>

          <div>
            <h3 className="font-semibold text-lg">Daily Offers</h3>
            <p className="text-gray-500 text-sm">20% off by subscribing</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Section2;
