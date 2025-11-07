import React, { useState } from 'react'
import { ChevronDown, LogOut, Menu, ShoppingBag, ShoppingCart, User, X } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

const HeaderClient = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>
      <header className="w-full bg-white border-b border-gray-200 py-3 px-6 md:px-10 flex items-center justify-between relative">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => (window.location.href = '/home')}
        >
          <img src="/image/LogoCook4u.png" alt="Logo" className="h-8" />
          <h1 className="text-2xl md:text-[32px] font-semibold text-gray-900">
            COOK4U
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-800">
          <a href="/findachef" className="hover:text-orange-500 transition">
            Tìm đầu bếp
          </a>
          <a href="/findadish" className="hover:text-orange-500 transition">
            Tìm món ăn
          </a>
          <a href="#" className="hover:text-orange-500 transition">
            Cách đặt hàng
          </a>
          <a href="#" className="hover:text-orange-500 transition">
            Về chúng tôi
          </a>
        </nav>

        {/* User Section (icon + avatar) */}
        <div className="hidden md:flex items-center space-x-4">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange-500 cursor-pointer transition" />
          
          {/* Avatar + Dropdown toggle */}
          <div className="flex items-center space-x-1 cursor-pointer">
            {/* Avatar (chữ cái đầu tên người dùng) */}
              <img
                src="/image/avatar.jpg"
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-300 hover:border-orange-500 transition cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
            {/* Mũi tên toggle */}
            <ChevronDown
              className={`w-5 h-5 text-gray-700 hover:text-orange-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {/* Thêm cái này để chỉnh ko bị lệch cái mũi tên khi bấm dô */}
            <div className={`pr-4 ${dropdownOpen ? 'hidden' : ''}`}></div>
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-10 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-44 z-50">
              
              <NavLink to="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-500">
                <User className=' inline text-gray-500 w-5 h-5' /> Trang của tôi
              </NavLink>
              <NavLink to="/orders" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-500">
                <ShoppingBag className='inline text-gray-500 w-5 h-5' /> Đơn hàng
              </NavLink>
              <div className="border-t my-1"></div>
              <NavLink to="/logout" className="block px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-600 hover:text-black transition">
                <LogOut className='inline w-5 h-5'></LogOut> Đăng xuất
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-orange-500"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start p-5 space-y-4 z-50 md:hidden">
            <a href="/findachef" className="hover:text-orange-500 transition">
              Tìm đầu bếp
            </a>
            <a href="/findadish" className="hover:text-orange-500 transition">
              Tìm món ăn
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              Cách đặt hàng
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              Về chúng tôi
            </a>

            <div className="w-full h-[1px] bg-gray-200"></div>

            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-orange-500 cursor-pointer transition" />
              <img
                src="/image/avatar.jpg"
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover border border-gray-300 hover:border-orange-500 transition cursor-pointer"
              />
            </div>
          </div>
        )}
      </header>

      {/* Render nested route */}
      <Outlet />
    </div>
  )
}

export default HeaderClient
