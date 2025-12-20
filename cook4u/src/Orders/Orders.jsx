import React, { useEffect, useState } from "react";
// import HeaderClient from "../Client/HeaderClient"; // Bỏ comment nếu cần
import { getOrders } from "./chefService";
import OrdersCard from "./OrdersCard";
import { motion } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTabs, setActiveTabs] = useState("all");

  // Cập nhật bộ lọc khớp với Database ENUM
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "confirmed", label: "Đã xác nhận" },
    { id: "cooking", label: "Đang nấu" },
    { id: "completed", label: "Hoàn tất" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        // Sắp xếp đơn mới nhất lên đầu (nếu API chưa sort)
        // const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getFilterOrders = () => {
    if (!orders || orders.length === 0) return [];

    if (activeTabs === "all") {
      return orders;
    }

    // Lọc dựa trên Order Status (đảm bảo so sánh chữ thường)
    return orders.filter(
      (order) => order.status && order.status.toLowerCase() === activeTabs
    );
  };

  const filteredOrders = getFilterOrders();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {/* Header Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và theo dõi tiến độ các bữa tiệc của bạn
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 p-1 bg-gray-100 rounded-xl">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveTabs(filter.id)}
                // 👇 ĐÃ SỬA Ở ĐÂY:
                // 1. Xóa 'md:flex-none' để nó luôn co giãn (flex-1) trên mọi màn hình.
                // 2. Thêm 'w-full' và 'text-center' để nút chiếm hết không gian được chia và chữ nằm giữa.
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none flex-1 w-full text-center ${
                  activeTabs === filter.id
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {activeTabs === filter.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200"
                    style={{ zIndex: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-4 mt-2">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <OrdersCard ordersData={order} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-400 text-lg">
                Không tìm thấy đơn hàng nào.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
