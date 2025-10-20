import React from "react";

export const Footer = () => {
  return (
    <div className="">
      <div className="flex flex-row items-center gap-11 mt-8 justify-center">
        <img
          src="/image/Facebook.png"
          alt="Facebook"
          className="w-11 h-11 cursor-pointer"
          onClick={() => window.open("https://www.facebook.com/", "_blank")}
        />
        <img
          src="/image/Instagram.png"
          alt="Instagram"
          className="w-15 h-15 cursor-pointer"
          onClick={() => window.open("https://www.instagram.com/", "_blank")}
        />
        <img
          src="/image/Tiktok.png"
          alt="Tiktok"
          className="w-12.5 h-12.5 cursor-pointer"
          onClick={() => window.open("https://www.tiktok.com/", "_blank")}
        />
      </div>
      <div className="flex flex-row justify-center gap-1.5">
        <img src="/image/LogoCook4u.png" alt="" className="h-10 mt-1.5 "/>
          <span className=" text-[32px] font-semibold text-gray-900 mt-1">
            COOK4U
          </span>
      </div>
      <div className="flex flex-row gap-10 justify-center mt-3">
        <a href="">Điều khoản và điều kiện</a>
        <a href="">Chính sách bảo mật</a>
      </div>
      <p className="text-center mt-1.5">© 2025 COOK4U. All rights reserved.</p>
    </div>
  );
};

export default Footer;