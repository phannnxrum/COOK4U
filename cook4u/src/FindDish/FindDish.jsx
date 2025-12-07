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
          <option value="Món Á">Món Á</option>
          <option value="Món Việt">Món Việt</option>
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
          min="50000" 
          max="5000000" 
          step="50000"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange('maxPrice', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>VND 50,000</span>
          <span>VND {filters.maxPrice.toLocaleString()}</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đánh giá
        </label>
        <select 
          value={filters.minRating}
          onChange={(e) => onFilterChange('minRating', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="0">Bất kỳ</option>
          <option value="4.5">4.5+ ★</option>
          <option value="4.0">4.0+ ★</option>
        </select>
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
          <option value="30 phút">30 phút</option>
          <option value="45 phút">45 phút</option>
          <option value="60 phút">60 phút</option>
          <option value="hơn 60 phút">hơn 60 phút</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa điểm
        </label>
        <select 
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="">Tất cả</option>
          <option value="Quận 1">Quận 1</option>
          <option value="Quận 2">Quận 2</option>
          <option value="Quận 3">Quận 3</option>
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
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    cuisine: '',
    maxPrice: 2500000,
    minRating: '0',
    cookTime: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('rating');

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
      maxPrice: 2500000,
      minRating: '0',
      cookTime: '',
      location: ''
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
        dish.name.toLowerCase().includes(query) ||
        dish.tags.some(tag => tag.toLowerCase().includes(query)) ||
        dish.chef.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Cuisine filter
    if (filters.cuisine && !dish.tags.some(tag => tag.includes(filters.cuisine))) {
      return false;
    }

    // Price filter
    const dishPrice = parseInt(dish.price.replace(/,/g, ''));
    if (dishPrice > filters.maxPrice) {
      return false;
    }

    // Rating filter
    if (parseFloat(filters.minRating) > 0 && dish.rating < parseFloat(filters.minRating)) {
      return false;
    }

    // Cook time filter
    if (filters.cookTime && dish.cookTime !== filters.cookTime) {
      return false;
    }

    return true;
  });

  // Sort dishes
  const sortedDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'price-low') {
      const priceA = parseInt(a.price.replace(/,/g, ''));
      const priceB = parseInt(b.price.replace(/,/g, ''));
      return priceA - priceB;
    } else if (sortBy === 'price-high') {
      const priceA = parseInt(a.price.replace(/,/g, ''));
      const priceB = parseInt(b.price.replace(/,/g, ''));
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
                placeholder="Tìm kiếm món ăn, phong cách ẩm thực hoặc tên đầu bếp..."
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
                {sortedDishes.length} món ăn sẵn có
              </h2>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
              >
                <option value="rating">Đánh giá cao</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {sortedDishes.length > 0 ? (
                sortedDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} navigate={navigate} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500 text-lg">Không tìm thấy món ăn nào phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindDishPage;