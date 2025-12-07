const ReviewCard = ({ avatarURL, userName, userRating, ratingDescription, dishType, time }) => {
    return (
        <div className="w-full bg-white border border-orange-400 rounded-xl p-7 hover:shadow-md transition-shadow min-h-[200px]">
            {/* User Info */}
            <div className="flex items-start mb-5">
                <img 
                    src={avatarURL} 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full border-2 border-orange-200 mr-5"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
                        <div className="flex items-center text-amber-500">
                            <span className="text-2xl font-bold mr-2">{userRating}</span>
                            <span className="text-lg">★</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Review Text */}
            <p className="text-gray-800 mb-6 leading-relaxed text-lg">
                {ratingDescription}
            </p>
            
            {/* Dish Info */}
            <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                <span className="bg-orange-100 text-orange-700 rounded-full px-4 py-2 text-base font-semibold">
                    {dishType}
                </span>
                <span className="text-gray-600 text-base">
                    {time}
                </span>
            </div>
        </div>
    );
};

export default ReviewCard;