import React, { useEffect, useState } from 'react';
import { TrendingUp, ChefHat, Users, DollarSign, Utensils } from 'lucide-react';
import RevenueChart from './RevenueChart';
import PopularDishesChart from './PopularDishesChart';
import axios from 'axios';

const DashboardOverview = () => {

  const [countCustomer, setCountOfCustomer] = useState(0);
  const [countChef, setCountChef] = useState(0);

  const getCountChefs = async () => {
    try {
      const res = await axios({
        url: `http://localhost:3000/api/chefs`,
        method: "GET"
      });
      // console.log("Number of chef:", chefsData.length);
      const chefsData = res.data.data;
      const numberChef = chefsData.length;
      console.log("Number of chef:", chefsData.length);
      setCountChef(numberChef);
    } catch (err) {
      console.log("Lỗi lấy tất cả đầu bếp", err);
      message.error('Không thể tải danh sách đầu bếp');
    }
  };

  useEffect(() => {
    getCountChefs();
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Tổng quan</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Doanh thu */}
        <div className="rounded-xl p-6 shadow-sm bg-green-50 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Tổng doanh thu</p>
              <p className="text-2xl font-bold mt-2">25.450.000đ</p>
              <div className="flex items-center mt-1">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">+32%</span>
                <span className="text-sm text-gray-500 ml-1">tháng trước</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <DollarSign className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        {/* Card 2: Đơn hàng */}
        <div className="rounded-xl p-6 shadow-sm bg-blue-50 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Đơn hàng đang xử lý</p>
              <p className="text-2xl font-bold mt-2">324</p>
              <div className="flex items-center mt-1">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">+8%</span>
                <span className="text-sm text-gray-500 ml-1">tháng trước</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Utensils className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        {/* Card 3: Đầu bếp */}
        <div className="rounded-xl p-6 shadow-sm bg-orange-50 border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Đầu bếp hoạt động</p>
              <p className="text-2xl font-bold mt-2">{countChef}</p>
              <p className="text-sm text-gray-500 mt-1">Tổng {countChef} đầu bếp</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <ChefHat className="text-orange-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts - Cập nhật phần này */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Xu hướng doanh thu</h3>
            <div className="flex space-x-1">
              {['Ngày', 'Tháng', 'Quý', 'Năm'].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 relative">
            <RevenueChart />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 min-h-80">
          <h3 className="font-bold text-lg mb-6">Món ăn phổ biến theo loại</h3>
          <div className="h-64 relative">
            <PopularDishesChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;