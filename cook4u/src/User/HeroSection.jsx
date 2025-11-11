import React from "react";

const HeroSection = () => {
  const handleScroll = () => {
    const target = document.getElementById("feature-section");
    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Ảnh background
    <div
      className="min-h-[80vh]  bg-cover bg-center bg-no-repeat flex w-full overflow-hidden"
      style={{ backgroundImage: "url('image/main-page-bg.png')" }}
      id="HeroSection"
    >
      {/* Nội dung trang đầu */}
      <div className="container text-left mx-auto pt-24 text-white flex-1 flex flex-col justify-start max-w-2xl">
        <h2 className="text-5xl sm:text-6xl md:text-[82px] font-bold leading-tight">
          Đầu bếp chuyên nghiệp
        </h2>
        <h2 className="mt-3 text-5xl sm:text-6xl md:text-[82px] font-bold text-orange-500 leading-tight">
          nấu ăn tại nhà bạn
        </h2>
        <h3 className="mt-6 text-xl sm:text-2xl md:text-3xl">
          Thức ăn chuẩn gu, đầu bếp chuyên nghiệp, dịch vụ tận nhà.
        </h3>
        <div className="space-x-8 mt-10 text-xl md:text-2xl font-semibold flex flex-wrap gap-5">
          <button
            onClick={handleScroll}
            className="bg-orange-500 text-white border border-orange-500 rounded-2xl px-21 py-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg "
          >
            <a href="/sign-up"> Bắt đầu ngay </a>
          </button>

          <a
            href="/sign-in"
            className="text-orange-500 bg-white border border-orange-500 rounded-2xl px-18 py-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Đã có tài khoản
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
