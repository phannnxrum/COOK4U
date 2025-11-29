import React from "react";
import { useNavigate } from "react-router";
import "./FindChef.css";
import HeaderClient from "../Client/HeaderClient";

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
      <a href="#" className="active">
        Tìm đầu bếp
      </a>
      <a href="#">Tìm món ăn</a>
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
        <option>Tất cả</option>
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

// Component cho mỗi thẻ thông tin đầu bếp
const ChefCard = ({ chef }) => (
  <div className="chef-card" onClick={() => window.location.href = '/pickchef/' + chef.id}>
    <div className="chef-card-header">
      <img src={chef.avatar} alt={chef.name} className="chef-avatar" />
      <div className="chef-info">
        <h3>{chef.name}</h3>
        <div className="chef-rating">
          <span className="star">★</span> {chef.rating} ({chef.reviews} đánh
          giá)
        </div>
      </div>
    </div>
    <div className="chef-details">
      <p>{chef.cuisine}</p>
      <p>
        <Icon path="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
        <Icon
          path="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          className="w-4 h-4"
        />
        {chef.district}
      </p>
      <p>
        <Icon
          path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          className="w-4 h-4"
        />
        {chef.cookTime}
      </p>
      <p>
        <Icon
          path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m16.5 3.375V18a1.125 1.125 0 01-1.125 1.125h-12.75A1.125 1.125 0 013.75 18v-9.375m16.5 3.375c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v1.5z"
          className="w-4 h-4"
        />
        VND {chef.price}/tiếng
      </p>
    </div>
    <div className="chef-tags">
      {chef.tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const FindChefPage = () => {
  const navigate = useNavigate();

  return (
    <div className="find-chef-page">
      {/* <AppHeader /> */}

      <HeaderClient /> 
      {/* Sử dụng header chung của Client */}

      <main className="container">
        <div className="search-header">
          <h1>Tìm đầu bếp phù hợp</h1>
          <div className="tabs">
            <button
              className="tab-item active"
              onClick={() => navigate("/findachef")}
            >
              <Icon
                path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                className="w-5 h-5"
              />
              Đầu bếp
            </button>
            <button
              className="tab-item"
              onClick={() => navigate("/findadish")}
            >
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
          <section className="chef-list-section">
            <div className="list-header">
              <h2>6 đầu bếp sẵn có</h2>
              <select className="sort-by">
                <option>Đánh giá cao</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
              </select>
            </div>
            <div className="chef-grid">
              {chefsData.map((chef) => (
                <ChefCard key={chef.id} chef={chef} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <button className="floating-action-button"></button>
    </div>
  );
};

export default FindChefPage;
