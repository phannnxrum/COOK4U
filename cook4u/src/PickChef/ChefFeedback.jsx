import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import StarRating from "./StarRating";

const ChefFeedback = ({ reviewLists }) => {
  return (
    <div className="bg-white  p-5 min-h-90">
      <Swiper
        direction="vertical"
        spaceBetween={20}
        slidesPerView="auto" //
        mousewheel={true}
        scrollbar={{ draggable: true }}
        className="h-full"
      >
        {reviewLists.map((item, index) => (
          <SwiperSlide key={index} className="!h-auto">
            <div className="border border-gray-300 p-5 rounded-2xl">
              {/* Bên trái: avatar + nội dung */}
              <div className="flex items-start gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p className="absolute top-5 right-2 text-sm text-gray-500">
                  <span className=" px-2 py-1">{item.date}</span>
                </p>

                <div className="flex flex-col">
                  <h2 className="font-semibold text-gray-800">{item.name}</h2>

                  <div className="flex items-center gap-1 mt-1">
                    <StarRating
                      rating={item.rating}
                      starSrc="/image/StarIcon.png"
                    />
                  </div>

                  <p className="mt-2 text-gray-500">{item.comment}</p>

                  <p className="bg-gray-100 px-3 py-1 rounded-full text-sm w-fit mt-2">
                    {item.dish}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ChefFeedback;
