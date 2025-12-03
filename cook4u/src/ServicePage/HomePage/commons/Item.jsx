const Item = ({ mainContent, description }) => {
    return (
        <div className="w-full max-w-[424px] h-auto min-h-[60px] md:h-[70px] lg:h-[72px] mx-auto grid grid-cols-[8px_1fr] items-start gap-2 md:gap-3 lg:gap-[12px]">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-[8px] lg:h-[8px] rounded-full bg-[#FF6B35] mt-1 md:mt-1.5 lg:mt-2">
            </div>
            <div className="w-full max-w-[371px] h-auto lg:h-[72px] flex flex-col items-start">
                <span className="font-arimo font-bold text-sm md:text-base lg:text-[16px] leading-6 md:leading-7 lg:leading-[32px] text-[#717182]">{mainContent}</span>
                <p className="font-arimo text-xs md:text-sm lg:text-[16px] leading-5 md:leading-6 lg:leading-[24px] text-[#717182]">{description}</p>
            </div>
        </div>
    );
};

export default Item;