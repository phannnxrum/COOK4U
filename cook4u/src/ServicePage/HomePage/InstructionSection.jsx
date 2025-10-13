import MainTitle from "./commons/MainTitle";
import StepCard from "./commons/StepCard";

const InstructionSection = () => {
    return (
        <section className="gap-[48px] flex flex-col items-center justify-center w-[1280px] h-[296px] mt-[100px] mx-auto">
            <MainTitle 
                title="Cách thức COOK4U hoạt động"
                subtitle="Các bước đơn giản để có bữa ăn chất lượng đầu bếp tại nhà"
            />
            <div className="w-[1248px] h-[164px] grid grid-cols-4 gap-[32px]">
                <StepCard 
                    iconURL="/icons/Search.svg"
                    stepName="Tìm & chọn món ăn"
                    description="Duyệt qua các món ăn đa dạng từ đầu bếp chuyên nghiệp"
                />
                <StepCard 
                    iconURL="/icons/Chef.svg"
                    stepName="Lựa chọn đầu bếp"
                    description="Tìm và chọn đầu bếp phù hợp với món ăn bạn muốn"
                />
                <StepCard 
                    iconURL="/icons/Time.svg"
                    stepName="Lên lịch"
                    description="Chọn thời gian phù hợp và xác nhận chi tiết đặt chỗ"
                />
                <StepCard 
                    iconURL="/icons/BlackStar.svg"
                    stepName="Thanh toán & thưởng thức"
                    description="Hoàn tất thanh toán và đầu bếp đến nhà nấu cho bạn"
                />
            </div>
        </section>
    )
}

export default InstructionSection;