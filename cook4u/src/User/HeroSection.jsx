import React from "react";
import { Carousel } from 'antd';
import { NavLink } from "react-router";

const HeroSection = () => {
  const handleScroll = () => {
    const target = document.getElementById("feature-section");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <Carousel className="" autoplay>
        <div className="bg-[url(/image/cooking1.jpg)] h-[650px] bg-cover bg-no-repeat bg-bottom">
        </div>
        <div className="bg-[url(/image/cooking2.jpg)] h-[650px] bg-cover bg-no-repeat bg-center">
        </div>
        <div className="bg-[url(/image/cooking3.jpg)] h-[650px] bg-cover bg-no-repeat bg-center">
        </div>
        <div className="bg-[url(/image/cooking4.jpg)] h-[650px] bg-cover bg-no-repeat bg-top">
        </div>
      </Carousel>
      {/* Nội dung - căn trái như hình mẫu */}
      <div className="container absolute top-0 mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-orange-100 leading-tight">
            Đầu bếp chuyên nghiệp
            <br />
            <span className="text-orange-600">nấu ăn tại nhà bạn</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-white max-w-xl">
            Thức ăn chuẩn gu, đầu bếp chuyên nghiệp, dịch vụ tận nhà.
          </p>


          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleScroll}
              className="bg-orange-500 text-white rounded-2xl cursor-pointer px-10 py-4 text-lg font-semibold hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl w-fit"
            >
              Bắt đầu ngay
            </button>

            <NavLink
              to="/sign-in"
              className="text-orange-500 border-2 border-orange-500 rounded-2xl px-10 py-4 text-lg font-semibold bg-white hover:bg-orange-100 transition-all duration-300 w-fit inline-block text-center"
            >
              Đã có tài khoản
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;