import {
  Star,
  Trash2,
  Clock,
  Users,
  CheckCircle,
  ChefHat,
} from "lucide-react";

const MyCart = () => {
  const chef = {
    name: "Đầu bếp Tony",
    price: 85,
    rating: 4.9,
    reviews: 142,
    avatar: "https://i.pravatar.cc/100?img=12",
  };

  const dishes = [
    {
      id: 1,
      name: "Vietnamese Pho Bo",
      price: 75,
      time: "4 giờ",
      people: "4-5 người",
    },
  ];

  const hasChef = !!chef;
  const hasDish = dishes.length > 0;
  const canCheckout = hasChef && hasDish;

  const chefTotal = hasChef ? chef.price : 0;
  const dishesTotal = dishes.reduce((sum, d) => sum + d.price, 0);
  const total = chefTotal + dishesTotal;

  const handleClearAll = () => {
    console.log("Clear all items in cart");
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
                        src={chef.avatar}
                        alt={chef.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {chef.name}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{chef.rating}</span>
                          <span>·</span>
                          <span>{chef.reviews} đánh giá</span>
                        </div>
                        <p className="font-semibold mt-2 text-gray-900">
                          ${chef.price}/giờ
                        </p>
                      </div>
                    </div>

                    <button className="text-gray-400 hover:text-red-500">
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
                      key={dish.id}
                      className="bg-white rounded-2xl border border-gray-200 p-4 flex justify-between items-stretch shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg" />
                        <div className="flex flex-col justify-center">
                          <p className="font-semibold text-gray-900">
                            {dish.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {dish.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {dish.people}
                            </span>
                          </div>
                          <p className="font-semibold mt-2 text-gray-900">
                            ${dish.price}
                          </p>
                        </div>
                      </div>

                      <button className="self-center text-gray-400 hover:text-red-500">
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
                  <span>${chefTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Món ăn ({dishes.length}):</span>
                  <span>${dishesTotal}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4" />

              <div className="flex justify-between items-center font-semibold mb-4">
                <span className="text-gray-900">Tổng cộng:</span>
                <span className="text-orange-500 text-lg">${total}</span>
              </div>

              <button
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
