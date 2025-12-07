import MainTitle from "./commons/MainTitle";

const Cook4USection = () => {
    return (
        <section className="w-[80%] py-8 md:py-12 bg-white">
            <div className="container mx-auto px-4">
                {/* Title */}
                <div className="mb-10 md:mb-12">
                    <MainTitle 
                        title="Về COOK4U"
                        subtitle="Kết nối những người yêu thích ẩm thực với các đầu bếp tài năng để có những trải nghiệm ẩm thực khó quên"
                    />
                </div>
                
                {/* Content & Image */}
                <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12 mb-12 md:mb-16">
                    {/* Content */}
                    <div className="lg:w-1/2">
                        <div className="space-y-8">
                            {/* Mission */}
                            <div className="space-y-3">
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                                    Sứ mệnh của chúng tôi
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    COOK4U thu hẹp khoảng cách giữa các đầu bếp chuyên nghiệp tài năng và những người đam mê ẩm thực mong muốn trải nghiệm những bữa ăn chất lượng nhà hàng ngay tại nhà.
                                </p>
                            </div>
                            
                            {/* Why Choose Us */}
                            <div className="space-y-6">
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                                    Tại sao bạn nên chọn COOK4U?
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                Đầu bếp chuyên nghiệp đã được xác minh
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                Tất cả các đầu bếp của chúng tôi đều được kiểm tra kỹ lưỡng và có nền tảng ẩm thực chuyên nghiệp
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                Thành phần tươi ngon, chất lượng
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                Đầu bếp tìm nguồn nguyên liệu tốt nhất cho bữa ăn của bạn
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                Trải nghiệm cá nhân hóa
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                Thực đơn tùy chỉnh dựa trên sở thích và nhu cầu ăn kiêng của bạn
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                An toàn & Bảo mật
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                Đầu bếp được kiểm tra lý lịch và xử lý thanh toán an toàn
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Image */}
                    <div className="lg:w-1/2">
                        <img 
                            src="/image/Cook4U-HomePage.png" 
                            alt="Đầu bếp COOK4U" 
                            className="w-full h-auto rounded-lg shadow-md object-cover"
                        />
                    </div>
                </div>
                
                {/* Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-gray-50 p-5 rounded-lg border border-orange-300">
                        <div className="text-2xl font-bold text-orange-600 mb-1">500+</div>
                        <div className="text-orange-400 font-medium">Khách hàng yêu thích</div>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg border border-orange-300">
                        <div className="text-2xl font-bold text-orange-600 mb-1">50+</div>
                        <div className="text-orange-400 font-medium">Đầu bếp chuyên nghiệp</div>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg border border-orange-300">
                        <div className="text-2xl font-bold text-orange-600 mb-1">4.9</div>
                        <div className="text-orange-400 font-medium">Đánh giá trung bình</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Cook4USection;