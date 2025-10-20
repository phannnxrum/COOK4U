// import axios from "axios";

// const API_URL = "https://api.yourdomain.com";
import chefData from './Mock_data.json';

export const getChefById = async (chefId) => {
//   try {
//     const response = await axios.get(`${API_URL}/chefs/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy thông tin đầu bếp:", error);
//     throw error;
//   }
    const chef = chefData.find(chef => chef.id === parseInt(chefId));
    console.log("Danh sách đầu bếp 1:", chefData);

    if (!chef) {
        throw new Error("Đầu bếp không tồn tại 1");
    }
    return chef;
};
