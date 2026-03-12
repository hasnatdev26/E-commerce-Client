import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaTruck,
  FaLock,
  FaPhoneAlt,
  FaUndoAlt,
  FaStar,
} from "react-icons/fa";

import Image1 from "../../assets/Images/image (1).jfif";
import Image2 from "../../assets/Images/image (2).jfif";
import Image3 from "../../assets/Images/image (3).jfif";
import { Link } from "react-router-dom";


const images = [Image1, Image2, Image3];
const sliderImages = [...images, images[0]];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Infinite loop fix
  useEffect(() => {
    if (current === images.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 1200);
    } else {
      setTransition(true);
    }
  }, [current]);

  return (
    <div className="w-full p-2 sm:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

        {/* SLIDER */}
        <div
          className="
            lg:col-span-4 overflow-hidden rounded-lg
            h-[180px] sm:h-[260px] md:h-[360px] lg:h-[420px]
            
          "
        >
          <div
            className={`flex ${
              transition
                ? "transition-transform duration-[1200ms] ease-in-out"
                : ""
            }`}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {sliderImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Banner ${index + 1}`}
                className="
                  w-full h-full flex-shrink-0
                  object-contain lg:object-cover
                "
              />
            ))}
          </div>
        </div>

        {/* INFO BOX (Desktop Only) */}
 {/* INFO BOX (Desktop Only) */}
<div className="hidden lg:flex lg:col-span-1 bg-white rounded-lg  p-3 flex-col gap-3 -mt-2">

  {/* Title */}
  <div className="border border-gray-300 rounded-md p-2">
    <h3 className="text-sm font-semibold flex items-center gap-2">
      <FaShoppingCart className="text-blue-600" />
      Online Shopping
    </h3>
  </div>

  {/* Features */}
  <div className="border border-gray-300 rounded-md p-2 space-y-2 text-xs text-gray-700">
    <Feature icon={<FaMoneyBillWave className="text-green-600" />} text="Cash on Delivery" />
    <Feature icon={<FaTruck className="text-blue-600" />} text="Fast Delivery" />
    <Feature icon={<FaLock className="text-purple-600" />} text="100% Secure Payment" />
    <Feature icon={<FaPhoneAlt className="text-indigo-600" />} text="24/7 Customer Support" />
    <Feature icon={<FaUndoAlt className="text-orange-600" />} text="Easy Return Policy" />
    <Feature icon={<FaStar className="text-yellow-500" />} text="Trusted Quality Products" />
  </div>

  {/* Button */}
  <div className="border border-blue-300 rounded-md p-2">
   <Link to="/all-Products">
  <button className="w-full bg-blue-600 text-white text-xs py-2 rounded-md hover:bg-blue-700 transition font-semibold">
    Shop Now
  </button>
</Link>

  </div>

</div>




      </div>
    </div>
  );
};

/* Reusable Feature Component */
const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-2 border border-gray-200 rounded p-1.5">
    {icon}
    <span>{text}</span>
  </div>
);

export default HeroSection;
