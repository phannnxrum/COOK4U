import {
  Star,
  Trash2,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";

const MyCart = () => {
  // giả lập dữ liệu (sau này thay bằng API / context)
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

  const total =
    (chef ? chef.price : 0) +
    dishes.reduce((sum, d) => sum + d.price, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-semibold">Giỏ Hàng Của Bạn</h1>

        {/* CHEF */}
        {chef && (
          <div className="bg-white rounded-xl border p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <img
                  src={chef.avatar}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{chef.name}</p>
                  <div className="flex items-center text-sm text-gray-500 gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {chef.rating} · {chef.reviews} đánh giá
                  </div>
                  <p className="font-semibold mt-1">${chef.price}/giờ</p>
                </div>
              </div>

              <button className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* DISHES */}
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-xl border p-4 flex justify-between"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-md" />
              <div>
                <p className="font-semibold">{dish.name}</p>
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
                <p className="font-semibold mt-1">${dish.price}</p>
              </div>
            </div>

            <button className="text-gray-400 hover:text-red-500">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="bg-white rounded-xl border p-5 h-fit">
        <h2 className="font-semibold mb-4">Tóm Tắt Đơn Hàng</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Đầu bếp:</span>
            <span>${chef ? chef.price : 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Món ăn ({dishes.length}):</span>
            <span>${dishes.reduce((s, d) => s + d.price, 0)}</span>
          </div>
        </div>

        <div className="border-t my-4" />

        <div className="flex justify-between font-semibold mb-4">
          <span>Tổng cộng:</span>
          <span className="text-orange-500">${total}</span>
        </div>

        <button
          disabled={!canCheckout}
          className={`w-full py-3 rounded-lg font-semibold transition
            ${
              canCheckout
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
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

        <div className="mt-4 space-y-1 text-sm text-gray-500">
          <p className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Đầu bếp chuyên nghiệp đã xác minh
          </p>
          <p className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Thanh toán an toàn
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
