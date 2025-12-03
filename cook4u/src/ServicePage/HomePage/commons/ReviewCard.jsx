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
        <div className="w-full max-w-[288px] h-auto min-h-[200px] md:h-[220px] lg:h-[224px] p-3 md:p-4 lg:p-[16px] border border-[#E0E0E0] rounded-lg lg:rounded-[8px] flex flex-col">
            {/* User Info */}
            <div className="flex items-center mb-2 md:mb-3 lg:mb-[12px]">
                <img src={avatarURL} alt="Avatar" className="w-8 h-8 md:w-9 md:h-9 lg:w-[40px] lg:h-[40px] rounded-full mr-2 md:mr-3 lg:mr-[12px]" />
                <div>
                    <p className="font-arimo font-bold text-sm md:text-base lg:text-[16px] leading-5 md:leading-6 lg:leading-[24px] text-[#333333]">{userName}</p>
                    <div className="flex items-center">
                        <img src="/icons/Star.svg" alt="Star" className="w-4 h-4 md:w-5 md:h-5 lg:w-[16px] lg:h-[16px] mr-1 md:mr-2 lg:mr-[4px]" />
                        <span className="font-arimo text-xs md:text-sm lg:text-[14px] leading-4 md:leading-5 lg:leading-[20px] text-[#FF6B35]">{userRating}</span>
                    </div>
                    {/* <div className="flex items-center">
                        {starRating({userRating})}
                        <span className="font-arimo text-[14px] leading-[20px] text-[#FF6B35] ml-[4px]">{userRating}</span>
                    </div> */}
                </div>
            </div>
            {/* Review Text */}
            <p className="font-arimo text-sm md:text-base lg:text-[16px] leading-5 md:leading-6 lg:leading-[24px] text-[#717182] flex-grow mb-2 md:mb-3">{ratingDescription}</p>
            {/* Dish Info */}
            <div className="flex justify-between items-center gap-2 text-xs md:text-sm lg:text-[12px] leading-4 md:leading-5 lg:leading-[16px] text-[#828282]">
                <span className="bg-[#ECEEF2] text-[#030213] rounded-lg lg:rounded-[8px] py-1 md:py-1.5 lg:py-[4px] px-2 md:px-3 lg:px-[8px] text-xs md:text-sm lg:text-[14px]">{dishType}</span>
                <span className="text-xs md:text-sm lg:text-[14px]">{time}</span>
            </div>
        </div>
    );
};

export default ReviewCard;