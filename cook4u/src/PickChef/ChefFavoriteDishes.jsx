import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ChefFavoriteDishes = ({ dishes }) => {
  const visibleDishes =
    dishes.length < 4 ? [...dishes, ...dishes, ...dishes] : dishes;
  return (
    <div className="bg-white p-5 min-h-90">
      <Swiper
        spaceBetween={20}
        slidesPerView={4} // 👈 Hiển thị 3 món mặc định
        loop={true}
        grabCursor={true}
        className="cursor-grab active:cursor-grabbing"
        // số thẻ theo kich thước màn hình
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 25 },
        }}
      >
        {visibleDishes.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all mt-1 mb-1 duration-200">
              <div
                className="bg-cover bg-center h-35 relative"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <p className="absolute top-2 right-2 font-semibold">
                  <span className="inline-block text-xs border px-2 py-1 bg-gray-100 rounded-full">
                    VNĐ {item.dishPrice}
                  </span>
                </p>
              </div>

              <div className="p-5 text-sm flex flex-col gap-1">
                <h2 className="text-base font-semibold">{item.name}</h2>
                <p className="text-gray-600">{item.description}</p>

                <div className="flex justify-between text-gray-700">
                  <p>Thời gian nấu:</p>
                  <p className="font-semibold">{item.cookTime}</p>
                </div>

                <div className="flex justify-between text-gray-700">
                  <p>Phù hợp cho:</p>
                  <p className="font-semibold">{item.numberOfPeople}</p>
                </div>

                <button
                  className="mt-3 flex items-center justify-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-lg transition-all duration-200 
                    whitespace-nowrap hover:-translate-y-1 hover:shadow-lg"
                >
                  Đặt món
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ChefFavoriteDishes;
