import React from "react";
import { Footer } from "./Footer";

const CallToActionSection = () => {
  return (
    <section className="bg-amber-50 py-10" id="calltoaction-section">
      <div className="flex justify-center items-center">
        <div className="border border-white rounded-2xl bg-orange-500 w-full max-w-7xl text-center space-y-10 flex flex-col items-center mb-10 mt-10 px-6 py-12">
          <h1 className="text-5xl text-white font-bold">Sẵn sàng bắt đầu ?</h1>
          <h2 className="text-2xl text-white">
            Tham gia COOK4U ngay hôm nay và trải nghiệm dịch vụ nấu ăn tại nhà
            tuyệt vời
          </h2>
          <a
            href="/sign-up"
            className="text-2xl bg-white text-orange-500 border border-orange-500 rounded-2xl px-20 py-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Đăng ký miễn phí
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
