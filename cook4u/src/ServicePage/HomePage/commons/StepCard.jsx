const StepCard = ({ iconURL, stepName, description }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[288px] h-auto min-h-[140px] md:h-[160px] lg:h-[164px] mx-auto gap-2 md:gap-3 lg:gap-[8px]">
            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-[64px] lg:h-[64px] rounded-full bg-[#FF6B35]">
                <img src={iconURL} alt={stepName} className="w-6 h-6 md:w-7 md:h-7 lg:w-[32px] lg:h-[32px]" />
            </div>
            <p className="w-full max-w-[288px] h-auto lg:h-[28px] text-base md:text-lg lg:text-[20px] leading-6 md:leading-7 lg:leading-[28px] text-center text-[#0A0A0A]">{stepName}</p>
            <p className="w-full max-w-[276px] h-auto lg:h-[48px] font-arimo text-xs md:text-sm lg:text-[14px] leading-5 md:leading-6 lg:leading-[24px] text-center text-[#717182]">{description}</p>
        </div>
    )
};

export default StepCard;