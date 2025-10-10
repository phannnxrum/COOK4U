import React from "react";
import { HowItWork } from "./HowItWork";

const FeatureSection = () => {
  const handleScroll = () => {
    const target = document.getElementById("calltoaction-section");
    target.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="bg-amber-50 py-10" id="feature-section">
      <div className="container mx-auto px-10">
        <ul className="flex flex-col sm:flex-row justify-between gap-3">
          <li className="w-80 h-70 border border-orange-200 rounded-2xl bg-white text-center shadow-sm hover:shadow-md transition py-10">
            <img
              src="/image/ChefIcon.png"
              alt=""
              className="mx-auto mb-4 w-20"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Đầu bếp chuyên nghiệp
            </h2>
            <p className="text-gray-600 text-lg px-5">
              Đầu bếp giàu kinh nghiệm nấu những bữa ăn tươi ngon ngay tại gian
              bếp nhà bạn
            </p>
          </li>
          <li className="w-80 h-70 border border-orange-200 rounded-2xl bg-white text-center shadow-sm hover:shadow-md transition py-10">
            <img
              src="/image/PeopleIcon.png"
              alt=""
              className="mx-auto mb-4 w-20"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Dịch vụ cá nhân hóa
            </h2>
            <p className="text-gray-600 text-lg px-5">
              Bữa ăn được thiết kế riêng dựa trên sở thích và nhu cầu ăn kiêng
              của bạn
            </p>
          </li>
          <li className="w-80 h-70 border border-orange-200 rounded-2xl bg-white text-center shadow-sm hover:shadow-md transition py-10">
            <img
              src="/image/ClockIcon.png"
              alt=""
              className="mx-auto mb-4 w-20"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Đặt lịch thuận tiện
            </h2>
            <p className="text-gray-600 text-lg px-5">
              Đặt lịch nấu ăn phù hợp với lịch trình của bạn
            </p>
          </li>
          <li className="w-80 h-70 border border-orange-200 rounded-2xl bg-white text-center shadow-sm hover:shadow-md transition py-10">
            <img
              src="/image/StarIcon.png"
              alt=""
              className="mx-auto mb-4 w-20"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Chú trọng chất lượng
            </h2>
            <p className="text-gray-600 text-lg px-5">
              Đầu bếp được đánh giá cao với những đánh giá được xác minh và đảm
              bảo chất lượng
            </p>
          </li>
        </ul>
      </div>
      <h2 className="text-4xl font-bold py-7 text-center">
        Cách thức hoạt động
      </h2>
      <HowItWork></HowItWork>
      <div className="flex justify-center ">
        <img
          src="/image/SmallArrow.png"
          alt="Scroll down"
          onClick={handleScroll}
          className="w-10 animate-bounce cursor-pointer"
        />
      </div>
    </section>
  );
};

export default FeatureSection;
