import MainTitle from "./commons/MainTitle";
import ReviewCard from "./commons/ReviewCard";

const CustomerSection = () => {
    return (
        <section className="w-full min-h-auto md:h-auto lg:h-[296px] mt-12 md:mt-16 lg:mt-[96px] mx-auto gap-6 md:gap-8 lg:gap-[48px] flex flex-col items-center justify-center px-4 md:px-6 lg:px-0">
            {/*Title*/}
            <MainTitle 
                title="Khách hàng của chúng tôi"
                subtitle="Trải nghiệm thực tế từ những người yêu thích ẩm thực thực thụ"
            />  
            {/*Customer Reviews, update later*/}
            <div className="w-full max-w-[1248px] h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-[24px]">
                <ReviewCard 
                    avatarURL="/image/Avatar1.png"
                    userName="Nguyễn Văn A"
                    userRating="3.6"
                    ratingDescription="Dịch vụ tuyệt vời! Đầu bếp rất chuyên nghiệp và món ăn ngon tuyệt."
                    dishType="Món Việt"
                    time="2 ngày trước"
                />
                {/*Update later*/}
            </div>
        </section>
    )
}

export default CustomerSection;