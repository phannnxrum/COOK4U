import React, { useState } from "react";
import { DatePicker } from "antd";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  CreditCard, 
  Wallet,
  CheckCircle,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Dữ liệu giả lập
const mockChef = {
  name: "Đầu bếp Jack Vĩnh Long",
  rating: 4.9,
  specialty: "Món Việt & Âu",
  avatar: "https://images2.thanhnien.vn/528068263637045248/2023/3/21/jack-1679396385964143355875.jpeg",
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
    image: "https://www.recipesfromitaly.com/wp-content/uploads/2021/04/authentic-carbonara-recipe-1x1-1200x1200-1.jpg",
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
    image: "https://cdn.loveandlemons.com/wp-content/uploads/2020/06/IMG_25456.jpg",
  },
];

// --- Component Chính ---
export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(initialCart);
  const [schedule, setSchedule] = useState({
    date: new Date("2025-10-30T20:00:00"),
    address: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
    guests: "4 người",
    requests: "Dị ứng đậu phộng, ít đường",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Hàm điều hướng
  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Hàm xử lý schedule
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSchedule((prev) => ({ ...prev, date: date }));
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    const [hours, minutes] = newTime.split(":");
    const newDate = new Date(schedule.date);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setSchedule((prev) => ({ ...prev, date: newDate }));
  };

  // Hàm xử lý giỏ hàng
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

  // Tính toán giá tiền
  const itemsTotal = cart.reduce((total, item) => {
    const itemCost = item.price + (item.includeIngredients ? item.ingredientFee : 0);
    return total + itemCost;
  }, 0);

  const subtotal = itemsTotal;
  const serviceFee = subtotal * 0.1;
  const finalTotal = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              step={step}
              cart={cart}
              schedule={schedule}
              subtotal={subtotal}
              serviceFee={serviceFee}
              finalTotal={finalTotal}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Component Con ---

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, title: "Chọn Món", icon: "🍽️" },
    { number: 2, title: "Lên Lịch", icon: "📅" },
    { number: 3, title: "Thanh Toán", icon: "💳" },
  ];

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step Item */}
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold border-2 transition-all duration-300
              ${currentStep === step.number 
                ? 'bg-orange-500 border-orange-500 text-white shadow-lg' 
                : currentStep > step.number 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.icon}
            </div>
            <span className={`mt-2 text-sm font-medium transition-colors
              ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}
            >
              {step.title}
            </span>
          </div>
          
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 transition-colors duration-300
              ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Step1ChooseDishes({ cart, chef, onToggle, onRemove }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Bước 1: Chọn Món Ăn</h2>
      <p className="text-gray-600 mb-6">Chọn món ăn bạn muốn đầu bếp chuẩn bị</p>

      {/* Chef Info */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 flex items-center gap-4">
        <img src={chef.avatar} alt={chef.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-200" />
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{chef.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="ml-1 font-medium">{chef.rating}</span>
            </div>
            <span className="text-gray-600 text-sm">• {chef.specialty}</span>
          </div>
        </div>
      </div>

      {/* Dishes List */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Món Ăn ({cart.length})</h3>
      <div className="space-y-4">
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
  const itemPrice = dish.price + (dish.includeIngredients ? dish.ingredientFee : 0);

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-orange-200 transition-colors">
      <img src={dish.image} alt={dish.name} className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg" />
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900">{dish.name}</h4>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {dish.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {dish.people}
              </span>
            </div>
          </div>
          <span className="text-lg font-bold text-orange-500">${itemPrice}</span>
        </div>

        {/* Ingredient Toggle */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="font-medium text-gray-900">Bao gồm nguyên liệu</p>
            <p className="text-sm text-gray-500">+${dish.ingredientFee} phí nguyên liệu</p>
          </div>
          <button
            onClick={() => onToggle(dish.id)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dish.includeIngredients ? 'bg-orange-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dish.includeIngredients ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <button
        onClick={() => onRemove(dish.id)}
        className="self-start sm:self-center text-gray-500 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

function Step2Schedule({ schedule, onDateChange, onTimeChange, onTextChange }) {
  const currentTime = schedule.date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Bước 2: Lên Lịch</h2>
      <p className="text-gray-600 mb-6">Chọn thời gian và địa điểm nấu ăn</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Chọn Ngày
          </label>
          <div className="border border-gray-300 rounded-lg p-4">
            <DatePicker
              selected={schedule.date}
              onChange={onDateChange}
              inline
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full"
            />
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Chọn Giờ
            </label>
            <select
              value={currentTime}
              onChange={onTimeChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Địa Chỉ
            </label>
            <input
              type="text"
              name="address"
              value={schedule.address}
              onChange={onTextChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Nhập địa chỉ nhà bạn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Số Khách
            </label>
            <select
              name="guests"
              value={schedule.guests}
              onChange={onTextChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="1 người">1 người</option>
              <option value="2 người">2 người</option>
              <option value="3 người">3 người</option>
              <option value="4 người">4 người hoặc nhiều hơn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Yêu Cầu Đặc Biệt (Tùy chọn)
        </label>
        <textarea
          name="requests"
          value={schedule.requests}
          onChange={onTextChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-32"
          placeholder="Dị ứng, sở thích đặc biệt..."
        />
      </div>
    </div>
  );
}

function Step3Payment({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Bước 3: Thanh Toán</h2>
      <p className="text-gray-600 mb-6">Chọn phương thức thanh toán để hoàn tất</p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Phương Thức Thanh Toán</h3>
      
      <div className="space-y-4">
        {/* Cash Option */}
        <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "cash" ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
            className="sr-only"
          />
          <div className="flex items-center gap-4 flex-1">
            <div className={`p-3 rounded-lg ${paymentMethod === "cash" ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Tiền mặt</h4>
              <p className="text-sm text-gray-600">Thanh toán cho đầu bếp trực tiếp</p>
            </div>
          </div>
          {paymentMethod === "cash" && <CheckCircle className="w-6 h-6 text-orange-500" />}
        </label>

        {/* VNPAY Option */}
        <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "vnpay" ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
          <input
            type="radio"
            name="payment"
            value="vnpay"
            checked={paymentMethod === "vnpay"}
            onChange={() => setPaymentMethod("vnpay")}
            className="sr-only"
          />
          <div className="flex items-center gap-4 flex-1">
            <div className={`p-3 rounded-lg ${paymentMethod === "vnpay" ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <img 
                src="https://yt3.googleusercontent.com/JM1m2wng0JQUgSg9ZSEvz7G4Rwo7pYb4QBYip4PAhvGRyf1D_YTbL2DdDjOy0qOXssJPdz2r7Q=s900-c-k-c0x00ffffff-no-rj"
                alt="VNPAY"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">VNPAY</h4>
              <p className="text-sm text-gray-600">Cổng thanh toán VNPAY</p>
            </div>
          </div>
          {paymentMethod === "vnpay" && <CheckCircle className="w-6 h-6 text-orange-500" />}
        </label>
      </div>
    </div>
  );
}

function OrderSummary({ step, cart, schedule, subtotal, serviceFee, finalTotal, onNext, onPrev }) {
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
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      {step === 1 && (
        <>
          <h4 className="text-xl font-bold text-gray-900 mb-4">Tóm Tắt Đơn Hàng</h4>
          <div className="space-y-3 mb-6">
            {cart.map((item) => {
              const itemPrice = item.price + (item.includeIngredients ? item.ingredientFee : 0);
              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-2">{item.name}</span>
                  <span className="font-medium">${itemPrice}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span>${subtotal}</span>
            </div>
          </div>
          <button
            onClick={onNext}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            Tiếp Tục <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h4 className="text-xl font-bold text-gray-900 mb-4">Chi Tiết Đặt Chỗ</h4>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 truncate">{schedule.address}</span>
            </div>
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tổng món ăn:</span>
              <span className="font-medium">${subtotal}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span>${subtotal}</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={onNext}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              Tiếp Tục <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onPrev}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Quay Lại
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h4 className="text-xl font-bold text-gray-900 mb-4">Tóm Tắt Cuối Cùng</h4>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 truncate">{schedule.address}</span>
            </div>
          </div>
          
          <div className="border-y py-4 mb-6">
            <div className="space-y-2 mb-4">
              {cart.map((item) => {
                const itemPrice = item.price + (item.includeIngredients ? item.ingredientFee : 0);
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">{item.name}</span>
                    <span className="font-medium">${itemPrice}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí dịch vụ (10%):</span>
              <span className="font-medium">${serviceFee.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-4">
              <span>Tổng thanh toán:</span>
              <span className="text-orange-500">${finalTotal.toFixed(2)}</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Thanh toán an toàn</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Đầu bếp đã xác minh</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Thanh Toán ${finalTotal.toFixed(2)}
            </button>
            <button
              onClick={onPrev}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Quay Lại
            </button>
          </div>
        </>
      )}
    </div>
  );
}