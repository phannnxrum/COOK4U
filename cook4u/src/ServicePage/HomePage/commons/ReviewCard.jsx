const ReviewCard = ({ avatarURL, userName, userRating, ratingDescription, dishType, time}) => {
    // function starRating({rate}) {
    //     const totalStars = 5;
    //     const percentage = (rate / totalStars) * 100;

    //     return (
    //         <div className="relative flex w-max">
    //             {/* Gray / inactive stars */}
    //             {[...Array(totalStars)].map((_, i) => (
    //                 <img
    //                 key={i}
    //                 src="/icons/BlackStar.svg"
    //                 className={`w-[${16}px] h-[${16}px] mr-[${4}px]`}
    //                 />
    //             ))}

    //             {/* Overlay: active stars */}
    //             <div
    //                 className="absolute top-0 left-0 flex overflow-hidden"
    //                 style={{ width: `${percentage * (16 + 4)}px` }}
    //             >
    //                 {[...Array(totalStars)].map((_, i) => (
    //                 <img
    //                     key={i}
    //                     src="/icons/Star.svg"
    //                     className={`w-[${16}px] h-[${16}px] mr-[${4}px]`}
    //                 />
    //                 ))}
    //             </div>
    //         </div>
    //     );
    // }
    return (
        <div className="w-[288px] h-[224px] p-[16px] border border-[#E0E0E0] rounded-[8px] flex flex-col">
            {/* User Info */}
            <div className="flex items-center mb-[12px]">
                <img src={avatarURL} alt="Avatar" className="w-[40px] h-[40px] rounded-full mr-[12px]" />
                <div>
                    <p className="font-arimo font-bold text-[16px] leading-[24px] text-[#333333]">{userName}</p>
                    <div className="flex items-center">
                        <img src="/icons/Star.svg" alt="Star" className="w-[16px] h-[16px] mr-[4px]" />
                        <span className="font-arimo text-[14px] leading-[20px] text-[#FF6B35]">{userRating}</span>
                    </div>
                    {/* <div className="flex items-center">
                        {starRating({userRating})}
                        <span className="font-arimo text-[14px] leading-[20px] text-[#FF6B35] ml-[4px]">{userRating}</span>
                    </div> */}
                </div>
            </div>
            {/* Review Text */}
            <p className="font-arimo text-[16px] leading-[24px] text-[#717182] flex-grow">{ratingDescription}</p>
            {/* Dish Info */}
            <div className="flex justify-between items-center text-[12px] leading-[16px] text-[#828282]">
                <span className="mx-auto bg-[#ECEEF2] text-[#030213] rounded-[8px] py-[4px] px-[8px] text-[14px]">{dishType}</span>
                <span className="mx-auto text-[14px]">{time}</span>
            </div>
        </div>
    );
};

export default ReviewCard;