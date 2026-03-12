import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";

const Section1 = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Call Us */}
        <div className="flex items-center gap-4 bg-gray-100 p-6 rounded-2xl">
          <div
            className="
              bg-blue-600 text-white p-4 rounded-lg text-2xl 
              transition-all duration-300 
              hover:bg-blue-500 hover:scale-110 hover:shadow-lg
              cursor-pointer
            "
          >
            <FiPhoneCall />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Call Us</h3>
            <p className="text-gray-700 mt-1">+44 20 9994 7740</p>
            <p className="text-gray-700">+44 30 7772 8830</p>
          </div>
        </div>

        {/* Email Us */}
        <div className="flex items-center gap-4 bg-gray-100 p-6 rounded-2xl">
          <div
            className="
              bg-blue-600 text-white p-4 rounded-lg text-2xl 
              transition-all duration-300 
              hover:bg-blue-500 hover:scale-110 hover:shadow-lg
              cursor-pointer
            "
          >
            <FiMail />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Email Us</h3>
            <p className="text-gray-700 mt-1">support@yourdomain.com</p>
            <p className="text-gray-700">hello@yourdomain.com</p>
          </div>
        </div>

        {/* Our Location */}
        <div className="flex items-center gap-4 bg-gray-100 p-6 rounded-2xl">
          <div
            className="
              bg-blue-600 text-white p-4 rounded-lg text-2xl 
              transition-all duration-300 
              hover:bg-blue-500 hover:scale-110 hover:shadow-lg
              cursor-pointer
            "
          >
            <FiMapPin />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Our Location</h3>
            <p className="text-gray-700 mt-1">
              37 W 24th St, Blackwell Street Creek,
            </p>
            <p className="text-gray-700">10th Avenue, New York</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Section1;
