import MainTitle from "./commons/MainTitle";
import DishTypeCard from "./commons/DishTypeCard";
import { ChevronRight } from "lucide-react";

const FavoriteDishSection = () => {
    const dishes = [
        { 
            type: "Món Việt chuẩn gu", 
            image: "/image/DishType1.png", 
            number: 5,
            tag: "Ngon chuẩn vị"
        },
        { 
            type: "Món Âu bùng vị", 
            image: "/image/DishType2.png", 
            number: 3,
            tag: "Đậm đà"
        },
        { 
            type: "Món ăn healthy", 
            image: "/image/DishType3.png", 
            number: 4,
            tag: "Tốt cho sức khỏe"
        },
        { 
            type: "Tiệc tại gia", 
            image: "/image/DishType4.png", 
            number: 2,
            tag: "Tiện lợi"
        }
    ];

    return (
        <section className="w-full py-5 lg:py-8 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Title Section - đơn giản, rõ ràng */}
                <div className="text-center mb-12 lg:mb-16">
                    <MainTitle 
                        title="Món ăn được yêu thích"
                        subtitle="Khám phá hương vị tuyệt vời từ khắp nơi trên thế giới"
                    />
                </div>
                
                {/* Cards Grid - clean design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {dishes.map((dish, index) => (
                        <div 
                            key={index}
                            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Image container */}
                            <div className="relative h-52 md:h-56 overflow-hidden">
                                <img 
                                    src={dish.image} 
                                    alt={dish.type}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                
                                {/* Count badge - đơn giản */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                                    <span className="font-semibold text-gray-800">{dish.number} món</span>
                                </div>
                                
                                {/* Subtle overlay */}
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-5">
                                {/* Tag */}
                                <div className="mb-2">
                                    <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-100">
                                        {dish.tag}
                                    </span>
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                    {dish.type}
                                </h3>
                                
                                {/* View button */}
                                <div className="flex items-center text-amber-600 text-sm font-medium">
                                    <span>Xem tất cả</span>
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simple CTA */}
                <div className="text-center mt-12">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors duration-300">
                        <span>Xem tất cả món ăn</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    )
};

export default FavoriteDishSection;