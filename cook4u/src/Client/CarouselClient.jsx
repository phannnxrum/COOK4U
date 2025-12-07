import { MessageCircle, Search, Star, Users, ChefHat, Clock, Shield } from 'lucide-react'
import React, { useState } from 'react'

const CarouselClient = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="relative overflow-x-hidden w-full">
      <section className="bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 py-16 md:py-20 flex flex-col-reverse md:flex-row items-center justify-between min-h-[85vh] w-full relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-200/30 to-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-10 w-10 h-10 bg-orange-300/20 rounded-full blur-xl"></div>
        </div>

        {/* Container để giữ nội dung không quá rộng */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex flex-col-reverse md:flex-row items-center justify-between w-full">
          {/* Left Content */}
          <div className="w-full md:w-1/2 space-y-8 text-center md:text-left mt-12 md:mt-0 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Đầu bếp 5 sao tại nhà bạn</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold leading-tight tracking-tight">
                <span className="text-gray-900">Trải nghiệm ẩm thực</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  đẳng cấp tại gia
                </span>
              </h1>

              <p className="text-gray-600 text-lg sm:text-xl max-w-xl leading-relaxed">
                Khám phá hương vị tuyệt hảo với đội ngũ đầu bếp chuyên nghiệp, 
                nguyên liệu tươi ngon và dịch vụ tận tâm ngay tại không gian riêng của bạn.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative max-w-xl group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="pl-5">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm món ăn, đầu bếp hoặc loại ẩm thực..."
                  className="flex-1 px-4 py-4 outline-none text-gray-800 text-base placeholder-gray-400 bg-transparent"
                />
                <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 md:px-8 py-4 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-semibold flex items-center gap-2 group/btn">
                  <span>Tìm kiếm</span>
                  <Search className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Features & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl pt-4">
              <div className="flex flex-col items-center md:items-start gap-2 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <span className="font-semibold text-gray-800">500+ Khách hàng</span>
                <span className="text-sm text-gray-600">Hài lòng dịch vụ</span>
              </div>

              <div className="flex flex-col items-center md:items-start gap-2 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <span className="font-semibold text-gray-800">4.9/5</span>
                <span className="text-sm text-gray-600">Đánh giá trung bình</span>
              </div>

              <div className="flex flex-col items-center md:items-start gap-2 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="font-semibold text-gray-800">100% An toàn</span>
                <span className="text-sm text-gray-600">Vệ sinh & chất lượng</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center relative z-10">
            <div className="relative max-w-[550px] w-full">
              {/* Image container with decoration */}
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl rotate-12 shadow-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-orange-400 to-amber-300 rounded-2xl -rotate-12 shadow-xl"></div>
                
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  <img
                    src="/image/CarouselClient.png"
                    alt="Đầu bếp chuyên nghiệp nấu ăn tại nhà"
                    className="w-full h-[280px] sm:h-[350px] md:h-[450px] object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Floating info cards */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl max-w-[200px] animate-float">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">15-30 phút</p>
                    <p className="text-sm text-gray-600">Chuẩn bị</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl max-w-[200px] animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChefHat className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Chuyên gia</p>
                    <p className="text-sm text-gray-600">Đầu bếp 5*</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CarouselClient