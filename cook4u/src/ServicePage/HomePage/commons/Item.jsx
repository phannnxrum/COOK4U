const Item = ({ mainContent, description }) => {
    return (
        <div className="w-[424px] h-[291px] mx-auto grid grid-cols-[8px_1fr] items-center gap-[12px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[#FF6B35]">
            </div>
            <div className="w-[371px] h-[72px] flex flex-col items-start">
                <span className="font-arimo font-bold text-[16px] leading-[32px] text-[#717182]">{mainContent}</span>
                <p className="font-arimo text-[16px] leading-[24px] text-[#717182]">{description}</p>
            </div>
        </div>
    );
};

export default Item;