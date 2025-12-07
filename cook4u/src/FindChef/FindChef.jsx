import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  ChevronRight,
  Users,
  UtensilsCrossed,
  Thermometer,
  Cloud
} from "lucide-react";

// Dự án thật lấy từ API
const chefsData = [
  {
    id: 1,
    name: "Đầu bếp Tony",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 4.9,
    reviews: 42,
    cuisine: "Món Âu",
    district: "Q1, HCM",
    cookTime: "2-3 tiếng",
    price: "100,000",
    tags: ["Pasta", "Pizza", "Risotto"],
  },
  {
    id: 2,
    name: "Đầu bếp Linh Nguyễn",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4.8,
    reviews: 25,
    cuisine: "Món Việt, Món Á",
    district: "Q10, HCM",
    cookTime: "1.5-2 tiếng",
    price: "45,000",
    tags: ["Phở", "Bánh mì", "Gỏi cuốn"],
  },
  {
    id: 3,
    name: "Đầu bếp Fuji Kamato",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4.7,
    reviews: 20,
    cuisine: "Healthy, Đồ chay",
    district: "Q2, HCM",
    cookTime: "1-2 tiếng",
    price: "40,000",
    tags: ["Salads", "Sinh tố trái cây", "Ngũ cốc"],
  },
  {
    id: 4,
    name: "Đầu bếp Miami",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 4.9,
    reviews: 5,
    cuisine: "Món Hàn, Món Á",
    district: "Q4, HCM",
    cookTime: "2-3 tiếng",
    price: "55,000",
    tags: ["BBQ", "Kimchi", "Bibimbap"],
  },
  {
    id: 5,
    name: "Đầu bếp Louis",
    avatar: "https://i.pravatar.cc/150?img=6",
    rating: 4.8,
    reviews: 7,
    cuisine: "Món Pháp, Món Âu",
    district: "Q7, HCM",
    cookTime: "2-3 tiếng",
    price: "150,000",
    tags: ["Coq au Vin", "Croissants", "Soufflé"],
  },
  {
    id: 6,
    name: "Đầu bếp Phong",
    avatar: "https://i.pravatar.cc/150?img=7",
    rating: 4.6,
    reviews: 9,
    cuisine: "Mexican, Latin",
    district: "Q9, HCM",
    cookTime: "2-3 tiếng",
    price: "120,000",
    tags: ["Tacos", "Mole", "Ceviche"],
  },
];

// Component Sidebar Lọc
const FiltersSidebar = ({ filters, onFilterChange }) => (
  <aside className="filters-sidebar bg-white rounded-xl border border-orange-300 p-5 h-fit">
    <div className="flex items-center gap-2 mb-6">
      <Filter className="w-5 h-5 text-gray-600" />
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
          <option value="Món Âu">Món Âu</option>
          <option value="Món Á">Món Á</option>
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
          <option value="1-2 tiếng">1-2 tiếng</option>
          <option value="2-3 tiếng">2-3 tiếng</option>
        </select>
      </div>
    </div>
  </aside>
);

// Component cho mỗi thẻ thông tin đầu bếp
const ChefCard = ({ chef }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/home/pickchef/${chef.id}`);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="bg-orange-50 rounded-xl border border-gray-300 p-5 hover:shadow-xl hover:border-orange-300 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-4">
        <img 
          src={chef.avatar} 
          alt={chef.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-orange-100"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{chef.name}</h3>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="ml-1 font-medium text-gray-900">{chef.rating}</span>
            </div>
            <span className="text-gray-500 text-sm">({chef.reviews} đánh giá)</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <UtensilsCrossed className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{chef.cuisine}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{chef.district}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{chef.cookTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">VND {chef.price}/tiếng</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {chef.tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const FindChefPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    cuisine: '',
    maxPrice: 2500000,
    minRating: '0',
    cookTime: ''
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

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/home/findachef?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate('/home/findachef');
      }
    }
  };

  // Filter and search chefs
  const filteredChefs = chefsData.filter(chef => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        chef.name.toLowerCase().includes(query) ||
        chef.cuisine.toLowerCase().includes(query) ||
        chef.tags.some(tag => tag.toLowerCase().includes(query)) ||
        chef.district.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Cuisine filter
    if (filters.cuisine && !chef.cuisine.includes(filters.cuisine)) {
      return false;
    }

    // Price filter
    const chefPrice = parseInt(chef.price.replace(/,/g, ''));
    if (chefPrice > filters.maxPrice) {
      return false;
    }

    // Rating filter
    if (parseFloat(filters.minRating) > 0 && chef.rating < parseFloat(filters.minRating)) {
      return false;
    }

    // Cook time filter
    if (filters.cookTime && chef.cookTime !== filters.cookTime) {
      return false;
    }

    return true;
  });

  // Sort chefs
  const sortedChefs = [...filteredChefs].sort((a, b) => {
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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Logo và Title */}
        <div className=" mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tìm đầu bếp phù hợp</h1>
        </div>
        
        {/* Tabs và Search */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => navigate("/home/findachef")}
              className="flex items-center gap-2 px-6 py-3 border-b-2 border-orange-500 text-orange-500 font-medium"
            >
              <Users className="w-5 h-5" />
              Đầu bếp
            </button>
            <button
              onClick={() => navigate("/home/findadish")}
              className="flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-gray-700 font-medium"
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
          {/* Filters sidebar */}
          <div className="col-span-1">
            <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>
          
          {/* Chef list */}
          <div className="col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {sortedChefs.length} đầu bếp sẵn có
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
              {sortedChefs.length > 0 ? (
                sortedChefs.map((chef) => (
                  <ChefCard key={chef.id} chef={chef} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500 text-lg">Không tìm thấy đầu bếp nào phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindChefPage;