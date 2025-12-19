import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useCart } from "../contexts/CartContext";
import axios from "axios";
import {
  ShoppingCart,
  Clock,
  Users,
  Star,
  MessageCircle,
  Loader,
} from "lucide-react";

const DishDetail = () => {
  const { dishId } = useParams();
  const navigate = useNavigate();
  const { addDish } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dish, setDish] = useState(null);

  // Lấy chi tiết món ăn từ API
  useEffect(() => {
    const getDishDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/dishes/${dishId}`
        );
        setDish(res.data.data);
        console.log("Fetch data: ", res.data.data);
      } catch (err) {
        console.error("Error fetching dish details:", err);
        setError("Không thể tải thông tin món ăn");
      } finally {
        setLoading(false);
      }
    };

    if (dishId) {
      getDishDetail();
    }
  }, [dishId]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    if (dish) {
      // Add dish multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addDish({
          id: dish.id,
          name: dish.name,
          price: parseFloat(dish.price),
          image:
            dish.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
          cookTime: dish.cookTime,
          servings: dish.servings,
          time: dish.cookTime,
          people: dish.servings,
        });
      }
      // Optionally navigate to cart
      navigate("/home/mycart");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin món ăn...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !dish) {
    return (
      <div className="pt-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy món ăn
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "Món ăn bạn đang tìm không tồn tại."}
          </p>
          <button
            onClick={() => navigate("/home/findadish")}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Quay lại tìm món ăn
          </button>
        </div>
      </div>
    );
  }

  // Format data từ API
  const formattedDish = {
    id: dish.id,
    name: dish.name,
    price: parseFloat(dish.price),
    rating: dish.rating,
    reviewsCount: dish.reviewsCount,
    servings: dish.servings,
    cookTime: dish.cookTime,
    // difficulty: "Bao gồm",
    category: dish.category,
    images: [
      dish.images ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
    ],
    description: dish.description,
    about: dish.about,
    ingredients: dish.ingredients,
    nutrition: dish.nutrition,
    reviews: dish.reviews,
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Phần ảnh - chiếm 8 cột trên desktop */}
          <div className="lg:col-span-8">
            <div>
              {/* Ảnh chính */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6 hover:shadow-md transition-shadow">
                <img
                  src={formattedDish.images[selectedImage]}
                  alt={formattedDish.name}
                  className="w-full h-[420px] lg:h-[560px] object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Ảnh phụ (thumbnails) */}
              <div className="flex gap-4">
                {formattedDish.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-3 transition-all ${
                      selectedImage === index
                        ? "border-orange-500 shadow-lg scale-105"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-36 h-24 object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mô tả món ăn */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 mt-8 hover:shadow-md transition-shadow">
              <h1 className="text-4xl font-bold mb-6">{formattedDish.name}</h1>

              <div className="flex flex-wrap gap-3 mb-6">
                {formattedDish.category.map((cat, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Thời gian</p>
                    <p className="font-semibold text-gray-900">
                      {formattedDish.cookTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phục vụ</p>
                    <p className="font-semibold text-gray-900">
                      {formattedDish.servings}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                    <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Đánh giá</p>
                    <p className="font-semibold text-gray-900">
                      {formattedDish.rating}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">
                {formattedDish.description}
              </p>
            </div>

            {/* Thông tin bổ sung */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-4">Về món ăn này</h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {formattedDish.about}
              </p>
            </div>

            {/* Nguyên liệu */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-6">Nguyên liệu</h2>
              <div className="space-y-4">
                {formattedDish.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-700 font-medium">
                      {ingredient.name}
                    </span>
                    <span className="text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full">
                      {ingredient.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Thông tin dinh dưỡng */}
            {/* Thông tin dinh dưỡng */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-6">Thông tin dinh dưỡng</h2>
              <div className="grid grid-cols-4 gap-6">
                {formattedDish.nutrition.map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-orange-50 rounded-xl"
                  >
                    <p className="text-2xl font-bold text-orange-500 mb-2">
                      {/* Chuyển amount về số nguyên nếu cần (ví dụ 800.00 -> 800) */}
                      {Math.round(item.amount)}
                      <span className="text-xl ml-1">{item.UNIT}</span>
                    </p>
                    <p className="text-gray-600 text-sm font-medium">
                      {/* Dịch tên nếu cần hoặc để item.name */}
                      {item.name === "Calories"
                        ? "Calo"
                        : item.name === "Fat"
                        ? "Chất béo"
                        : item.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Đánh giá */}
            {/* Đánh giá */}
            <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-6">Đánh giá món ăn</h2>

              {formattedDish.reviews && formattedDish.reviews.length > 0 ? (
                <div className="space-y-6">
                  {formattedDish.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start space-x-4">
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                            {review.initial}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {review.name}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {review.time}
                            </span>
                          </div>
                          <div className="flex mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-200 fill-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Hiển thị khi không có đánh giá */
                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="mb-3 flex justify-center">
                    <Star className="w-12 h-12 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    Chưa có đánh giá nào cho món ăn này.
                  </p>
                  <p className="text-gray-400">
                    Hãy là người đầu tiên trải nghiệm và chia sẻ cảm nhận của
                    bạn!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar đặt món - Desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm p-10 sticky top-28 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Đặt Món
              </h3>

              <div className="mb-8">
                <p className="text-4xl font-bold text-gray-900 mb-1 text-center">
                  {formattedDish.price.toLocaleString("vi-VN")} ₫
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Bao gồm nguyên liệu
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Thời gian nấu:</span>
                  <span className="font-semibold text-gray-900">
                    {formattedDish.cookTime}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Phục vụ:</span>
                  <span className="font-semibold text-gray-900">
                    {formattedDish.servings}
                  </span>
                </div>

                {/* <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Dọn dẹp:</span>
                  <span className="font-semibold text-gray-900">
                    {formattedDish.difficulty}
                  </span>
                </div> */}
              </div>

              <div className="mb-10">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={decreaseQuantity}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-orange-500 transition-all font-medium text-lg"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-orange-500 transition-all font-medium text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Thêm vào giỏ hàng</span>
              </button>
            </div>
          </div>

          {/* Sidebar đặt món - Mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl border-t border-gray-200 z-40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formattedDish.price.toLocaleString("vi-VN")} ₫
                </p>
                <p className="text-xs text-gray-500">Bao gồm nguyên liệu</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl flex items-center space-x-2 transition-all shadow-md"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Thêm vào giỏ hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetail;
