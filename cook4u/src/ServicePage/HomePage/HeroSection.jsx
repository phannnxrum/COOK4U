const HeroSection = () => {
  return (
    <section className="w-full h-[656px] mx-auto flex items-center justify-center bg-gradient-to-b from-[#F4D0C4] to-[#FFEDD4]">
        <div className="w-[1248px] h-[400px] flex justify-between items-center">
            <div className="w-[600px] h-[332px] top-[34px]">
                {/* Text Content */}
                <div className="w-[600px] h-[192px] mb-6">
                    <div className= "w-[600px] h-[120px]">
                        <p className="w-[621px] h-[60px] mt-[-6.4px] font-arimo font-bold text-[55px] leading-[60px]">
                            Đầu bếp chuyên nghiệp
                        </p>
                        <div className="w-[600px] h-[60px] top-[60.2px]">
                            <p className="w-[458px] h-[60px] mt-[-6.4px] font-arimo font-bold text-[55px] leading-[60px] tracking-[-1.5px] text-[#FF6B35]">
                                nấu ăn tại nhà bạn
                            </p>                        
                        </div>
                    </div>
                    <div className="w-[512px] h-[56px] top-[136px]">
                        <p className="w-[379px] h-[56px] top-[-1.8px] font-bevietnampro text-[18px] leading-[28px] text-[#665D5D]">
                            Thức ăn chuẩn gu, đầu bếp chuyên nghiệp, dịch vụ tận nhà.
                        </p>
                    </div>
                </div>
                {/* Search Box */}
                <div className="flex flex-row w-[512px] h-[56px] top-[224px] rounded-[10px] pt-[8px] pr-[8px] pl-[8px] gap-[8px] bg-white">
                    <input className="w-[440px] h-[36px] rounded-[8px] pt-[4px] pr-[12px] pl-[12px] pb-[4px] bg-[#F3F3F5] text-[14px] text-[#717182] font-arimo" placeholder="Tìm kiếm món ăn hoặc loại ẩm thực..."/>
                    <button className="flex justify-center items-center w-[48px] h-[40px] rounded-[8px] bg-[#FF6B35]">
                        <img src="/icons/Search.svg" alt="Search" className="w-[16px] h-[16px]"/>
                    </button>
                </div>
                {/* Rating */}
                <div className="flex flex-row items-center w-[600px] h-[20px] top-[312px] mt-[32px] mb-[32px] gap-[18px]">
                    <img src="/icons/Number.svg" alt="Number" className="w-[16px] h-[16px]"/>
                    <span className="w-[164px] h-[20px] mt-[-1.2px] font-arimo text-[14px] leading-[20px] text-[#717182]">50+ Khách hàng yêu thích</span> {/* Sửa lại sau */}
                    <img src="/icons/Star.svg" alt="Star" className="w-[16px] h-[16px]"/>
                    <span className="w-[164px] h-[20px] mt-[-1.2px] font-arimo text-[14px] leading-[20px] text-[#717182]">4.9 Đánh giá trung bình</span> {/* Sửa lại sau */}
                </div>
            </div>

            <div className="relative w-[533px] h-[400px]">
                {/*Ảnh món ăn*/}
                <img
                src="/image/HeroSection-HomePage.png"
                alt="MonAn"
                className="w-[533px] h-[400px] object-cover"
                />
                {/* Nút chat */}
                <div className="absolute bottom-[-16px] right-[-16px]">
                    <button className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#FF6B35]">
                        <img src="/icons/Chat.svg" alt="Chat" className="w-[16px] h-[16px]"/>
                    </button>
                </div>
            </div>
        </div>
    </section>
  );
};

export default HeroSection;
