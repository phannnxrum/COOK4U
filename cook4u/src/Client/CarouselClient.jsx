import { MessageCircle, Search, Star, Users } from 'lucide-react'
import React from 'react'
import MonAnDcYeuThich from './MonAnDcYeuThich'

const CarouselClient = () => {
    return (
        <div>
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16 px-6 md:px-10 flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Left Content */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left mt-10 md:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-[55px] font-bold leading-snug">
            Đầu bếp chuyên nghiệp <br />
            <span className="text-orange-500">nấu ăn tại nhà bạn</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto md:mx-0">
            Thức ăn chuẩn gu, đầu bếp chuyên nghiệp, dịch vụ tận nhà.
          </p>

          {/* Search Box */}
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden w-full max-w-md mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn hoặc loại ẩm thực..."
              className="flex-1 px-5 py-3 outline-none text-gray-700 text-sm sm:text-base"
            />
            <button className="bg-orange-500 text-white p-3 sm:p-4 hover:bg-orange-600 transition cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Rating */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start sm:space-x-6 space-y-2 sm:space-y-0 text-gray-700 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span>50+ Khách hàng yêu thích</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.9 Đánh giá trung bình</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/image/CarouselClient.png"
            alt="Steak dish"
            className="shadow-lg w-full max-w-[500px] h-auto md:h-[400px] object-cover object-[25%_75%] rounded-xl"
          />
        </div>

        {/* Floating Chat Button */}
        <button className="fixed cursor-pointer bottom-6 right-6 bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition">
          <MessageCircle className="w-6 h-6" />
        </button>
      </section>

      <MonAnDcYeuThich />
    </div>
    )
}

export default CarouselClient