import React from "react";
import { useNavigate } from "react-router";
import { 
  Search, 
  Filter, 
  User, 
  Clock, 
  Users,
  Star,
  Funnel,
  UtensilsCrossed,
  Thermometer,
  Cloud
} from "lucide-react";

// Lấy từ API
const dishesData = [
  {
    id: 1,
    name: "Phở bò truyền thống Việt",
    image:
      "https://images.unsplash.com/photo-1631709497146-a239ef373cf1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670",
    price: "200,000",
    rating: 4.8,
    reviews: 48,
    tags: ["Món Việt", "Món Á"],
    description:
      "Nước dùng thịt bò đậm đà với bún gạo, rau thơm và thịt bò mềm.",
    chef: "Đầu bếp Linh Nguyen",
    cookTime: "4 tiếng",
    servings: "4-5 người",
  },
  {
    id: 2,
    name: "Tiệc BBQ Hàn Quốc",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
    price: "1,200,000",
    rating: 4.9,
    reviews: 3,
    tags: ["Món Hàn", "Món Á"],
    description: "Trải nghiệm BBQ Hàn Quốc trọn vẹn với banchan và thịt nướng.",
    chef: "Đầu bếp Fuji",
    cookTime: "3.5 tiếng",
    servings: "6-8 người",
  },
];

// Component Sidebar Lọc
const FiltersSidebar = () => (
  <aside className="filters-sidebar bg-white rounded-xl border border-gray-200 p-5 h-fit">
    <div className="flex items-center gap-2 mb-6">
      <Funnel className="w-5 h-5 text-gray-600" />
      <h3 className="text-lg font-semibold text-gray-900">Lọc</h3>
    </div>
    
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loại ẩm thực
        </label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
          <option>Món Á</option>
          <option>Món Việt</option>
          <option>Món Âu</option>
          <option>Món Hàn</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Giá cả
        </label>
        <input 
          type="range" 
          min="50000" 
          max="5000000" 
          defaultValue="2500000"
          className="w-full h-2 bg-gray-200 rounded-lg"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>VND 50,000</span>
          <span>VND 5,000,000</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đánh giá
        </label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
          <option>Bất kỳ</option>
          <option>4.5+ ★</option>
          <option>4.0+ ★</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thời gian nấu
        </label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
          <option>Bất kỳ</option>
          <option>30 phút</option>
          <option>45 phút</option>
          <option>60 phút</option>
          <option>hơn 60 phút</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa điểm
        </label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
          <option>Tất cả</option>
          <option>Quận 1</option>
          <option>Quận 2</option>
          <option>Quận 3</option>
        </select>
      </div>
      
      <button className="clear-filters-btn w-full border border-gray-300 rounded-lg py-3 font-medium hover:bg-gray-50">
        Xóa lọc
      </button>
    </div>
  </aside>
);

// Component cho mỗi thẻ món ăn
const DishCard = ({ dish, navigate }) => (
  <div 
    className="dish-card bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 cursor-pointer"
    onClick={() => navigate(`/home/dish/${dish.id}`)}
  >
    <div className="dish-image-container relative h-48">
      <img 
        src={dish.image} 
        alt={dish.name} 
        className="dish-image w-full h-full object-cover"
      />
      <div className="dish-price-tag absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full font-medium">
        VND {dish.price}
      </div>
    </div>
    <div className="dish-content p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{dish.name}</h3>
      <div className="dish-rating flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="font-medium">{dish.rating}</span>
        <span className="text-gray-500 text-sm">({dish.reviews} đánh giá)</span>
      </div>
      <div className="dish-tags flex flex-wrap gap-2 mb-3">
        {dish.tags.map((tag) => (
          <span key={tag} className="tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
      <p className="dish-description text-gray-600 mb-4">{dish.description}</p>
      <div className="dish-details space-y-2 pt-4 border-t border-gray-200">
        <p className="flex items-center gap-2 text-gray-700">
          <User className="w-4 h-4 text-gray-400" />
          {dish.chef}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          {dish.cookTime}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <Users className="w-4 h-4 text-gray-400" />
          {dish.servings}
        </p>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const FindDishPage = () => {
  const navigate = useNavigate();

  return (
    <div className="find-dish-page min-h-screen bg-gray-50">
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Logo và Title */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tìm món ăn</h1>
        </div>
        
        {/* Tabs và Search */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => navigate("/home/findachef")}
              className="flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-gray-700 font-medium"
            >
              <User className="w-5 h-5" />
              Đầu bếp
            </button>
            <button
              onClick={() => navigate("/home/findadish")}
              className="flex items-center gap-2 px-6 py-3 border-b-2 border-orange-500 text-orange-500 font-medium"
            >
              <UtensilsCrossed className="w-5 h-5" />
              Món ăn
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm món ăn, phong cách ẩm thực hoặc tên đầu bếp..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Bộ lọc</span>
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <FiltersSidebar />
          </div>
          
          <div className="col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">6 đầu bếp sẵn có</h2>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                <option>Đánh giá cao</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {dishesData.map((dish) => (
                <DishCard key={dish.id} dish={dish} navigate={navigate} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindDishPage;