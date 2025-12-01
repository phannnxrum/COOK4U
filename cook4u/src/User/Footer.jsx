import React from "react";

export const Footer = () => {
  return (
    <div className="w-full px-4 md:px-6 mt-20 py-4 bg-gray-300">
      <div className="flex flex-row items-center gap-6 md:gap-8 lg:gap-11 mt-6 md:mt-8 justify-center">
        <img
          src="/image/Facebook.png"
          alt="Facebook"
          className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 cursor-pointer"
          onClick={() => window.open("https://www.facebook.com/", "_blank")}
        />
        <img
          src="/image/Instagram.png"
          alt="Instagram"
          className="w-8 h-8 md:w-10 md:h-10 lg:w-[60px] lg:h-[60px] cursor-pointer"
          onClick={() => window.open("https://www.instagram.com/", "_blank")}
        />
        <img
          src="/image/Tiktok.png"
          alt="Tiktok"
          className="w-8 h-8 md:w-10 md:h-10 lg:w-[50px] lg:h-[50px] cursor-pointer"
          onClick={() => window.open("https://www.tiktok.com/", "_blank")}
        />
      </div>
      <div className="flex flex-row justify-center gap-1 md:gap-1.5 items-center">
        <img src="/image/LogoCook4u.png" alt="" className="h-8 md:h-9 lg:h-10 mt-1 md:mt-1.5"/>
          <span className="text-xl md:text-2xl lg:text-[32px] font-semibold text-gray-900 mt-1">
            COOK4U
          </span>
      </div>
      <div className="flex flex-row flex-wrap gap-4 md:gap-6 lg:gap-10 justify-center mt-2 md:mt-3 px-4">
        <a href="" className="text-sm md:text-base hover:text-orange-500 transition">Điều khoản và điều kiện</a>
        <a href="" className="text-sm md:text-base hover:text-orange-500 transition">Chính sách bảo mật</a>
      </div>
      <p className="text-center mt-1 md:mt-1.5 text-xs md:text-sm lg:text-base">© 2025 COOK4U. All rights reserved.</p>
    </div>
  );
};

export default Footer;