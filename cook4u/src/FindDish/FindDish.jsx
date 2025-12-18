import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
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
import axios from "axios";

// Component Sidebar Lọc
const FiltersSidebar = ({ filters, onFilterChange, onClearFilters }) => (
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
        <select 
          value={filters.cuisine}
          onChange={(e) => onFilterChange('cuisine', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="">Tất cả</option>
          <option value="Món Việt">Món Việt</option>
          <option value="Món Á">Món Á</option>
          <option value="Món Âu">Món Âu</option>
          <option value="Món Hàn">Món Hàn</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Giá cả (tối đa)
        </label>
        <input 
          type="range" 
          min="30000" 
          max="500000" 
          step="10000"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange('maxPrice', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>30,000 ₫</span>
          <span>{filters.maxPrice.toLocaleString()} ₫</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thời gian nấu
        </label>
        <select 
          value={filters.cookTime}
          onChange={(e) => onFilterChange('cookTime', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="">Bất kỳ</option>
          <option value="15">15 phút trở xuống</option>
          <option value="30">30 phút trở xuống</option>
          <option value="45">45 phút trở xuống</option>
          <option value="60">60+ phút</option>
        </select>
      </div>
      
      <button 
        onClick={onClearFilters}
        className="clear-filters-btn w-full border border-gray-300 rounded-lg py-3 font-medium hover:bg-gray-50"
      >
        Xóa lọc
      </button>
    </div>
  </aside>
);

// Component cho mỗi thẻ món ăn
const DishCard = ({ dish, navigate }) => {
  // Chuyển đổi dữ liệu từ API sang format component
  const formattedDish = {
    id: dish.DISHID,
    name: dish.DISHNAME,
    image: dish.PICTUREURL || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
    price: parseFloat(dish.PRICE).toLocaleString('vi-VN'),
    rating: 4.8, // Mặc định vì API chưa có rating
    reviews: 12, // Mặc định
    tags: ["Món Việt"], // Mặc định
    description: dish.SHORTDESCR || dish.DESCR,
    cookTime: dish.COOKTIME
  };

  return (
    <div 
      className="dish-card bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/home/dish/${dish.DISHID}`)}
    >
      <div className="dish-image-container relative h-48">
        <img 
          src={formattedDish.image} 
          alt={formattedDish.name} 
          className="dish-image w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop";
          }}
        />
        <div className="dish-price-tag absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full font-medium">
          {formattedDish.price} ₫
        </div>
      </div>
      <div className="dish-content p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{formattedDish.name}</h3>
        <div className="dish-rating flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-medium">{formattedDish.rating}</span>
          <span className="text-gray-500 text-sm">({formattedDish.reviews} đánh giá)</span>
        </div>
        <div className="dish-tags flex flex-wrap gap-2 mb-3">
          {formattedDish.tags.map((tag) => (
            <span key={tag} className="tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
        <p className="dish-description text-gray-600 mb-4 line-clamp-2">{formattedDish.description}</p>
        <div className="dish-details space-y-2 border-t border-gray-200 pt-4">
          <p className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            {formattedDish.cookTime}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const FindDishPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    cuisine: '',
    maxPrice: 200000,
    minRating: '0',
    cookTime: ''
  });
  const [sortBy, setSortBy] = useState('rating');
  const [dishesData, setDishesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAllDishes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/dishes');
      setDishesData(res.data.data);
    } catch (err) {
      console.error("Lỗi lấy all dish", err);
      setError('Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDishes();
  }, []);

  // Get search query from URL on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      cuisine: '',
      maxPrice: 200000,
      minRating: '0',
      cookTime: ''
    });
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/home/findadish?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate('/home/findadish');
      }
    }
  };

  // Filter and search dishes
  const filteredDishes = dishesData.filter(dish => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        dish.DISHNAME.toLowerCase().includes(query) ||
        (dish.SHORTDESCR && dish.SHORTDESCR.toLowerCase().includes(query)) ||
        (dish.DESCR && dish.DESCR.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Cuisine filter (giả sử dựa trên tên món ăn)
    if (filters.cuisine) {
      if (filters.cuisine === 'Món Việt') {
        if (!dish.DISHNAME.toLowerCase().includes('phở') && 
            !dish.DISHNAME.toLowerCase().includes('bún') &&
            !dish.DISHNAME.toLowerCase().includes('gỏi')) {
          return false;
        }
      }
      // Thêm các điều kiện cho các loại ẩm thực khác
    }

    // Price filter
    const dishPrice = parseFloat(dish.PRICE);
    if (dishPrice > filters.maxPrice) {
      return false;
    }

    // Cook time filter
    if (filters.cookTime) {
      const cookTimeNum = parseInt(dish.COOKTIME);
      const filterTime = parseInt(filters.cookTime);
      if (cookTimeNum > filterTime) {
        return false;
      }
    }

    // Chỉ hiển thị món ăn có status = 1
    return dish.DISHSTATUS === 1;
  });

  // Sort dishes
  const sortedDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'rating') {
      // Giả sử rating mặc định
      return 0;
    } else if (sortBy === 'price-low') {
      const priceA = parseFloat(a.PRICE);
      const priceB = parseFloat(b.PRICE);
      return priceA - priceB;
    } else if (sortBy === 'price-high') {
      const priceA = parseFloat(a.PRICE);
      const priceB = parseFloat(b.PRICE);
      return priceB - priceA;
    }
    return 0;
  });

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                placeholder="Tìm kiếm món ăn, phong cách ẩm thực..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Bộ lọc</span>
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <FiltersSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          <div className="col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {loading ? 'Đang tải...' : `${sortedDishes.length} món ăn sẵn có`}
              </h2>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
                disabled={loading}
              >
                <option value="rating">Đánh giá cao</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
              </select>
            </div>

            {loading ? (
              <div className="col-span-2 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải món ăn...</p>
              </div>
            ) : error ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-red-500 text-lg mb-2">{error}</p>
                <button 
                  onClick={getAllDishes}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Thử lại
                </button>
              </div>
            ) : sortedDishes.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {sortedDishes.map((dish) => (
                  <DishCard key={dish.DISHID} dish={dish} navigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy món ăn nào phù hợp</p>
                <button 
                  onClick={handleClearFilters}
                  className="mt-4 text-orange-600 hover:text-orange-700"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindDishPage;