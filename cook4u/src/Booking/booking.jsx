import React, { useState } from "react";

//  Import Lịch
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Booking.css";

//  Dữ liệu giả lập
const mockChef = {
  name: "Đầu bếp Jack Vĩnh Long",
  rating: 4.9,
  specialty: "singer",
  avatar:
    "https://images2.thanhnien.vn/528068263637045248/2023/3/21/jack-1679396385964143355875.jpeg",
  price: 85,
};

const initialCart = [
  {
    id: 1,
    name: "Authentic Pasta Carbonara",
    duration: "45 phút",
    people: "4 người",
    price: 85,
    includeIngredients: true,
    ingredientFee: 25,
    image:
      "https://www.recipesfromitaly.com/wp-content/uploads/2021/04/authentic-carbonara-recipe-1x1-1200x1200-1.jpg",
  },
  {
    id: 2,
    name: "Vietnamese Pho Bo",
    duration: "4 giờ",
    people: "4-5 người",
    price: 75,
    includeIngredients: true,
    ingredientFee: 22,
    image: "https://i.ytimg.com/vi/99tOr7JSr0k/sddefault.jpg",
  },
  {
    id: 3,
    name: "Healthy Buddha Bowl",
    duration: "1 giờ",
    people: "2-3 người",
    price: 65,
    includeIngredients: false,
    ingredientFee: 19,
    image:
      "https://cdn.loveandlemons.com/wp-content/uploads/2020/06/IMG_25456.jpg",
  },
];

//  Component Chính

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(initialCart);

  // State cho Lịch
  const [schedule, setSchedule] = useState({
    date: new Date("2025-10-30T20:00:00"), // Đặt ngày giờ mặc định từ UI
    address: "ABC",
    guests: "4 người",
    requests: "Dị ứng, sở thích đặc biệt...",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");

  // --- Hàm điều hướng ---
  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // --- Hàm xử lý State ---
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý DatePicker
  const handleDateChange = (date) => {
    setSchedule((prev) => ({ ...prev, date: date }));
  };

  // Hàm xử lý Time
  const handleTimeChange = (e) => {
    const newTime = e.target.value; // "20:00"
    const [hours, minutes] = newTime.split(":");
    const newDate = new Date(schedule.date);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setSchedule((prev) => ({ ...prev, date: newDate }));
  };

  //  Hàm xử lý giỏ hàng
  const handleToggleIngredients = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, includeIngredients: !item.includeIngredients }
          : item
      )
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // --- Tính toán giá tiền ---
  const itemsTotal = cart.reduce((total, item) => {
    // Giá của món ăn = Giá gốc + Phí nguyên liệu (nếu có)
    const itemCost =
      item.price + (item.includeIngredients ? item.ingredientFee : 0);
    return total + itemCost; // Cộng giá của món này vào tổng
  }, 0); // Bắt đầu tổng = 0
  const subtotal = itemsTotal;
  // Phí dịch vụ (10%) và Tổng cuối cùng sẽ tự động cập nhật theo
  const serviceFee = subtotal * 0.1;
  const finalTotal = subtotal + serviceFee;

  return (
    <div className="booking-page-container">
      <StepIndicator currentStep={step} />

      <div className="booking-content-grid">
        <main className="booking-main-content">
          {step === 1 && (
            <Step1ChooseDishes
              cart={cart}
              chef={mockChef}
              onToggle={handleToggleIngredients}
              onRemove={handleRemoveFromCart}
            />
          )}
          {step === 2 && (
            <Step2Schedule
              schedule={schedule}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              onTextChange={handleScheduleChange}
            />
          )}
          {step === 3 && (
            <Step3Payment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          )}
        </main>

        <aside className="booking-sidebar">
          <OrderSummary
            step={step}
            cart={cart}
            schedule={schedule} // Gửi toàn bộ schedule
            subtotal={subtotal}
            serviceFee={serviceFee}
            finalTotal={finalTotal}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        </aside>
      </div>
    </div>
  );
}

// --- Component Con ---

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, title: "Chọn Món" },
    { number: 2, title: "Lên Lịch" },
    { number: 3, title: "Thanh Toán" },
  ];

  return (
    <nav className="step-indicator">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div
            className={`step-item ${
              currentStep === step.number ? "active" : ""
            } ${currentStep > step.number ? "completed" : ""}`}
          >
            <div className="step-circle">{step.number}</div>
            <div className="step-title">{step.title}</div>
          </div>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </React.Fragment>
      ))}
    </nav>
  );
}

function Step1ChooseDishes({ cart, chef, onToggle, onRemove }) {
  return (
    <div className="step-1-container">
      <h2>Bước 1: Chọn Món Ăn</h2>
      <p>Chọn món ăn bạn muốn đầu bếp chuẩn bị</p>

      <div className="chef-info-box card">
        <img src={chef.avatar} alt={chef.name} className="chef-avatar" />
        <div className="chef-details">
          <strong>{chef.name}</strong>
          <p>
            ⭐ {chef.rating} • {chef.specialty}
          </p>
        </div>
      </div>

      <h3>Món Ăn ({cart.length})</h3>
      <div className="dish-list">
        {cart.map((dish) => (
          <DishItem
            key={dish.id}
            dish={dish}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

function DishItem({ dish, onToggle, onRemove }) {
  return (
    <div className="dish-item card">
      {dish.image && (
        <img src={dish.image} alt={dish.name} className="dish-image" />
      )}
      <div className="dish-details">
        <strong>{dish.name}</strong>
        <p className="dish-meta">
          <span>🕒 {dish.duration}</span>
          <span>•</span>
          <span>👥 {dish.people}</span>
        </p>
        <div className="ingredient-toggle">
          <label>
            Bao gồm nguyên liệu
            <span>+${dish.ingredientFee} phí nguyên liệu</span>
          </label>
          <button
            className={`toggle-switch ${
              dish.includeIngredients ? "on" : "off"
            }`}
            onClick={() => onToggle(dish.id)}
          >
            <span className="toggle-slider"></span>
          </button>
        </div>
      </div>
      <div className="dish-actions">
        <span className="dish-price">${dish.price}</span>
        <button onClick={() => onRemove(dish.id)} className="delete-button">
          🗑️ Xóa
        </button>
      </div>
    </div>
  );
}

//  Step2Schedule
function Step2Schedule({ schedule, onDateChange, onTimeChange, onTextChange }) {
  // Lấy giá trị giờ:phút từ đối tượng Date
  const currentTime = schedule.date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="step-2-container">
      <h2>Bước 2: Lên Lịch</h2>
      <p>Chọn thời gian và địa điểm nấu ăn</p>

      <div className="form-group">
        <label>Chọn Ngày</label>

        <DatePicker
          selected={schedule.date}
          onChange={onDateChange}
          inline
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          className="calendar-view"
        />
      </div>

      <div className="form-group">
        <label htmlFor="time-select">Chọn Giờ</label>
        <select
          id="time-select"
          name="time"
          value={currentTime}
          onChange={onTimeChange}
        >
          <option value="18:00">16:00</option>
          <option value="18:00">17:00</option>
          <option value="18:00">18:00</option>
          <option value="19:00">19:00</option>
          <option value="20:00">20:00</option>
          <option value="21:00">21:00</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="address-input">Địa Chỉ</label>
        <input
          id="address-input"
          type="text"
          name="address"
          value={schedule.address}
          onChange={onTextChange}
          placeholder="Nhập địa chỉ nhà bạn"
        />
      </div>

      <div className="form-group">
        <label htmlFor="guests-select">Số Khách</label>
        <select
          id="guests-select"
          name="guests"
          value={schedule.guests}
          onChange={onTextChange}
        >
          <option value="4 người">1 người</option>
          <option value="1 người">2 người</option>
          <option value="2 người">3 người</option>
          <option value="3 người">4 người hoặc nhiều hơn</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="requests-textarea">Yêu Cầu Đặc Biệt (Tùy chọn)</label>
        <textarea
          id="requests-textarea"
          name="requests"
          value={schedule.requests}
          onChange={onTextChange}
          placeholder="Dị ứng, sở thích đặc biệt..."
        />
      </div>
    </div>
  );
}

function Step3Payment({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="step-3-container">
      <h2>Bước 3: Thanh Toán</h2>
      <p>Chọn phương thức thanh toán để hoàn tất</p>

      <h3>Phương Thức Thanh Toán</h3>
      <div className="payment-options-list">
        <label
          className={`payment-option card ${
            paymentMethod === "cash" ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
          />
          <span className="payment-icon">💵</span>
          <div className="payment-details">
            <strong>Tiền mặt</strong>
            <span>Thanh toán cho đầu bếp trực tiếp</span>
          </div>
        </label>

        <label
          className={`payment-option card ${
            paymentMethod === "vnpay" ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="vnpay"
            checked={paymentMethod === "vnpay"}
            onChange={() => setPaymentMethod("vnpay")}
          />
          <img
            src="https://yt3.googleusercontent.com/JM1m2wng0JQUgSg9ZSEvz7G4Rwo7pYb4QBYip4PAhvGRyf1D_YTbL2DdDjOy0qOXssJPdz2r7Q=s900-c-k-c0x00ffffff-no-rj"
            alt="VNPAY"
            className="payment-logo"
          />
          <div className="payment-details">
            <strong>VNPAY</strong>
            <span>Cổng thanh toán VNPAY</span>
          </div>
        </label>
      </div>
    </div>
  );
}

function OrderSummary({
  step,
  cart,
  schedule,
  subtotal,
  serviceFee,
  finalTotal,
  onNext,
  onPrev,
}) {
  //  Định dạng ngày giờ
  const formattedDate = schedule.date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "numeric",
    year: "numeric",
  });

  const formattedTime = schedule.date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="order-summary card">
      {step === 1 && (
        <>
          <h4>Tóm Tắt Đơn Hàng</h4>
          {cart.map((item) => {
            // TÍNH GIÁ MÓN ĂN
            const itemPrice =
              item.price + (item.includeIngredients ? item.ingredientFee : 0);

            return (
              <div className="summary-line" key={item.id}>
                <span>{item.name}:</span>
                {/* HIỂN THỊ GIÁ ĐÃ TÍNH */}
                <span>${itemPrice}</span>
              </div>
            );
          })}
          <hr />
          <div className="summary-line total">
            <strong>Tổng cộng:</strong>
            <strong>${subtotal}</strong>
          </div>
          <button className="btn-primary" onClick={onNext}>
            Tiếp Tục
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h4>Chi Tiết Đặt Chỗ</h4>
          <div className="summary-detail-item">
            <span>📅</span>
            <span>
              {/* Dùng ngày đã định dạng */}
              {formattedDate}
            </span>
          </div>
          <div className="summary-detail-item">
            <span>🕗</span>
            {/* Dùng giờ đã định dạng */}
            <span>{formattedTime}</span>
          </div>
          <div className="summary-detail-item">
            <span>📍</span>
            <span>{schedule.address}</span>
          </div>
          <hr />
          <div className="summary-line">
            <span>Tổng món ăn:</span>
            <span>${subtotal}</span>
          </div>
          <div className="summary-line total">
            <strong>Tổng cộng:</strong>
            <strong>${subtotal}</strong>
          </div>
          <button className="btn-primary" onClick={onNext}>
            Tiếp Tục
          </button>
          <button className="btn-secondary" onClick={onPrev}>
            Quay Lại
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h4>Tóm Tắt Cuối Cùng</h4>
          <div className="summary-detail-item">
            <span>📅</span>
            {/* Dùng ngày đã định dạng */}
            <span>{formattedDate}</span>
          </div>
          <div className="summary-detail-item">
            <span>🕗</span>
            {/* Dùng giờ đã định dạng */}
            <span>{formattedTime}</span>
          </div>
          <div className="summary-detail-item">
            <span>📍</span>
            <span>{schedule.address}</span>
          </div>
          <hr />
          {cart.map((item) => {
            // TÍNH GIÁ MÓN ĂN
            const itemPrice =
              item.price + (item.includeIngredients ? item.ingredientFee : 0);

            return (
              <div className="summary-line" key={item.id}>
                <span>{item.name}:</span> <span>${itemPrice}</span> {}{" "}
              </div>
            );
          })}
          <div className="summary-line">
            <span>Phí dịch vụ (10%):</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <hr />
          <div className="summary-line total final-total">
            <strong>Tổng thanh toán:</strong>
            <strong>${finalTotal.toFixed(2)}</strong>
          </div>
          <div className="summary-assurances">
            <span>✔️ Thanh toán an toàn</span>
            <span>✔️ Đầu bếp đã xác minh</span>
          </div>
          <button className="btn-primary btn-payment">
            Thanh Toán ${finalTotal.toFixed(2)}
          </button>
          <button className="btn-secondary" onClick={onPrev}>
            Quay Lại
          </button>
        </>
      )}
    </div>
  );
}
