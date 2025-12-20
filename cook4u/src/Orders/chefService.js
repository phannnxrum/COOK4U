import axios from "axios";

// Cấu hình Base URL (Bạn đổi port 8080 nếu backend chạy port khác)
const API_URL = "http://localhost:3000";

/**
 * Lấy lịch sử đơn hàng của Customer
 * Method: GET
 * Endpoint: /api/orders/customer
 */
export const getOrders = async () => {
  try {
    // 1. Lấy token từ localStorage (Key phải là 'token' như trong hàm loginUser)
    const token = localStorage.getItem("token");

    // Kiểm tra nếu chưa có token thì báo lỗi ngay
    if (!token) {
      throw new Error(
        "Bạn chưa đăng nhập! Vui lòng đăng nhập để xem đơn hàng."
      );
    }

    // 2. Gọi API kèm Header chứa Token
    const response = await axios.get(`${API_URL}/api/orders/customer`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token dạng Bearer
        "Content-Type": "application/json",
      },
    });

    // 3. Xử lý dữ liệu trả về từ Server
    // Cấu trúc mong đợi: { success: true, data: [...] }
    if (response.data && response.data.success) {
      console.log("Dữ liệu đơn hàng nhận được:", response.data.data);
      return response.data.data;
    } else {
      // Trường hợp server trả về success: false
      throw new Error(
        response.data.message || "Không thể lấy danh sách đơn hàng."
      );
    }
  } catch (error) {
    console.error("Lỗi khi gọi API getOrders:", error);

    // Xử lý thông báo lỗi chi tiết
    // Nếu server có trả về message lỗi thì lấy message đó, ngược lại dùng message mặc định
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Lỗi kết nối đến Server";

    throw new Error(errorMessage);
  }
};

// Bạn có thể thêm các hàm khác liên quan đến Chef ở dưới đây
// Ví dụ: lấy danh sách đầu bếp, lấy chi tiết đầu bếp...
