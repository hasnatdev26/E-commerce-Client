import { FaTshirt, FaTruck, FaUndo, FaHeadset } from "react-icons/fa";
import img1 from "../../assets/About/why_choose_img.jpg";

const Section3 = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10">
            Why We Are The{" "}
            <span className="relative inline-block">
              Best
              <span className="absolute -bottom-1 left-0 w-full h-2 sm:h-3 bg-blue-300 rounded-full -z-10"></span>
            </span>
          </h2>

          {/* CARD GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">

            {[
              { icon: <FaTshirt />, title: "Quality Products" },
              { icon: <FaTruck />, title: "Fast Delivery" },
              { icon: <FaUndo />, title: "Return Policy" },
              { icon: <FaHeadset />, title: "24/7 Service" },
            ].map((item, idx) => (
              <div key={idx} className="relative">

                {/* Side line (Desktop only) */}
                <div className="hidden sm:block absolute -left-2 top-0 bottom-0 border-l-4 border-blue-500 rounded-full"></div>

                {/* Icon */}
                <div className="sm:absolute sm:-left-8 sm:top-1/2 sm:-translate-y-1/2 
                                flex items-center justify-center
                                bg-blue-500 text-white
                                w-10 h-10 sm:w-12 sm:h-12
                                rounded-full shadow-md mb-4 sm:mb-0">
                  {item.icon}
                </div>

                {/* Card */}
                <div className="bg-white shadow-md rounded-2xl
                                pl-4 sm:pl-12 pr-4 sm:pr-6
                                py-5 sm:py-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
                    Objectively pontificate quality models before intuitive information.
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={img1}
            alt="why choose us"
            className="rounded-2xl object-cover w-full
                       h-52 sm:h-64 md:h-72 lg:h-[420px]"
          />
        </div>

      </div>
    </section>
  );
};

export default Section3;
