const AchievementCard = ({ number, title }) => {
    return (
        <div className="w-[224px] h-[120px] flex flex-col items-center justify-center gap-[16px]">
            <span className="font-arimo font-bold text-[30px] leading-[36px] text-[#FF6B35] text-center">{number}</span>
            <span className="font-arimo text-[16px] leading-[24px] text-[#717182] text-center">{title}</span>
        </div>
    );
};

export default AchievementCard;