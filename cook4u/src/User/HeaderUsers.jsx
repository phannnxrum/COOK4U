// rafce

import React from "react";
import { NavLink, Outlet } from "react-router";

const HeaderUsers = () => {
  return (
    //Header trang đầu
    <div>
      <div className="flex items-center justify-between bg-amber-50 p-5">
        <div className="flex items-center space-x-2">
          <span className="text-orange-600"></span>
          <img src="/image/LogoCook4u.png" alt="" width={40} className="h-8" />
          <span className=" text-2xl md:text-[32px] font-semibold text-gray-900">
            COOK4U
          </span>
        </div>
        <div className="flex space-x-4">
          <NavLink
            className="text-orange-600 hover:bg-orange-500 hover:text-white px-3 py-1 cursor-pointer rounded bg-white outline-1 outline-orange-600"
            to="/sign-in"
          >
            Đăng nhập
          </NavLink>
          <NavLink
            className="bg-orange-500 text-white hover:bg-orange-600 px-3 cursor-pointer py-1 rounded"
            to="sign-up"
          >
            Đăng ký
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default HeaderUsers;
