import React from "react";

export const HowItWork = () => {
  return (
    <div className="container mx-auto px-10">
      <ul className="flex flex-col sm:flex-row justify-between gap-6">
        {[ 
          { num: 1, title: "Chọn món ăn", desc: "Duyệt qua các món ăn đa dạng từ đầu bếp chuyên nghiệp" },
          { num: 2, title: "Chọn đầu bếp", desc: "Tìm và chọn đầu bếp phù hợp với món ăn bạn muốn" },
          { num: 3, title: "Lên lịch", desc: "Chọn thời gian phù hợp và xác nhận chi tiết đặt chỗ" },
          { num: 4, title: "Thanh toán & Thưởng thức", desc: "Hoàn tất thanh toán và đầu bếp đến nhà nấu cho bạn" }
        ].map((item) => (
          <li
            key={item.num}
            className="w-80 text-center py-5 flex flex-col items-center gap-3.5"
          >
            <div className="flex-shrink-0 flex justify-center items-center w-16 h-16 md:w-20 md:h-20 bg-orange-500 text-white text-2xl md:text-4xl font-bold rounded-full shadow-md">
              {item.num}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-600 text-lg px-5">{item.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
