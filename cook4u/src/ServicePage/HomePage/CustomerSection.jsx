import MainTitle from "./commons/MainTitle";
import ReviewCard from "./commons/ReviewCard";

const CustomerSection = () => {
    return (
        <section className="w-full h-[296px] mt-[96px] mx-auto gap-[48px] flex flex-col items-center justify-center">
            {/*Title*/}
            <MainTitle 
                title="Khách hàng của chúng tôi"
                subtitle="Trải nghiệm thực tế từ những người yêu thích ẩm thực thực thụ"
            />  
            {/*Customer Reviews, update later*/}
            <div className="w-[1248px] h-[224px] grid grid-cols-3 gap-[24px]">
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