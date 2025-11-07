import MainTitle from "./commons/MainTitle";
import DishTypeCard from "./commons/DishTypeCard";

const FavoriteDishSection = () => {
    return (
        <section className="w-full min-h-auto md:h-auto lg:h-[458px] mt-12 md:mt-16 lg:mt-[96px] mx-auto gap-6 md:gap-8 lg:gap-[48px] flex flex-col items-center justify-center px-4 md:px-6 lg:px-0">
            {/*Title*/}
            <MainTitle 
                title="Món ăn được yêu thích"
                subtitle="Khám phá hương vị tuyệt vời từ khắp nơi trên thế giới"
            />
            {/*Dish Type Cards, update later*/}
            <div className="w-full max-w-[1248px] h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-[24px]">
                <DishTypeCard 
                    dishType="Món Việt chuẩn gu"
                    imageUrl="/image/DishType1.png"
                    number={5}
                />
                <DishTypeCard 
                    dishType="Món Âu bùng vị"
                    imageUrl="/image/DishType2.png"
                    number={3}
                />
                <DishTypeCard 
                    dishType="Món ăn healthy"
                    imageUrl="/image/DishType3.png"
                    number={4}
                />
                <DishTypeCard 
                    dishType="Tiệc tại gia"
                    imageUrl="/image/DishType4.png"
                    number={2}
                />
            </div>
        </section>
    )
};

export default FavoriteDishSection;