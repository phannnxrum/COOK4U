import React from "react";

const HeroSection = () => {
  const handleScroll = () => {
    const target = document.getElementById("feature-section");
    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Ảnh background
    <div
      className="min-h-screen  bg-cover bg-center bg-no-repeat flex w-full overflow-hidden"
      style={{ backgroundImage: "url('image/main-page-bg.jpg')" }}
      id="HeroSection"
    >
      {/* Nội dung trang đầu */}
      <div className="container text-left mx-auto py-20 px-10 text-white">
        <h2 className="text-5xl sm:text-6xl md:text-[82px] font-bold">
          Đầu bếp chuyên nghiệp
        </h2>
        <h2 className="mt-5 text-5xl sm:text-6xl md:text-[82px] font-bold text-orange-500">
          nấu ăn tại nhà bạn
        </h2>
        <h3 className="mt-8 text-xl sm:text-2xl md:text-3xl">
          Thức ăn chuẩn gu, đầu bếp chuyên nghiệp, dịch vụ tận nhà.
        </h3>
        <div className="space-x-20 mt-16 text-2xl font-semibold flex">
          <button
            onClick={handleScroll}
            className="bg-orange-500 text-white border border-orange-500 rounded-2xl px-21 py-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Bắt đầu ngay
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
