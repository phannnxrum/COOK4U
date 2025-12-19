import React, { useEffect, useState } from "react";
import HeaderClient from "../Client/HeaderClient";
import { getOrders } from "./chefService";
import OrdersCard from "./OrdersCard";
import { motion } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTabs, setActiveTabs] = useState("all");
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "poll", label: "Chờ" },
    { id: "onWork", label: "Đang thực hiện" },
    { id: "complete", label: "Hoàn tất" },
    { id: "cancel", label: "Hủy" },
  ];

  // const activeIndex = filter.findIndex((t) => t.id === activeTabs);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log("Kết quả fetch:", data);
        setOrders(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getFilterOrders = () => {
    if (!orders) return [];
    if (activeTabs === "all") {
      return orders;
    }
    console.log("Tabs hiện tại:", activeTabs);
    return orders.filter((order) =>
      order.dishes.some((dish) => dish.status === activeTabs)
    );
  };

  const filteredOrders = getFilterOrders();

  if (loading) return <div className="text-black">Đang tải dữ liệu</div>;

  if (!orders) return <div className="text-black">Đơn hàng không tồn tại</div>;

  return (
    <div className="p-8">
      <div className="flex flex-col gap-2 bg-gray-100 p-5">
        <h1 className="text-2xl">Đơn hàng của tôi</h1>
        <p className="text-sm text-gray-400">
          Quản lý và theo dõi các đơn đặt chỗ
        </p>
        <div className="grid grid-cols-5 mt-5 bg-white py-2 rounded-2xl">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveTabs(filter.id)}
              className={`relative z-10 inline-block rounded-full py-1 transition-all duration-200 focus:outline-none ${
                activeTabs === filter.id
                  ? "bg-white text-orange-500 font-medium"
                  : "text-gray-700 hover:text-orange-400"
              }`}
            >
              {filter.label}
              {activeTabs === filter.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-md border border-gray-100"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        {filteredOrders.map((order) => (
          <div className="mt-10" key={order.id}>
            <OrdersCard ordersData={order}></OrdersCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
