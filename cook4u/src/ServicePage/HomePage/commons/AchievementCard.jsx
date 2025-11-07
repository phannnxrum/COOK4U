const AchievementCard = ({ number, title }) => {
    return (
        <div className="w-full max-w-[224px] h-auto min-h-[100px] md:h-[110px] lg:h-[120px] flex flex-col items-center justify-center gap-3 md:gap-4 lg:gap-[16px]">
            <span className="font-arimo font-bold text-2xl md:text-3xl lg:text-[30px] leading-7 md:leading-8 lg:leading-[36px] text-[#FF6B35] text-center">{number}</span>
            <span className="font-arimo text-sm md:text-base lg:text-[16px] leading-5 md:leading-6 lg:leading-[24px] text-[#717182] text-center">{title}</span>
        </div>
    );
};

export default AchievementCard;