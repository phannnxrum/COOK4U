// import axios from "axios";

// const API_URL = "https://api.yourdomain.com";
import ordersData from "./Mock_data.json";

export const getOrders = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/chefs/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Lỗi khi lấy thông tin đầu bếp:", error);
  //     throw error;
  //   }
  // const chef = chefData.find(chef => chef.id === parseInt(chefId));
  console.log("Danh sách đơn hàng:", ordersData);

  // if (!chef) {
  //     throw new Error("Không có đơn hàng tồn tại");
  // }
  return ordersData;
};
