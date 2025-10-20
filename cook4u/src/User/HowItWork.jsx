import React from "react";

export const HowItWork = () => {
  return (
    <div className="container mx-auto px-10">
      <ul className="flex flex-col sm:flex-row justify-between gap-3">
        <li className=" w-80 h-70 text-center py-5 flex flex-col items-center gap-3.5">
          <div className="flex justify-center items-center w-20 h-20 bg-orange-500 text-white text-4xl font-bold rounded-full shadow-md">
            1
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Chọn món ăn</h2>
          <p className="text-gray-600 text-lg px-5">
            Duyệt qua các món ăn đa dạng từ đầu bếp chuyên nghiệp
          </p>
        </li>
        <li className=" w-80 h-70 text-center py-5 flex flex-col items-center gap-3.5">
          <div className="flex justify-center items-center w-20 h-20 bg-orange-500 text-white text-4xl font-bold rounded-full shadow-md">
            2
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Chọn đầu bếp</h2>
          <p className="text-gray-600 text-lg px-5">
            Tìm và chọn đầu bếp phù hợp với món ăn bạn muốn
          </p>
        </li>
        <li className=" w-80 h-70 text-center py-5 flex flex-col items-center gap-3.5">
          <div className="flex justify-center items-center w-20 h-20 bg-orange-500 text-white text-4xl font-bold rounded-full shadow-md">
            3
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Lên lịch</h2>
          <p className="text-gray-600 text-lg px-5">
            Chọn thời gian phù hợp và xác nhận chi tiết đặt chỗ
          </p>
        </li>
        <li className=" w-80 h-70 text-center py-5 flex flex-col items-center gap-3.5">
          <div className="flex justify-center items-center w-20 h-20 bg-orange-500 text-white text-4xl font-bold rounded-full shadow-md">
            4
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Thanh toán & Thưởng thức
          </h2>
          <p className="text-gray-600 text-lg px-5">
            Hoàn tất thanh toán và đầu bếp đến nhà nấu cho bạn
          </p>
        </li>
      </ul>
    </div>
  );
};
