import MainTitle from "./commons/MainTitle";
import ReviewCard from "./commons/ReviewCard";
import { Star } from "lucide-react";

const CustomerSection = () => {
    return (
        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-white to-orange-50">
            <div className="container mx-auto px-4">
                {/* Title */}
                <div className="mb-10 md:mb-12 text-center">
                    <MainTitle 
                        title="Khách hàng của chúng tôi"
                        subtitle="Trải nghiệm thực tế từ những người yêu thích ẩm thực thực thụ"
                    />
                </div>
                
                {/* Customer Reviews */}
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ReviewCard 
                            avatarURL="https://i.pravatar.cc/150?img=1"
                            userName="Nguyễn Văn A"
                            userRating="4.8"
                            ratingDescription="Dịch vụ tuyệt vời! Đầu bếp rất chuyên nghiệp và món ăn ngon tuyệt."
                            dishType="Món Việt"
                            time="2 ngày trước"
                        />
                        
                        <ReviewCard 
                            avatarURL="https://i.pravatar.cc/150?img=1"
                            userName="Trần Thị B"
                            userRating="4.9"
                            ratingDescription="Ấn tượng với chất lượng món ăn và thái độ phục vụ. Sẽ quay lại!"
                            dishType="Món Âu"
                            time="1 tuần trước"
                        />
                        
                        <ReviewCard 
                            avatarURL="https://i.pravatar.cc/150?img=1"
                            userName="Lê Văn C"
                            userRating="4.7"
                            ratingDescription="Trải nghiệm ẩm thực tại nhà tuyệt vời, đáng đồng tiền."
                            dishType="Món Á"
                            time="3 ngày trước"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CustomerSection;