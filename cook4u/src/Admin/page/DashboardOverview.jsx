import React from 'react';
import { TrendingUp, ChefHat, Users, DollarSign, Utensils } from 'lucide-react';
import RevenueChart from './RevenueChart';
import PopularDishesChart from './PopularDishesChart';

const DashboardOverview = () => {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "128.450.000đ",
      change: "+32%",
      icon: <DollarSign className="text-green-500" size={24} />,
      color: "bg-green-50",
    },
    {
      title: "Đơn hàng đang xử lý",
      value: "324",
      change: "+8%",
      icon: <Utensils className="text-blue-500" size={24} />,
      color: "bg-blue-50",
    },
    {
      title: "Đầu bếp hoạt động",
      value: "2 / 3",
      subtext: "Tổng 3 đầu bếp",
      icon: <ChefHat className="text-orange-500" size={24} />,
      color: "bg-orange-50",
    },
    {
      title: "Tổng khách hàng",
      value: "1.247",
      change: "+18%",
      icon: <Users className="text-purple-500" size={24} />,
      color: "bg-purple-50",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Tổng quan</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl p-6 shadow-sm`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                {stat.subtext && (
                  <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
                )}
                {stat.change && (
                  <div className="flex items-center mt-2">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 text-sm font-medium">{stat.change} so với trước</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
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