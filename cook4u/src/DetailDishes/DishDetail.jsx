import React, { useState, useEffect } from 'react';
import HeaderClient from '../Client/HeaderClient';
import { ShoppingCart, Clock, Users, Star, MessageCircle } from 'lucide-react';

const DishDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  // Xử lý scroll cho header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dữ liệu món ăn mẫu
  const dish = {
    name: "Homemade Pasta Carbonara",
    price: 950000,
    rating: 4.5,
    servings: 4,
    cookTime: 45,
    difficulty: "Bao gồm",
    category: ["Món Ý", "Món Âu", "Gluten-free"],
    images: [
      'https://images.unsplash.com/photo-1739417083034-4e9118f487be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGFzdGElMjBkaXNofGVufDF8fHx8MTc1OTI3OTMwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'
    ],
    description: "Mì carbonara La Mã chính thống với trứng tươi, phô mai pecorino và pancetta. Món ăn Ý cổ điển này được chế biến theo phương pháp truyền thống được truyền qua nhiều thế hệ.",
    about: "Trải nghiệm hương vị dịch thực của Rome với món Carbonara đặc trưng của chúng tôi. Được làm từ trứng tươi ngon từ nông trại, phô mai Pecorino Romano lâu năm và thật pancetta giòn tan, món ăn này đại diện cho đỉnh cao của ẩm thực Ý. Dầu bếp của chúng tôi chỉ sử dụng những nguyên liệu nhập khẩu hảo hạng nhất và kỹ thuật truyền thống La Mã để tạo nên loại nước sốt mịn màng, kèo ngậy mà không cần kem - chỉ có trứng, phô mai và nước sốt mì ống tận tâm ký.",
    ingredients: [
      { name: "Mì ống tươi (Spaghetti hoặc Linguine)", amount: "400g" },
      { name: "Trứng gà thả vườn lớn", amount: "4 quả" },
      { name: "Phô mai Pecorino Romano", amount: "100g, tươi, mới xay" },
      { name: "Pancetta hoặc Guanciale", amount: "150g, thái lưu" },
      { name: "Tiêu đen", amount: "Mới xay" },
      { name: "Muối", amount: "Tự nêm" }
    ],
    nutrition: {
      calories: 485,
      protein: 22,
      carbs: 45,
      fat: 24
    },
    reviews: [
      {
        name: "Sarah Johnson",
        initial: "S",
        rating: 5,
        time: "2 ngày trước",
        comment: "Đây là món carbonara ngon nhất mà tôi từng ăn! Kỹ thuật của Tony thật hoàn hảo và hương vị thì tuyệt vời."
      },
      {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        rating: 5,
        time: "1 tuần trước",
        comment: "Chuẩn vị và ngon tuyệt!"
      }
    ]
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <HeaderClient />
      </div>
      
      <div className='pt-20 bg-gray-50 min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
            {/* Phần ảnh - chiếm 8 cột trên desktop */}
            <div className='lg:col-span-8'>
              <div>
                {/* Ảnh chính - làm rộng/đầy hơn trên desktop */}
                <div className='bg-white rounded-2xl overflow-hidden shadow-sm mb-6 hover:shadow-md transition-shadow'>
                  <img src={dish.images[selectedImage]} alt={dish.name} className='w-full h-[420px] lg:h-[560px] object-cover' />
                </div>

                {/* Ảnh phụ (thumbnails) */}
                <div className='flex gap-4'>
                  {dish.images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-3 transition-all ${
                        selectedImage === index 
                          ? 'border-orange-500 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-orange-300'
                      }`}>
                      <img src={img} alt="" className="w-36 h-24 object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mô tả món ăn */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 mt-8 hover:shadow-md transition-shadow">
                <h1 className='text-4xl font-bold mb-6'>{dish.name}</h1>

                <div className='flex flex-wrap gap-3 mb-6'>
                  {dish.category.map((cat, index) => (
                    <span key={index} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium">
                      {cat}
                    </span>
                  ))}
                </div>

                <div className='grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-100'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center'>
                      <Clock className='w-6 h-6 text-orange-500' />
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Thời gian</p>
                      <p className='font-semibold text-gray-900'>{dish.cookTime} phút</p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center'>
                      <Users className='w-6 h-6 text-orange-500' />
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Phục vụ</p>
                      <p className='font-semibold text-gray-900'>{dish.servings} người</p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center'>
                      <Star className='w-6 h-6 text-orange-500 fill-orange-500' />
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Đánh giá</p>
                      <p className='font-semibold text-gray-900'>{dish.rating}</p>
                    </div>
                  </div>
                </div>
                <p className='text-gray-600 leading-relaxed text-base'>{dish.description}</p>
              </div>

              {/* Thông tin bổ sung */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 hover:shadow-md transition-shadow">
                <h2 className='text-2xl font-bold mb-4'>Về món ăn này</h2>
                <p className='text-gray-600 leading-relaxed text-base'>{dish.about}</p>
              </div>

              {/* Nguyên liệu */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 hover:shadow-md transition-shadow">
                <h2 className='text-2xl font-bold mb-6'>Nguyên liệu</h2>
                <div className='space-y-4'>
                  {dish.ingredients.map((ingredient, index) => (
                    <div key={index} className='flex justify-between items-center py-3 border-b border-gray-100 last:border-0'>
                      <span className='text-gray-700 font-medium'>{ingredient.name}</span>
                      <span className='text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full'>{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thông tin dinh dưỡng */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 hover:shadow-md transition-shadow">
                <h2 className='text-2xl font-bold mb-6'>Thông tin dinh dưỡng</h2>
                <div className='grid grid-cols-4 gap-6'>
                  <div className='text-center p-4 bg-orange-50 rounded-xl'>
                    <p className='text-4xl font-bold text-orange-500 mb-2'>{dish.nutrition.calories}</p>
                    <p className='text-gray-600 text-sm font-medium'>Calo</p>
                  </div>
                  <div className='text-center p-4 bg-orange-50 rounded-xl'>
                    <p className='text-4xl font-bold text-orange-500 mb-2'>{dish.nutrition.protein}g</p>
                    <p className='text-gray-600 text-sm font-medium'>Protein</p>
                  </div>
                  <div className='text-center p-4 bg-orange-50 rounded-xl'>
                    <p className='text-4xl font-bold text-orange-500 mb-2'>{dish.nutrition.carbs}g</p>
                    <p className='text-gray-600 text-sm font-medium'>Carbs</p>
                  </div>
                  <div className='text-center p-4 bg-orange-50 rounded-xl'>
                    <p className='text-4xl font-bold text-orange-500 mb-2'>{dish.nutrition.fat}g</p>
                    <p className='text-gray-600 text-sm font-medium'>Chất béo</p>
                  </div>
                </div>
              </div>

              {/* Đánh giá */}
              <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <h2 className='text-2xl font-bold mb-6'>Đánh giá món ăn</h2>
                <div className='space-y-6'>
                  {dish.reviews.map((review, index) => (
                    <div key={index} className='border-b border-gray-100 pb-6 last:border-0 last:pb-0'>
                      <div className='flex items-start space-x-4'>
                        {review.avatar ? (
                          <img src={review.avatar} alt={review.name} className='w-12 h-12 rounded-full' />
                        ) : (
                          <div className='w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg'>
                            {review.initial}
                          </div>
                        )}
                        <div className='flex-1'>
                          <div className='flex items-center justify-between mb-2'>
                            <h3 className='font-semibold text-gray-900'>{review.name}</h3>
                            <span className='text-sm text-gray-500'>{review.time}</span>
                          </div>
                          <div className='flex mb-3'>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                            ))}
                          </div>
                          <p className='text-gray-600 leading-relaxed'>{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar đặt món - Desktop (moved outside image column so it's separated) */}
            <div className='hidden lg:block lg:col-span-4'>
              <div className="bg-white rounded-2xl shadow-sm p-10 sticky top-28 hover:shadow-lg transition-shadow">
                <h3 className='text-sm font-medium text-gray-500 mb-2'>Đặt Món</h3>
                
                <div className='mb-8'>
                  <p className='text-4xl font-bold text-gray-900 mb-1 text-center'>
                    VNĐ {dish.price.toLocaleString()}
                  </p>
                  <p className='text-sm text-gray-500 text-center'>Bao gồm nguyên liệu</p>
                </div>

                <div className='space-y-6 mb-8'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600 text-sm'>Thời gian nấu:</span>
                    <span className='font-semibold text-gray-900'>{dish.cookTime} phút</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Phục vụ:</span>
                    <span className="font-semibold text-gray-900">{dish.servings} người</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Dọn dẹp:</span>
                    <span className="font-semibold text-gray-900">{dish.difficulty}</span>
                  </div>
                </div>

                <div className="mb-10">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={decreaseQuantity}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-orange-500 transition-all font-medium text-lg"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-orange-500 transition-all font-medium text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Đặt Ngay</span>
                </button>
              </div>
            </div>

            {/* Sidebar đặt món - Mobile */}
            <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl border-t border-gray-200 z-40'>
              <div className='flex items-center justify-between mb-3'>
                <div>
                  <p className='text-2xl font-bold text-gray-900'>VNĐ {dish.price.toLocaleString()}</p>
                  <p className='text-xs text-gray-500'>Bao gồm nguyên liệu</p>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl flex items-center space-x-2 transition-all shadow-md">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Đặt Ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => {/*Mở chat AI */ }}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 z-50"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </>
  );
};

export default DishDetail;