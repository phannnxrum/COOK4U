import React, { useState } from 'react'
import { Menu, ShoppingBag, ShoppingBagIcon, X } from 'lucide-react'
import { Outlet } from 'react-router'

const HeaderClient = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <div>
      <header className="w-full bg-white shadow-sm py-3 px-6 md:px-10 flex items-center justify-between relative">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/image/LogoCook4u.png" alt="Logo" className="h-8" />
          <h1 className="text-2xl md:text-[32px] font-semibold text-gray-900">COOK4U</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-orange-500 transition">Tìm đầu bếp</a>
          <a href="#" className="hover:text-orange-500 transition">Tìm món ăn</a>
          <a href="#" className="hover:text-orange-500 transition">Cách đặt hàng</a>
          <a href="#" className="hover:text-orange-500 transition">Về chúng tôi</a>
        </nav>

        {/* User Section */}
        <div className="hidden md:flex items-center space-x-2 text-gray-800 hover:text-orange-500 transition cursor-pointer">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-sm font-medium">Đơn hàng của tôi</span>
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
            <a href="#" className="hover:text-orange-500 transition">Tìm đầu bếp</a>
            <a href="#" className="hover:text-orange-500 transition">Tìm món ăn</a>
            <a href="#" className="hover:text-orange-500 transition">Cách đặt hàng</a>
            <a href="#" className="hover:text-orange-500 transition">Về chúng tôi</a>

            <div className="w-full h-[1px] bg-gray-200"></div>

            <div className="flex items-center space-x-2 text-gray-800 hover:text-orange-500 transition cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-medium">Đơn hàng của tôi</span>
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