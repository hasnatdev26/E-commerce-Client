import { FaShieldAlt, FaTruck, FaUndo, FaLock } from "react-icons/fa";

const Section1 = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Official Warranty",
      desc: "1 Year Brand Warranty",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: <FaTruck />,
      title: "Fast Delivery",
      desc: "Get your order in 48 hours",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: <FaUndo />,
      title: "Easy Return",
      desc: "7 Days Return Policy",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
    {
      icon: <FaLock />,
      title: "Secure Payment",
      desc: "SSL Secured Checkout",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <section className="relative -mt-6 sm:-mt-8 lg:-mt-12 px-3 sm:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 ${item.bgColor} rounded-xl`}
          >
            {/* ICON */}
            <div className="bg-white p-2 sm:p-3 rounded-full shadow flex-shrink-0">
              <span className={`${item.iconColor} text-xl sm:text-2xl lg:text-3xl`}>
                {item.icon}
              </span>
            </div>

            {/* TEXT */}
            <div>
              <h4 className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">
                {item.title}
              </h4>
              <p className="text-gray-500 text-[11px] sm:text-xs lg:text-sm">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section1;
