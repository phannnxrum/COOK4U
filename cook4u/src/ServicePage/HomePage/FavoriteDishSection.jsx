import MainTitle from "./commons/MainTitle";
import DishTypeCard from "./commons/DishTypeCard";

const FavoriteDishSection = () => {
    return (
        <section className="w-full h-[458px] mt-[96px] mx-auto gap-[48px] flex flex-col items-center justify-center">
            {/*Title*/}
            <MainTitle 
                title="Món ăn được yêu thích"
                subtitle="Khám phá hương vị tuyệt vời từ khắp nơi trên thế giới"
            />
            {/*Dish Type Cards, update later*/}
            <div className="w-[1248px] h-[200px] grid grid-cols-4 gap-[24px]">
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