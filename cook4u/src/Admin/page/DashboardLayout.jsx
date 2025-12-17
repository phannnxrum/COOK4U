import React from 'react';
import { 
  BarChart3, 
  Utensils, 
  ChefHat, 
  AlertTriangle,
  Bell,
  User,
  Settings
} from 'lucide-react';

const DashboardLayout = ({ activeTab, onTabChange, children }) => {
  const tabs = [
    { key: 'overview', label: 'Tổng quan', icon: <BarChart3 size={18} /> },
    { key: 'dishes', label: 'Món ăn', icon: <Utensils size={18} /> },
    { key: 'chefs', label: 'Đầu bếp', icon: <ChefHat size={18} /> },
    { key: 'violations', label: 'Vi phạm', icon: <AlertTriangle size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center py-3">
            <div>
              <h1 className="text-3xl font-bold text-red-500">COOK4U</h1>
              <p className="text-gray-600">Bảng điều khiển Admin - Quản lý nền tảng COOK4U</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-10 mt-6 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center space-x-2 cursor-pointer px-4 py-3 font-bold transition-colors ${
                  activeTab === tab.key
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;