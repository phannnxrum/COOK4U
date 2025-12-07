import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import HeaderClient from '../Client/HeaderClient';
import { ShoppingCart, Clock, Users, Star, MessageCircle } from 'lucide-react';

const dishesData = [
  {
    id: 1,
    name: "Phở bò truyền thống Việt",
    price: 200000,
    rating: 4.8,
    reviewsCount: 48,
    servings: 4,
    cookTime: 240,
    difficulty: "Bao gồm",
    category: ["Món Việt", "Món Á"],
    images: [
      'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'
    ],
    description: "Nước dùng thịt bò đậm đà với bún gạo, rau thơm và thịt bò mềm.",
    about: "Món phở bò truyền thống được nấu theo công thức gia truyền.",
    ingredients: [
      { name: "Bún gạo", amount: "400g" },
      { name: "Thịt bò", amount: "300g" },
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
        comment: "Món Phở ngon quá đi"
      },
      {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        rating: 5,
        time: "1 tuần trước",
        comment: "Chuẩn vị và ngon tuyệt!"
      }
    ]
  },
  {
    id: 2,
    name: "Tiệc BBQ Hàn Quốc",
    price: 1200000,
    rating: 4.9,
    reviewsCount: 3,
    servings: 6,
    cookTime: 210,
    difficulty: "Bao gồm",
    category: ["Món Hàn", "Món Á"],
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop"
    ],
    description: "Trải nghiệm BBQ Hàn Quốc trọn vẹn với banchan và thịt nướng.",
    about: "Bữa tiệc BBQ đầy đủ với các món banchan truyền thống...",
    ingredients: [
      { name: "Thịt ba chỉ", amount: "500g" },
      { name: "Kimchi", amount: "200g" }
    ],
    nutrition: {
      calories: 650,
      protein: 35,
      carbs: 30,
      fat: 40
    },
    reviews: [
      {
        name: "Trần Thị B",
        initial: "T",
        rating: 5,
        time: "1 tuần trước",
        comment: "Chuẩn vị Hàn Quốc!"
      }
    ]
  }
];

const DishDetail = () => {
  const { dishId } = useParams();
  const navigate = useNavigate();
  const { addDish } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  // Tìm món ăn theo ID
  const dish = dishesData.find(d => d.id === parseInt(dishId));

  // Xử lý scroll cho header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Nếu không tìm thấy món ăn
  if (!dish) {
    return (
      <div className='pt-20 bg-gray-50 min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Không tìm thấy món ăn</h1>
          <p className='text-gray-600'>Món ăn bạn đang tìm không tồn tại.</p>
        </div>
      </div>
    );
  }

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    if (dish) {
      // Add dish multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addDish({
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image: dish.images[0],
          cookTime: `${dish.cookTime} phút`,
          servings: `${dish.servings} người`,
          time: `${dish.cookTime} phút`,
          people: `${dish.servings} người`
        });
      }
      // Optionally navigate to cart
      navigate('/home/mycart');
    }
  };

  return (
    <>
      
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

                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
                >
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
                <button 
                  onClick={handleAddToCart}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl flex items-center space-x-2 transition-all shadow-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Đặt Ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DishDetail;