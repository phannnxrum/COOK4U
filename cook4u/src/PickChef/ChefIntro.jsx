import React from "react";

const ChefIntro = ({ chef }) => {
  return (
    <div className="bg-white flex flex-col md:flex-row p-5 gap-10 min-h-90">
      <div className="border border-gray-200 rounded-2xl p-5 px-10 md:w-1/2 flex flex-col gap-5">
        <h2 className="text-xl">Kinh nghiệm & Kỹ năng</h2>
        <div>
          <h2>Sở trường</h2>
          <div className="flex flex-wrap gap-3 py-1 ">
            {chef?.tags?.map((item, index) => (
              <span
                key={index}
                className="border border-gray-300 px-4 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2>Ngôn ngữ</h2>
          <div className="flex flex-wrap gap-3 py-1">
            {chef?.languages && chef.languages.length > 0 ? (
              chef.languages.map((item, index) => (
                <span
                  key={index}
                  className="border border-gray-300 px-4 rounded-full"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-gray-500 italic text-sm">
                Chưa có thông tin ngôn ngữ
              </span>
            )}
          </div>
        </div>
        <div>
          <h2>Chứng nhận</h2>
          <div className="flex flex-col gap-1 py-1">
            {chef.certifications.map((item, index) => (
              <span className="text-sm text-gray-500" key={index}>
                • {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-2xl border-gray-200 p-5 px-10 md:w-1/2 flex flex-col gap-5">
        <h2 className="text-xl">Chi tiết dịch vụ</h2>
        <div className="flex gap-60">
          <div className="">
            <p className="text-sm text-gray-500 py-1">Giá dịch vụ:</p>
            <p className="font-semibold">VNĐ {chef.price}</p>
          </div>
          <div className="">
            <p className="text-sm text-gray-500 py-1">Thời lượng tối thiểu</p>
            <p className="font-semibold">{chef.serviceDetails.minDuration} tiếng</p>
          </div>
        </div>
        <div>
          <h2>Bao gồm</h2>
          <div className="flex flex-col gap-1 py-1">
            {chef.serviceDetails.includes.map((item, index) => (
              <span className="text-sm text-gray-500" key={index}>
                • {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefIntro;
