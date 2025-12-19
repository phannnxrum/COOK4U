import React, { useState } from 'react';
import { 
  BarChart3, 
  Utensils, 
  ChefHat, 
  AlertTriangle,
  Bell,
  User,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const DashboardLayout = ({ activeTab, onTabChange, children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const tabs = [
    { key: 'overview', label: 'Tổng quan', icon: <BarChart3 size={18} /> },
    { key: 'dishes', label: 'Món ăn', icon: <Utensils size={18} /> },
    { key: 'chefs', label: 'Đầu bếp', icon: <ChefHat size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4">
          {/* Top Header */}
          <div className="flex justify-between items-center py-3">
            <div>
              <h1 className="text-3xl font-bold text-red-500">COOK4U</h1>
              <p className="text-gray-600">Bảng điều khiển Admin - Quản lý nền tảng COOK4U</p>
            </div>
            
            {/* User Section - Tương tự HeaderClient */}
            <div className="flex items-center space-x-4">
              
              {/* Avatar Dropdown */}
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer group"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                      <User size={22} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      dropdownOpen
                        ? "rotate-180 text-red-500"
                        : "group-hover:text-red-500"
                    }`}
                  />
                </div>

                {/* Dropdown Menu - Tương tự HeaderClient */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-14 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-52 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          {user?.fullname || "Admin"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.email || "admin@chefhire.com"}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs font-bold bg-red-100 text-red-600 rounded-full mt-1">
                          ADMIN
                        </span>
                      </div>

                      <div className="border-t border-gray-100 my-1"></div>

                      {/* Nút Đăng xuất */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full cursor-pointer px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                      >
                        <LogOut className="mr-3 w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slideDown mt-4">
              <div className="py-4">
                <div className="flex flex-col space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        onTabChange(tab.key);
                        setMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-4 py-3 text-left ${
                        activeTab === tab.key
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-700 hover:text-red-500 hover:bg-gray-50'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  
                  <div className="h-px bg-gray-200 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                  >
                    <LogOut className="mr-3 w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Tabs - Desktop */}
          <div className="hidden md:flex space-x-10 mt-6 border-b">
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