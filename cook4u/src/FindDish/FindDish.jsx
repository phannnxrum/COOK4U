import React from "react";
import "./FindDish.css";
import HeaderClient from "../Client/HeaderClient";

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

// --- COMPONENTS ---

// Icon component
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Component Header
const AppHeader = () => (
  <header className="app-header">
    <div className="logo">
      <img src="/image/LogoCook4u.png" alt="Cook4U Logo" />
      <span>COOK4U</span>
    </div>
    <nav>
      <a href="#">Tìm đầu bếp</a>
      <a href="#" className="active">
        Tìm món ăn
      </a>
      <a href="#">Cách đặt hàng</a>
      <a href="#">Về chúng tôi</a>
    </nav>
    <div className="user-actions">
      <button className="orders-btn">
        <Icon
          path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          className="w-5 h-5"
        />
        Đơn hàng của tôi
      </button>
      <img
        src="https://images.unsplash.com/photo-1741121625227-8ab247bf9d22?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070"
        alt="User Avatar"
        className="user-avatar"
      />
    </div>
  </header>
);

// Component Sidebar Lọc
const FiltersSidebar = () => (
  <aside className="filters-sidebar">
    <h3>
      <Icon
        path="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 18H7.5M3.75 12h16.5m-16.5 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0"
        className="w-5 h-5"
      />
      Lọc
    </h3>
    <div className="filter-group">
      <label>Loại ẩm thực</label>
      <select>
        <option>Món Á</option>
      </select>
    </div>
    <div className="filter-group">
      <label>Giá cả</label>
      <input type="range" min="50000" max="5000000" defaultValue="2500000" />
      <div className="price-range">
        <span>VND 50,000</span>
        <span>VND 5,000,000</span>
      </div>
    </div>
    <div className="filter-group">
      <label>Đánh giá</label>
      <select>
        <option>Bất kỳ</option>
      </select>
    </div>
    <div className="filter-group">
      <label>Thời gian nấu</label>
      <select>
        <option>Bất kỳ</option>
        <option>30 phút</option>
        <option value="">45 phút</option>
        <option value="">60 phút</option>
        <option value="">hơn 60 phút</option>
      </select>
    </div>
    <div className="filter-group">
      <label>Địa điểm</label>
      <select>
        <option>Tất cả</option>
      </select>
    </div>
    <button className="clear-filters-btn">Xóa lọc</button>
  </aside>
);

// Component cho mỗi thẻ món ăn
const DishCard = ({ dish }) => (
  <div className="dish-card">
    <div className="dish-image-container">
      <img src={dish.image} alt={dish.name} className="dish-image" />
      <div className="dish-price-tag">VND {dish.price}</div>
    </div>
    <div className="dish-content">
      <h3>{dish.name}</h3>
      <div className="dish-rating">
        <span className="star">★</span> {dish.rating} ({dish.reviews} đánh giá)
      </div>
      <div className="dish-tags">
        {dish.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <p className="dish-description">{dish.description}</p>
      <div className="dish-details">
        <p>
          <Icon
            path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            className="w-4 h-4"
          />
          {dish.chef}
        </p>
        <p>
          <Icon
            path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            className="w-4 h-4"
          />
          {dish.cookTime}
        </p>
        <p>
          <Icon
            path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-2.162 1.98-4.223 3.741-5.626m-3.741 5.626A9.094 9.094 0 016 18.72m0-2.962c.57 2.162 1.98 4.223 3.741 5.626M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            className="w-4 h-4"
          />
          {dish.servings}
        </p>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const FindDishPage = () => {
  return (
    <div className="find-dish-page">
      {/* <AppHeader /> */}

      <HeaderClient /> 
      {/* Sử dụng header chung của Client */}

      <main className="container">
        <div className="search-header">
          <h1>Tìm món ăn</h1>
          <div className="tabs">
            <button className="tab-item">
              <Icon
                path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                className="w-5 h-5"
              />
              Đầu bếp
            </button>
            <button className="tab-item active">
              <Icon
                path="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                className="w-5 h-5"
              />
              Món ăn
            </button>
          </div>
        </div>

        <div className="search-bar">
          <Icon
            path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            className="w-5 h-5"
          />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn, phong cách ẩm thực hoặc tên đầu bếp..."
          />
          <button className="filter-btn">
            <Icon
              path="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              className="w-5 h-5"
            />
            Bộ lọc
          </button>
        </div>

        <div className="content-wrapper">
          <FiltersSidebar />
          <section className="dish-list-section">
            <div className="list-header">
              <h2>{dishesData.length} món ăn sẵn có</h2>
              <select className="sort-by">
                <option>Đánh giá cao</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
              </select>
            </div>
            <div className="dish-grid">
              {dishesData.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <button className="floating-action-button"></button>
    </div>
  );
};

export default FindDishPage;
