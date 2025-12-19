import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../User/Footer.jsx";
import axios from "axios";

const HeaderClient = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const [originalData, setOriginalData] = useState({});
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    reward: "",
    avatar: "https://i.pravatar.cc/150?img=50",
  });

  // Lấy token từ localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Hàm lấy thông tin user
  const fetchUserData = () => {
    axios
      .get("http://localhost:3000/api/users/me", getAuthHeader())
      .then((res) => {
        const user = res.data.data;
        const newData = {
          fullname: user.FULLNAME || "",
          email: user.EMAIL || "",
          phone: user.PHONENUMBER || "",
          address: user.ADDRESS || "",
          bio: user.INTRODUCTION || "",
          reward: user.REWARDPOINT || "0",
          avatar: user.AVTURL || "https://i.pravatar.cc/150?img=50",
        };
        setProfileData(newData);
        setOriginalData(newData); // Lưu dữ liệu gốc để hủy
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        alert("Không thể tải thông tin người dùng");
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <div className="">
      <header className="w-full bg-white border-b rounded border-gray-300 shadow-sm sticky top-0 z-50">
        <div className="mx-auto px-4 py-3 md:px-6 md:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => navigate("/home")}
            >
              <div className="relative">
                <img
                  src="/image/LogoCook4u.png"
                  alt="Logo"
                  className="h-8 md:h-10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                COOK4U
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-5 space-x-1">
              <NavLink
                to="/home/findachef"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                  }`
                }
              >
                Tìm đầu bếp
              </NavLink>
              <NavLink
                to="/home/findadish"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                  }`
                }
              >
                Tìm món ăn
              </NavLink>
              <NavLink
                to="/home/aboutus"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                  }`
                }
              >
                Về chúng tôi
              </NavLink>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <NavLink to={"/home/mycart"} className="relative">
                <div className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-orange-500 transition-colors" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/* Avatar Dropdown */}
              <div className="hidden md:block relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer group"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="relative">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt={user.fullname}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.fullname.charAt(0)}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      dropdownOpen
                        ? "rotate-180 text-orange-500"
                        : "group-hover:text-orange-500"
                    }`}
                  />
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-14 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-52 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          {user?.fullname || "Người dùng"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>

                      <NavLink
                        to="/home/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="mr-3 text-gray-500 w-4 h-4" />
                        <span>Trang của tôi</span>
                      </NavLink>

                      <NavLink
                        to="/orders"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ShoppingBag className="mr-3 text-gray-500 w-4 h-4" />
                        <span>Đơn hàng</span>
                      </NavLink>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full cursor-pointer px-4 py-3 text-sm font-medium text-red-600 hover:bg-orange-500 hover:text-white transition-colors rounded-b-xl"
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
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slideDown">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-1">
                <NavLink
                  to="/home/findachef"
                  className="px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Tìm đầu bếp
                </NavLink>
                <NavLink
                  to="/home/findadish"
                  className="px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Tìm món ăn
                </NavLink>
                <NavLink
                  to="/home/aboutus"
                  className="px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Về chúng tôi
                </NavLink>

                <div className="h-px bg-gray-200 my-2"></div>

                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user?.avatar || "/image/avatar.jpg"}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.fullname || "Người dùng"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email
                          ? user.email.substring(0, 15) +
                            (user.email.length > 15 ? "..." : "")
                          : "Xem hồ sơ"}
                      </p>
                    </div>
                  </div>
                  <NavLink
                    to={"/home/mycart"}
                    className="relative"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ShoppingCart className="w-6 h-6 text-gray-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                </div>

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

        {/* Floating Chat Button */}
        <button className="fixed bottom-6 right-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-orange-300/50 hover:scale-110 transition-all duration-300 group z-50 animate-bounce-slow">
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse"></span>
        </button>
      </header>

      {/* Main Content */}
      <>
        <Outlet />
      </>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HeaderClient;
