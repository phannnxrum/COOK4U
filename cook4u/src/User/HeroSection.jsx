import React from "react";

const HeroSection = () => {
  return (
    <div
      className="min-h-screen mb-4 bg-cover bg-center bg-no-repeat flex w-full overflow-hidden"
      style={{ backgroundImage: "url('/main-page-bg.jpg')" }}
      id="HeroSection"
    >
      <div className="container text-left mx-auto py-20 px-10 text-white">
        <h2 className="text-5xl sm:text-6xl md:text-[82px] font-bold">Đầu bếp chuyên nghiệp</h2>
        <h2 className="text-5xl sm:text-6xl md:text-[82px] font-bold text-orange-500">nấu ăn tại nhà bạn</h2>
        <h3 className="text-xl sm:text-2xl md:text-3xl">Thức ăn chuẩn gu, đầu bếp chuyên nghiệp, dịch vụ tận nhà.</h3>
        <div>
          <a href="">Bắt đầu ngay</a>
          <a href="">Đã có tài khoản</a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
