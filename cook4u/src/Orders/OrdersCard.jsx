import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";

const OrdersCard = ({ ordersData }) => {
  // 1. Cấu hình Status Map
  const statusConfig = {
    pending: {
      label: "Chờ xác nhận",
      className: "bg-yellow-100 text-yellow-600",
    },
    confirmed: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-600" },
    cooking: { label: "Đang nấu", className: "bg-orange-100 text-orange-600" },
    completed: {
      label: "Hoàn thành",
      className: "bg-green-100 text-green-600",
    },
    cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-600" },

    // Fallback cho data cũ
    poll: { label: "Chờ", className: "bg-yellow-100 text-yellow-600" },
    onWork: {
      label: "Đang thực hiện",
      className: "bg-blue-100 text-blue-600",
    },
    complete: {
      label: "Hoàn tất",
      className: "bg-green-100 text-green-600",
    },
    cancel: { label: "Hủy", className: "bg-red-100 text-red-600" },
  };

  // 2. Hàm lấy status an toàn
  const getStatusInfo = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : "";
    return (
      statusConfig[normalizedStatus] || {
        label: status || "Khác",
        className: "bg-gray-100 text-gray-600",
      }
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // --- 3. KHÔI PHỤC LOGIC TÍNH TỔNG TIỀN ---
  // // Tính tổng tiền các món ăn
  // const totalAmountDishes =
  //   ordersData?.dishes?.reduce((total, dish) => {
  //     return total + (Number(dish.dishPrice) || 0);
  //   }, 0) || 0;

  // Tổng đơn hàng = Tiền thuê Chef + Tổng tiền món
  const totalAmount = ordersData.totalAmount;

  return (
    <div className="flex flex-col hover:shadow-md hover:-translate-y-1 hover:-translate-x-1 hover:rounded-2xl transition delay-50 duration-300 ease-in-out">
      {/* Header Card */}
      <div className="flex justify-between bg-gray-200 px-7 py-2 rounded-t-2xl border border-gray-300">
        <p>Đơn ngày: {ordersData.date}</p>
        <p className="font-semibold text-gray-700">
          Tổng tiền: {formatCurrency(totalAmount)}
        </p>
      </div>

      {/* Body Card */}
      <div className="grid grid-cols-6 divide-x divide-gray-300 bg-white rounded-b-2xl border border-gray-300 border-t-transparent">
        {/* Cột trái: Thông tin Chef */}
        <div className="col-span-1 flex flex-col items-center justify-center py-2 p-1 gap-1">
          <img
            src={ordersData.avatar}
            alt={ordersData.name}
            width={100}
            className="rounded-full w-14 h-14 md:w-20 md:h-20 object-cover border border-gray-200"
          />
          <p className="text-sm md:text-base font-medium text-center mt-1">
            {ordersData.name}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FaStar className="text-yellow-400" />
            <span>{ordersData.rating}</span>
          </div>

          {/* --- 4. KHÔI PHỤC HIỂN THỊ GIÁ THUÊ CHEF --- */}
          <p className="text-sm font-medium text-gray-500">
            {formatCurrency(ordersData.price)}
          </p>
        </div>

        {/* Cột phải: Danh sách món ăn */}
        <div className="divide-y divide-gray-300 col-span-5 flex flex-col h-full">
          {ordersData.dishes && ordersData.dishes.length > 0 ? (
            ordersData.dishes.map((dish, index) => {
              const statusInfo = getStatusInfo(dish.status);

              return (
                <div
                  key={dish.id || index}
                  className="flex-1 grid grid-cols-8 lg:grid-cols-9 xl:grid-cols-12 gap-2 items-center px-3 py-3"
                >
                  {/* Ảnh món */}
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="col-span-1 w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover border border-gray-100"
                  />

                  {/* Tên món & Mã */}
                  <div className="col-span-3 lg:col-span-4 xl:col-span-7 pl-2">
                    <p className="font-medium text-gray-800 line-clamp-1">
                      {dish.name}
                    </p>
                    <p className="text-xs text-gray-400">Mã: {dish.code}</p>
                  </div>

                  {/* Giá & Status */}
                  <div className="col-span-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-1">
                    {/* Giờ nấu */}
                    <div className="basis-1/4 flex gap-1 items-center justify-center text-xs md:text-sm text-gray-500">
                      <FaRegClock className="text-orange-400" />
                      <p>{dish.startTime}</p>
                    </div>

                    {/* Giá món */}
                    <p className="basis-1/4 flex justify-center text-xs md:text-sm font-medium">
                      {formatCurrency(dish.dishPrice)}
                    </p>

                    {/* Badge Status */}
                    <span
                      className={`basis-1/2 text-xs md:text-sm flex justify-center items-center rounded-full py-1 px-3 whitespace-nowrap font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              Chưa có món ăn nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;
