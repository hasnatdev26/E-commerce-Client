import { FiBell, FiSend } from "react-icons/fi";
import image from "../../assets/Contact/contact_message.jpg";
import useAuth from "../../Hooks/useAuth";

import "./Section2.css";

const Section2 = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4  py-8 ">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">

        {/* LEFT IMAGE SIDE */}
        <div className="relative">
          <img
            src={image}
            alt="contact"
            className="w-full 
                       h-96           /* 📱 mobile height bigger */
                       sm:h-[420px] 
                       md:h-[520px] 
                       lg:h-[700px] 
                       object-cover rounded-2xl"
          />

          {/* HOTLINE CARD */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-blue-600 text-white rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl flex items-center gap-3 sm:gap-4">

            {/* Animated Bell */}
            <div className="bg-blue-500 text-white p-2 sm:p-3 rounded-full text-lg sm:text-xl shadow animate-bell">
              <FiBell />
            </div>

            <div>
              <p className="text-base sm:text-lg font-semibold">Hotline</p>
              <p className="text-xs sm:text-sm tracking-wide">+123 324 5879 39</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8 h-auto">

          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            Get In Touch 👋
          </h2>

          <form className="space-y-4 sm:space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Full Name"
                defaultValue={user?.displayName || ""}
                className="border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
              />

              <input
                type="email"
                placeholder="Email Address"
                defaultValue={user?.email || ""}
                className="border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Phone Number"
                className="border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                className="border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
              />
            </div>

            <textarea
              rows="6"
              placeholder="Write your message here..."
              className="border border-gray-300 rounded-lg p-3 w-full resize-none focus:border-blue-500 focus:outline-none h-32 lg:h-[350px]"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition flex items-center justify-center gap-2"
            >
              Send Message
              <FiSend className="text-lg" />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Section2;
