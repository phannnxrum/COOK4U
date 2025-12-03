const DishTypeCard = ({ dishType, imageUrl, number }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-auto min-h-[250px] md:h-[280px] lg:h-[300px] gap-3 md:gap-4 lg:gap-[16px] p-3 md:p-4 lg:p-[16px] rounded-xl lg:rounded-[16px] border border-[#E8E8E8] shadow-md hover:shadow-lg cursor-pointer">
            <img src={imageUrl} alt={dishType} className="w-full max-w-[200px] md:max-w-[220px] lg:max-w-none h-auto md:h-[150px] lg:h-[192px] object-contain" />
            <p className="text-base md:text-lg lg:text-[20px] text-[#0A0A0A] text-center">{dishType}</p>
            <p className="font-arimo text-sm md:text-base lg:text-[16px] text-[#717182]">{number} món có sẵn</p>
        </div>
    );
}

export default DishTypeCard;