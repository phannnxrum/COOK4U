import React from "react";
import {
  MapPin,
  Clock,
  ChefHat,
  DollarSign,
  Award,
  Calendar,
  Heart,
  Star,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router";

const ChefHeader = ({ chef }) => {
  const { addChef } = useCart();
  const navigate = useNavigate();

  const handleAddChefToCart = () => {
    if (chef) {
      addChef({
        id: chef.id,
        name: chef.name,
        price:
          typeof chef.price === "number"
            ? chef.price
            : parseInt(chef.price.replace(/,/g, "")),
        avatar: chef.avatar,
        rating: chef.rating,
        reviews: chef.reviewsList,
      });
      // Optionally navigate to cart
      navigate("/home/mycart");
    }
  };
  return (
    <div className="flex flex-row bg-white justify-center gap-10 py-5">
      {/* avatar */}
      <div>
        <img
          src={chef.avatar}
          alt=""
          className="rounded-full w-[25vw] max-w-[120px] min-w-[60px] aspect-square object-cover"
        />
        <div className="md:hidden flex flex-col gap-5 mt-5">
          <div className="flex flex-row gap-2">
            <Clock className="text-orange-400"></Clock>
            <p>{chef.cookTime}</p>
          </div>
          <div className="flex flex-row gap-2">
            <ChefHat className="text-orange-400"></ChefHat>
            <p> {chef.yearNum} năm</p>
          </div>
          <div className="flex flex-row gap-2">
            <DollarSign className="text-orange-400"></DollarSign>
            <p> VNĐ {chef.price}/tiếng</p>
          </div>
          <div className="flex flex-row gap-2">
            <Award className="text-orange-400"></Award>
            <p> {chef.valid}</p>
          </div>
        </div>
      </div>

      {/* thông tin */}
      <div className="basis-1/4 md:basis-1/2 flex flex-col gap-3">
        <p className="text-2xl md:text-3xl font-light">{chef.name}</p>

        <div className="flex flex-row gap-3">
          <div className="flex flex-col md:flex-row gap-1 text-sm md:text-base">
            <p>⭐ {chef.rating}</p>
            <span className="text-gray-500">({chef.reviews} đánh giá)</span>
          </div>
          <div className="flex flex-row gap-1 text-gray-500 text-sm md:text-base">
            <MapPin className="size-5"></MapPin>
            <p>{chef.district}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Thêm dấu ? sau cuisine */}
          {chef?.cuisine?.map((item, index) => (
            <span key={index} className="bg-gray-200 px-4 rounded-full ">
              {item}
            </span>
          ))}
        </div>

        <p className="text-gray-500">{chef.experience}</p>

        <div className="hidden md:flex flex-col md:flex-row justify-between text-md ">
          <div className="flex flex-row gap-2">
            <Clock className="text-orange-400"></Clock>
            <p>{chef.cookTime}</p>
          </div>
          <div className="flex flex-row gap-2">
            <ChefHat className="text-orange-400"></ChefHat>
            <p> {chef.yearNum} năm</p>
          </div>
          <div className="flex flex-row gap-2">
            <DollarSign className="text-orange-400"></DollarSign>
            <p> VNĐ {chef.price}/tiếng</p>
          </div>
          <div className="flex flex-row gap-2">
            <Award className="text-orange-400"></Award>
            <p> {chef.valid}</p>
          </div>
        </div>
      </div>

      {/* đặt nhanh  */}
      <div className="basis-1/3 md:basis-1/4 border border-gray-300 rounded-xl max-h-53 md:max-h-100 p-5 flex flex-col gap-5">
        <p>Đặt nhanh</p>
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col items-center">
            <p className="text-xl md:text-2xl">VNĐ {chef.price}</p>
            <p>1 tiếng</p>
          </div>

          <div className="flex flex-row md:flex-col items-center gap-2">
            <button
              onClick={handleAddChefToCart}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white px-2 py-2 rounded-lg transition-all duration-200 
                      whitespace-nowrap max-w-fit md:px-20 md:py-2 hover:-translate-y-1 hover:shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden md:inline">Chọn đầu bếp này</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-orange-500 px-2 py-2 rounded-lg transition-all duration-200 
                      whitespace-nowrap max-w-fit md:px-20 md:py-2 hover:-translate-y-1 hover:shadow-lg"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden md:inline">Lưu vào yêu thích</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefHeader;
