const StepCard = ({ iconURL, stepName, description }) => {
    return (
        <div className="flex flex-col items-center justify-center w-[288px] h-[164px] mx-auto gap-[8px]">
            <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full bg-[#FF6B35]">
                <img src={iconURL} alt={stepName} className="w-[32px] h-[32px]" />
            </div>
            <p className="w-[288px] h-[28px] text-[20px] leading-[28px] text-center text-[#0A0A0A]">{stepName}</p>
            <p className="w-[276px] h-[48px] font-arimo text-[14px] leading-[24px] text-center text-[#717182]">{description}</p>
        </div>
    )
};

export default StepCard;