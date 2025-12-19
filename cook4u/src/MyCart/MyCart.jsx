import {
  Star,
  Trash2,
  Clock,
  Users,
  CheckCircle,
  ChefHat,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router";

const MyCart = () => {
  const { cart, removeChef, removeDish, clearCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  const chef = cart.chef;
  const dishes = cart.dishes || [];

  const hasChef = !!chef;
  const hasDish = dishes.length > 0;
  const canCheckout = hasChef && hasDish;

  const chefTotal = hasChef
    ? (() => {
        if (typeof chef?.price === "number") {
          return chef.price;
        }
        if (typeof chef?.price === "string") {
          // Sửa: parseFloat thay vì parseInt để giữ phần thập phân
          return parseFloat(chef.price.replace(/[^0-9.]/g, ""));
        }
        return 0;
      })()
    : 0;

  // SỬA PHẦN NÀY - Tính tổng tiền món ăn
  const dishesTotal = Array.isArray(dishes)
    ? dishes.reduce((sum, dish) => {
        let price = 0;
        
        // Ưu tiên lấy từ dish.PRICE (từ API)
        if (dish.PRICE !== undefined) {
          if (typeof dish.PRICE === "number") {
            price = dish.PRICE;
          } else if (typeof dish.PRICE === "string") {
            // Xóa ký tự không phải số và dấu chấm thập phân
            price = parseFloat(dish.PRICE.replace(/[^0-9.]/g, ""));
          }
        }
        // Fallback: dish.price
        else if (dish.price !== undefined) {
          if (typeof dish.price === "number") {
            price = dish.price;
          } else if (typeof dish.price === "string") {
            price = parseFloat(dish.price.replace(/[^0-9.]/g, ""));
          }
        }
        
        // Lấy quantity, mặc định là 1
        const quantity = dish.QUANTITY || 1;
        
        return sum + (price * quantity);
      }, 0)
    : 0;

  const total = chefTotal + dishesTotal;

  const handleClearAll = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả các mục trong giỏ hàng?"
      )
    ) {
      clearCart();
    }
  };

  const handleRemoveChef = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đầu bếp này?")) {
      removeChef();
    }
  };

  const handleRemoveDish = (dishId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      removeDish(dishId);
    }
  };

  const handleCheckout = () => {
    if (canCheckout) {
      navigate("/home/book");
    }
  };

  // SỬA THÊM: Format số tiền có dấu phân cách
  const formatPrice = (price) => {
    if (typeof price === "number") {
      return price.toLocaleString("vi-VN");
    }
    if (typeof price === "string") {
      const num = parseFloat(price.replace(/[^0-9.]/g, ""));
      return isNaN(num) ? "0" : num.toLocaleString("vi-VN");
    }
    return "0";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* KHUNG GIỐNG TRANG TÌM MÓN ĂN */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* HEADER: title + clear all */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Giỏ Hàng Của Bạn
          </h1>

          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Tất Cả</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* CHEF SECTION */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <ChefHat className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Đầu Bếp
                </span>
              </div>

              {hasChef && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <img
                        src={chef.AVTURL}
                        alt={chef.CHEFNAME}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {chef.CHEFNAME}
                        </p>
                        <p className="font-semibold mt-2 text-gray-900">
                          VNĐ {formatPrice(chef.price)}/giờ
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveChef(chef.CHEFID)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* DISHES SECTION */}
            <section>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Món Ăn ({dishes.length})
              </p>

              {hasDish && (
                <div className="space-y-4">
                  {dishes.map((dish) => (
                    <div
                      key={dish.DISHID}
                      className="bg-white rounded-2xl border border-gray-200 p-4 flex justify-between items-stretch shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <img
                          className="w-20 h-20 bg-gray-100 rounded-lg"
                          src={
                            dish.AVTURL ||
                            `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop`
                          }
                        />
                        <div className="flex flex-col justify-center">
                          <p className="font-semibold text-gray-900">
                            {dish.DISHNAME}
                            {/* Hiển thị số lượng nếu > 1 */}
                            {(dish.QUANTITY && dish.QUANTITY > 1) && (
                              <span className="ml-2 text-sm text-orange-500">
                                (x{dish.QUANTITY})
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {dish.COOKTIME}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {dish.NUMPEOPLE}
                            </span>
                          </div>
                          <p className="font-semibold mt-2 text-gray-900">
                            {dish.PRICE !== undefined ? formatPrice(dish.PRICE) : formatPrice(dish.price)} VNĐ
                            {/* Hiển thị tổng tiền nếu quantity > 1 */}
                            {(dish.QUANTITY && dish.QUANTITY > 1) && (
                              <span className="block text-sm text-gray-500 mt-1">
                                {dish.QUANTITY} × {formatPrice(dish.PRICE || dish.price)} VNĐ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveDish(dish.DISHID)}
                        className="self-center text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm lg:sticky lg:top-28">
              <h2 className="font-semibold mb-4 text-gray-900">
                Tóm Tắt Đơn Hàng
              </h2>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Đầu bếp:</span>
                  <span>VNĐ {formatPrice(chefTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Món ăn ({dishes.length}):</span>
                  <span>VNĐ {formatPrice(dishesTotal)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4" />

              <div className="flex justify-between items-center font-semibold mb-4">
                <span className="text-gray-900">Tổng cộng:</span>
                <span className="text-orange-500 text-lg">
                  VNĐ {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!canCheckout}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition
                  ${
                    canCheckout
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Tiến Hành Thanh Toán
              </button>

              {!canCheckout && (
                <p className="text-xs text-red-500 mt-2">
                  * Vui lòng chọn đầu bếp và ít nhất 1 món ăn để thanh toán
                </p>
              )}

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Đầu bếp chuyên nghiệp đã xác minh
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Thanh toán an toàn
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MyCart;