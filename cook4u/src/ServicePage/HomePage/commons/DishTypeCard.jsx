const DishTypeCard = ({ dishType, imageUrl, number }) => {
    return (
        <div className="flex flex-col items-center justify-center w-auto h-[300px] gap-[16px] p-[16px] rounded-[16px] border border-[#E8E8E8] shadow-md hover:shadow-lg cursor-pointer">
            <img src={imageUrl} alt={dishType} className="w-auto h-[192px]" />
            <p className="text-[20px] text-[#0A0A0A]">{dishType}</p>
            <p className="font-arimo text-[16px] text-[#717182]">{number} món có sẵn</p>
        </div>
    );
}

export default DishTypeCard;