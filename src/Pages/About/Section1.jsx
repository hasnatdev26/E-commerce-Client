import image from "../../../src/assets/About/about_img.jpg";

const Section1 = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">

      {/* MAIN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

        {/* LEFT IMAGE SIDE */}
        <div className="relative flex justify-center lg:justify-start">

          {/* IMAGE */}
          <div
            className="
              border-[6px] sm:border-[8px] border-white shadow-2xl overflow-hidden 
              rounded-tl-[90px] sm:rounded-tl-[120px] 
              rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px]
            "
          >
            <img
              src={image}
              alt="about"
              className="
                w-[310px] h-[360px]
                sm:w-[420px] sm:h-[480px]
                lg:w-[520px] lg:h-[580px]
                object-cover
                rounded-tl-[80px] sm:rounded-tl-[110px]
                rounded-tr-[15px] rounded-br-[15px] rounded-bl-[15px]
              "
            />
          </div>

          {/* 12+ YEARS BADGE (blue) */}
          <div
            className="
              absolute 
              top-[45%] sm:top-[48%]
              -right-6 sm:-right-10
              bg-blue-600
              w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 
              rounded-full
              flex flex-col justify-center items-center 
              text-white shadow-2xl border-[6px] sm:border-[8px] border-white
            "
          >
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">12+</p>
            <p className="text-[10px] sm:text-xs text-center leading-tight">
              Years <br /> Experience
            </p>
          </div>

          {/* BLACK REVIEW CARD */}
          <div
            className="
              absolute 
              -bottom-4 sm:bottom-2 left-2 sm:left-8 
              bg-[#2F2F2F] text-white 
              p-4 sm:p-6 
              rounded-[22px] sm:rounded-[28px] rounded-tr-[60px] sm:rounded-tr-[70px] 
              w-[240px] sm:w-[300px] lg:w-[360px] 
              shadow-2xl
            "
          >
            <p className="text-xs sm:text-sm leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate officiis architecto reiciendis.
            </p>

            <p className="mt-3 sm:mt-4 text-blue-400 font-semibold tracking-wide text-xs sm:text-sm">
              —— JHON DEO
            </p>
          </div>
        </div>

        {/* RIGHT TEXT CONTENT */}
        <div className="text-left">

          <p className="text-blue-600 font-semibold text-base sm:text-lg">
            About Company
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 mb-3 leading-snug">
            Well-Coordinated Teamwork Speaks About Us
          </h2>

          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aspernatur molestiae
            minima pariatur consequatur voluptate sapiente deleniti soluta.
          </p>

          {/* FEATURES LIST */}
          <div className="space-y-4 sm:space-y-5">

            {[
              "Trusted Partner",
              "Quality Products",
              "First Delivery",
              "Secure Payment",
            ].map((title, idx) => (
              <div className="flex gap-3 sm:gap-4 items-start justify-start" key={idx}>
                
                {/* blue icon circle */}
                <div className="bg-blue-600 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-lg">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-base sm:text-lg">{title}</h3>
                  <p className="text-gray-600 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Section1;
