const StepCard = ({ iconURL, stepName, description }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[288px] h-auto min-h-[140px] md:h-[160px] lg:h-[164px] mx-auto gap-2 md:gap-3 lg:gap-[8px]">
            <div className="flex items-center justify-center w-14 h-14 md:w-14 md:h-14 lg:w-[64px] lg:h-[64px] rounded-full bg-orange-500">
                <img src={iconURL} alt={stepName} className="w-6 h-6 md:w-7 md:h-7 lg:w-[32px] lg:h-[32px]" />
            </div>
            <p className="w-full max-w-[288px] h-auto lg:h-[28px] md:text-lg lg:text-[20px] leading-6 md:leading-7 lg:leading-[28px] text-center text-black text-xl">{stepName}</p>
            <p className="w-full max-w-[276px] h-auto lg:h-[48px] font-arimo text-xs md:text-sm lg:text-[15px] leading-5 md:leading-6 lg:leading-[24px] text-center text-gray-500">{description}</p>
        </div>
    )
};

export default StepCard;