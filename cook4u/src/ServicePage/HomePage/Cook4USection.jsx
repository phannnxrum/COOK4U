import MainTitle from "./commons/MainTitle";
import Item from "./commons/Item";
import AchievementCard from "./commons/AchievementCard";

const Cook4USection = () => {
    return (
        <section className="w-[896px] h-[782px] mt-[182px] gap-[48px] flex flex-col items-center justify-center mx-auto">
            {/*Title*/}
            <MainTitle 
                title="Về COOK4U"
                subtitle="Kết nối những người yêu thích ẩm thực với các đầu bếp tài năng để có những trải nghiệm ẩm thực khó quên"
            />
            {/*Content & Image*/}
            <div className="w-[896px] h-[518px] flex justify-between items-center">
                <div className="w-[424px] h-[518px] flex flex-col justify-between">
                    {/*Content*/}
                    <div className="w-auto h-[518px] mx-auto flex items-center justify-center gap-[48px]">
                        <div className="w-auto h-[518px] mx-auto flex flex-col items-center justify-center gap-[24px]">
                            <span className="w-[424px] h-[32px] font-bevietnampro text-[24px] leading-[32px] text-[#0A0A0A]">
                                Sứ mệnh của chúng tôi
                            </span>
                            <p className="w-[424px] h-[120px] font-arimo text-[16px] leading-[28px] text-[#717182]">
                                COOK4U thu hẹp khoảng cách giữa các đầu bếp chuyên nghiệp tài năng và những người đam mê ẩm thực mong muốn trải nghiệm những bữa ăn chất lượng nhà hàng ngay tại nhà. Chúng tôi tin rằng ẩm thực tuyệt vời sẽ gắn kết mọi người lại với nhau và tạo nên những kỷ niệm khó quên.
                            </p>
                            <span className="w-[424px] h-[32px] font-bevietnampro text-[24px] leading-[32px] text-[#0A0A0A]">
                                Tại sao bạn nên chọn COOK4U?
                            </span>
                            {/*Items*/}
                            <div className="w-[424px] h-[120px] flex flex-col">
                                <Item
                                    mainContent={"Đầu bếp chuyên nghiệp đã được xác minh:"}
                                    description={"Tất cả các đầu bếp của chúng tôi đều được kiểm tra kỹ lưỡng và có nền tảng ẩm thực chuyên nghiệp"}
                                    />
                                <Item
                                    mainContent={"Thành phần tươi ngon, chất lượng:"}
                                    description={"Đầu bếp tìm nguồn nguyên liệu tốt nhất cho bữa ăn của bạn"}
                                    />
                                <Item
                                    mainContent={"Trải nghiệm cá nhân hóa:"}
                                    description={"Thực đơn tùy chỉnh dựa trên sở thích và nhu cầu ăn kiêng của bạn"}
                                    />
                                <Item
                                    mainContent={"An toàn & Bảo mật:"}
                                    description={"Đầu bếp được kiểm tra lý lịch và xử lý thanh toán an toàn"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/*Image*/}
                <div className="flex items-center">
                    <img src="/image/Cook4U-HomePage.png" alt="Cook4U" className="w-[424px] h-[300px] object-cover"/>
                </div>
            </div>
            {/*Achievements*/}
            <div className="w-[896px] h-[120px] mt-[48px] flex items-center justify-center gap-[48px]">
                <AchievementCard
                    number={"36+"}
                    title={"Khách hàng yêu thích"}
                />
                <AchievementCard
                    number={"36+"}
                    title={"Đầu bếp chuyên nghiệp "}
                />
                <AchievementCard
                    number={"3.6"}
                    title={"Đánh giá trung bình"}
                />
            </div>
        </section>
    );
}

export default Cook4USection;