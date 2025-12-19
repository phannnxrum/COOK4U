import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";

const OrdersCard = ({ ordersData }) => {
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "poll", label: "Chờ" },
    { id: "onWork", label: "Đang thực hiện" },
    { id: "complete", label: "Hoàn tất" },
    { id: "cancel", label: "Hủy" },
  ];

  const getLabel = (id) => {
    return filters.find((t) => t.id === id).label;
  };

  const totalAmount =
    ordersData?.dishes?.reduce((total, dish) => {
      return total + Number(dish.dishPrice);
    }, 0) || 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="flex flex-col hover:shadow-md hover:-translate-y-1 hover:-translate-x-1 hover:rounded-2xl transition delay-50 duration-300 ease-in-out">
      <div className="flex justify-between bg-gray-200 px-7 py-2 rounded-t-2xl border border-gray-300">
        <p>Đơn ngày: {ordersData.date}</p>
        <p>Tổng tiền: {formatCurrency(totalAmount)}</p>
      </div>

      <div className="grid grid-cols-6 divide-x divide-gray-300 bg-white rounded-b-2xl border border-gray-300 border-t-transparent">
        <div className="col-span-1 flex flex-col items-center justify-center py-2">
          <img
            src={ordersData.avatar}
            alt=""
            width={100}
            className="rounded-full size-15 md:size-20 lg:size-30 xl:size-40"
          />
          <p className="text-sm md:text-base">{ordersData.name}</p>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400"></FaStar>
            {ordersData.rating}
          </div>
        </div>

        <div className="divide-y divide-gray-300 col-span-5 flex flex-col h-full">
          {ordersData.dishes.map((dish) => (
            <div
              key={dish.id}
              className="flex-1 grid grid-cols-8 lg:grid-cols-9 xl:grid-cols-12 gap-2 items-center px-3 py-2"
            >
              <img
                src={dish.image}
                alt=""
                style={{ objectFit: "cover", objectPosition: "center" }}
                className="col-span-1 w-15 h-15 rounded-2xl "
              />

              <div className="col-span-3 lg:col-span-4 xl:col-span-7">
                <p className="">{dish.name}</p>
                <p className="text-sm text-gray-400">Mã: {dish.code}</p>
              </div>

              <div className="col-span-4 flex flex-col md:flex-row justify-between items-center gap-1">
                <div className="basis-1/4 flex gap-1 items-center justify-center text-sm md:text-base">
                  <FaRegClock className="text-orange-400"></FaRegClock>
                  <p>{dish.startTime}</p>
                </div>

                <p className="basis-1/4 flex justify-center text-sm md:text-base">
                  {formatCurrency(dish.dishPrice)}
                </p>

                <p
                  className={`basis-1/2 text-sm xl:text-base flex justify-center rounded-2xl mx-6 py-1 px-2 ${
                    dish.status === "complete"
                      ? "bg-green-100 text-green-600"
                      : dish.status === "onWork"
                      ? "bg-blue-100 text-blue-600"
                      : dish.status === "poll"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }
            `}
                >
                  {getLabel(dish.status)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;
