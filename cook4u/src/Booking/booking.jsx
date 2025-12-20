import React, { useState } from "react";
import { DatePicker } from "antd";
// import TimePicker from 'rc-picker'; // Không dùng thì có thể bỏ
// import 'rc-picker/assets/index.css';
import dayjs from "dayjs";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  CreditCard,
  Wallet,
  CheckCircle,
  UtensilsCrossed,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Star,
} from "lucide-react";
import axios from "axios";
import { useEffect } from "react";

const initialData = {
  cartId: null,
  chef: null,
  dishes: [],
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(initialData);

  // Khởi tạo mặc định 7h sáng
  const [schedule, setSchedule] = useState({
    date: dayjs().hour(7).minute(0).second(0),
    address: "",
    guests: "1 người",
    requests: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/cart/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Sau khi gọi API
        if (res.data && res.data.data) {
          setCart({
            ...res.data.data,
            chef: res.data.data.chef
              ? {
                  ...res.data.data.chef,
                  price: Number(res.data.data.chef.price),
                }
              : null,
            dishes: res.data.data.dishes
              ? res.data.data.dishes.map((dish) => ({
                  ...dish,
                  PRICE: Number(dish.PRICE),
                }))
              : [],
          });
        }
      } catch (err) {
        console.error(err);
        // alert("Không tìm thấy giỏ hàng");
      }
    };
    fetchCart();
  }, []);

  // Navigation
  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Handle schedule changes (Text inputs)
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // --- SỬA LỖI 1: Logic Date Change ---
  const handleDateChange = (date) => {
    if (date) {
      // Khi chọn ngày mới, giữ nguyên giờ phút đã chọn trước đó
      const newDate = date
        .hour(schedule.date.hour())
        .minute(schedule.date.minute())
        .second(0);
      setSchedule((prev) => ({ ...prev, date: newDate }));
    }
  };

  // --- SỬA LỖI 2: Logic Time Select (Dayjs Immutability) ---
  const handleTimeSelect = (e) => {
    const timeString = e.target.value; // Dạng "07:00", "08:00"
    if (timeString) {
      const [hours, minutes] = timeString.split(":");

      // Dayjs là bất biến (immutable), phải dùng chaining hoặc gán lại biến
      const newDate = schedule.date
        .hour(parseInt(hours))
        .minute(parseInt(minutes))
        .second(0);

      console.log("Time Selected:", timeString);
      console.log("New Date Object:", newDate.format("YYYY-MM-DD HH:mm:ss"));

      setSchedule((prev) => ({ ...prev, date: newDate }));
    }
  };

  // Tính toán giá tiền
  const calculatePrices = () => {
    if (!cart || !cart.dishes || cart.dishes.length === 0) {
      return {
        dishesTotal: 0,
        chefFee: 0,
        subtotal: 0,
        serviceFee: 0,
        finalTotal: 0,
      };
    }

    const dishesTotal = cart.dishes.reduce((total, dish) => {
      const price = parseFloat(dish?.PRICE) || 0;
      const quantity = parseInt(dish?.QUANTITY) || 0;
      return total + price * quantity;
    }, 0);

    const chefFee = cart.chef ? parseFloat(cart.chef.price) || 0 : 0;
    const subtotal = dishesTotal + chefFee;
    const serviceFee = subtotal * 0.1;
    const finalTotal = subtotal + serviceFee;

    return { dishesTotal, chefFee, subtotal, serviceFee, finalTotal };
  };

  const { dishesTotal, chefFee, subtotal, serviceFee, finalTotal } =
    calculatePrices();

  // Hàm tạo order
  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!cart.cartId || !cart.chef) {
        alert("Vui lòng kiểm tra lại thông tin giỏ hàng");
        return;
      }

      if (!schedule.address) {
        alert("Vui lòng nhập địa chỉ");
        return;
      }

      // Format date gửi lên server
      const cookingDate = schedule.date.format("YYYY-MM-DD");
      const cookingTime = schedule.date.format("HH:mm:ss");

      console.log("Check Time Before Send:", cookingTime); // Debug log

      const orderData = {
        cartId: cart.cartId,
        chefId: cart.chef.CHEFID,
        cookingDate,
        cookingTime,
        address: schedule.address,
        specReq: schedule.requests || null,
      };

      console.log("Sending order data:", orderData);

      const response = await axios.post(
        "http://localhost:3000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Đặt đơn thành công!");
        window.location.href = `/home`;
      } else {
        alert("Có lỗi xảy ra: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.response) {
        alert(
          `Lỗi: ${error.response.data.message || error.response.statusText}`
        );
      } else {
        alert("Lỗi kết nối đến server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <Step1ChooseDishes dishes={cart.dishes} chef={cart.chef} />
            )}
            {step === 2 && (
              <Step2Schedule
                schedule={schedule}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeSelect} // Truyền đúng hàm đã sửa
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

          <div className="lg:col-span-1">
            <OrderSummary
              step={step}
              cart={cart}
              schedule={schedule}
              dishesTotal={dishesTotal}
              chefFee={chefFee}
              subtotal={subtotal}
              serviceFee={serviceFee}
              finalTotal={finalTotal}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              onCreateOrder={handleCreateOrder}
              loading={loading}
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
    { number: 1, title: "Chọn Món", icon: <UtensilsCrossed></UtensilsCrossed> },
    { number: 2, title: "Lên Lịch", icon: <CalendarDays></CalendarDays> },
    { number: 3, title: "Thanh Toán", icon: <CreditCard></CreditCard> },
  ];

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold border-2 transition-all duration-300
              ${
                currentStep === step.number
                  ? "bg-orange-500 border-orange-500 text-white shadow-lg"
                  : currentStep > step.number
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {currentStep > step.number ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium transition-colors
              ${
                currentStep >= step.number ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 transition-colors duration-300
              ${currentStep > step.number ? "bg-green-500" : "bg-gray-300"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Step1ChooseDishes({ dishes, chef }) {
  if (!chef || !dishes) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bước 1: Chọn Món Ăn
        </h2>
        <p className="text-gray-600 mb-6">Giỏ hàng trống hoặc đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Bước 1: Chọn Món Ăn
      </h2>
      <p className="text-gray-600 mb-6">
        Chọn món ăn bạn muốn đầu bếp chuẩn bị
      </p>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 flex items-center gap-4">
        <img
          src={chef.AVTURL}
          alt={chef.CHEFNAME}
          className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
        />
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{chef.CHEFNAME}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-600 text-sm">
              Phí dịch vụ: ${parseFloat(chef.price).toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Món Ăn ({dishes.length})
      </h3>
      <div className="space-y-4">
        {dishes.map((dish) => (
          <DishItem key={dish.DISHID} dish={dish} />
        ))}
      </div>
    </div>
  );
}

function DishItem({ dish }) {
  const itemPrice = parseFloat(dish.PRICE) * dish.QUANTITY;

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-orange-200 transition-colors">
      <img
        src={dish.PICTUREURL}
        alt={dish.DISHNAME}
        className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg"
      />

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900">{dish.DISHNAME}</h4>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {dish.COOKTIME}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {dish.NUMPEOPLE}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Số lượng: {dish.QUANTITY} × $
              {parseFloat(dish.PRICE).toLocaleString("vi-VN")}
            </div>
          </div>
          <span className="text-lg font-bold text-orange-500">
            ${itemPrice.toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    </div>
  );
}

function Step2Schedule({ schedule, onDateChange, onTimeChange, onTextChange }) {
  // --- SỬA LỖI 3: Format value cho select ---
  // schedule.date là dayjs object -> chuyển thành string "HH:mm" để select hiểu
  const currentTimeString = schedule.date.format("HH:mm");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Bước 2: Lên Lịch
      </h2>
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
              value={schedule.date} // Antd DatePicker cần prop value
              inline="true" // Antd không có inline prop theo cách này, nhưng nếu bạn dùng style wrapper thì ok.
              // Nếu muốn hiển thị lịch luôn: open={true} hoặc dùng Calendar của Antd
              minDate={dayjs()}
              format="DD/MM/YYYY"
              className="w-full"
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
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
              value={currentTimeString} // Sửa ở đây: truyền string thay vì object
              onChange={onTimeChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {/* --- SỬA LỖI 4: Value của option bị copy paste sai --- */}
              <option value="07:00">7:00</option>
              <option value="08:00">8:00</option>
              <option value="09:00">9:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
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
              Địa Chỉ *
            </label>
            <input
              type="text"
              name="address"
              value={schedule.address}
              onChange={onTextChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Nhập địa chỉ nhà bạn"
              required
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Bước 3: Thanh Toán
      </h2>
      <p className="text-gray-600 mb-6">
        Chọn phương thức thanh toán để hoàn tất
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Phương Thức Thanh Toán
      </h3>

      <div className="space-y-4">
        {/* Cash Option */}
        <label
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === "cash"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
            className="sr-only"
          />
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`p-3 rounded-lg ${
                paymentMethod === "cash"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Tiền mặt</h4>
              <p className="text-sm text-gray-600">
                Thanh toán cho đầu bếp trực tiếp
              </p>
            </div>
          </div>
          {paymentMethod === "cash" && (
            <CheckCircle className="w-6 h-6 text-orange-500" />
          )}
        </label>

        {/* VNPAY Option */}
        <label
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === "vnpay"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="vnpay"
            checked={paymentMethod === "vnpay"}
            onChange={() => setPaymentMethod("vnpay")}
            className="sr-only"
          />
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`p-3 rounded-lg ${
                paymentMethod === "vnpay" ? "bg-orange-100" : "bg-gray-100"
              }`}
            >
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
          {paymentMethod === "vnpay" && (
            <CheckCircle className="w-6 h-6 text-orange-500" />
          )}
        </label>
      </div>
    </div>
  );
}

function OrderSummary({
  step,
  cart,
  schedule,
  dishesTotal,
  chefFee,
  subtotal,
  serviceFee,
  finalTotal,
  onNext,
  onPrev,
  onCreateOrder,
  loading,
}) {
  // Format date từ dayjs
  const formattedDate = schedule.date.format("dddd, DD/MM/YYYY");
  const formattedTime = schedule.date.format("HH:mm");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      {step === 1 && (
        <>
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Tóm Tắt Đơn Hàng
          </h4>

          {/* Hiển thị thông tin chef */}
          {cart.chef && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Đầu bếp:</span>
                <span className="font-medium">{cart.chef.CHEFNAME}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Phí dịch vụ đầu bếp:</span>
                <span className="font-medium">
                  ${parseFloat(cart.chef.price).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {cart.dishes &&
              cart.dishes.map((dish) => (
                <div key={dish.DISHID} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <span className="text-gray-600">{dish.DISHNAME}</span>
                    <div className="text-xs text-gray-400">
                      {dish.QUANTITY} × $
                      {parseFloat(dish.PRICE).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <span className="font-medium ml-4">
                    $
                    {(parseFloat(dish.PRICE) * dish.QUANTITY).toLocaleString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tổng món ăn:</span>
              <span className="font-medium">
                ${dishesTotal.toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phí đầu bếp:</span>
              <span className="font-medium">
                ${chefFee.toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span>${subtotal.toLocaleString("vi-VN")}</span>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            disabled={!cart.dishes || cart.dishes.length === 0}
          >
            Tiếp Tục <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Chi Tiết Đặt Chỗ
          </h4>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formattedTime}</span>
            </div>
            {schedule.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 truncate">
                  {schedule.address}
                </span>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tổng món ăn:</span>
              <span className="font-medium">
                ${dishesTotal.toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phí đầu bếp:</span>
              <span className="font-medium">
                ${chefFee.toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span>${subtotal.toLocaleString("vi-VN")}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onNext}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              disabled={!schedule.address}
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
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Tóm Tắt Cuối Cùng
          </h4>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formattedTime}</span>
            </div>
            {schedule.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 truncate">
                  {schedule.address}
                </span>
              </div>
            )}
          </div>

          <div className="border-y py-4 mb-6">
            <div className="space-y-2 mb-4">
              {cart.dishes &&
                cart.dishes.map((dish) => (
                  <div
                    key={dish.DISHID}
                    className="flex justify-between text-sm"
                  >
                    <div className="flex-1">
                      <span className="text-gray-600">{dish.DISHNAME}</span>
                      <div className="text-xs text-gray-400">
                        {dish.QUANTITY} × $
                        {parseFloat(dish.PRICE).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <span className="font-medium ml-4">
                      $
                      {(parseFloat(dish.PRICE) * dish.QUANTITY).toLocaleString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Tổng món ăn:</span>
              <span className="font-medium">
                ${dishesTotal.toLocaleString("vi-VN")}
              </span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Phí đầu bếp:</span>
              <span className="font-medium">
                ${chefFee.toLocaleString("vi-VN")}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí dịch vụ (10%):</span>
              <span className="font-medium">
                ${serviceFee.toLocaleString("vi-VN")}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-4">
              <span>Tổng thanh toán:</span>
              <span className="text-orange-500">
                ${finalTotal.toLocaleString("vi-VN")}
              </span>
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
            <button
              onClick={onCreateOrder}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : `Xác Nhận Đặt Đơn $${finalTotal.toLocaleString("vi-VN")}`}
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
