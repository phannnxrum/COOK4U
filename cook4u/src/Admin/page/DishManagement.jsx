import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Divider,
  message,
  Switch,
} from "antd";
import axios from "axios";

const DishManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [form] = Form.useForm();
  const [editingDishId, setEditingDishId] = useState(null);

  // URL Placeholder
  const dishPlaceholder = "https://via.placeholder.com/150";

  // 1. Lấy danh sách món ăn
  const getAllDishes = async () => {
    try {
      let res = await axios.get(`http://localhost:3000/api/dishes/admin`);
      setDishes(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.log("Lỗi tải danh sách:", err);
      message.error("Không thể tải danh sách món ăn");
    }
  };

  useEffect(() => {
    getAllDishes();
  }, []);

  // 2. Hàm Submit (Xử lý chuỗi "người" trước khi gửi)
  const handleSubmitDish = async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        shortDescription: values.shortDescription,
        cookTime: values.cookTime,
        price: values.price,
        image: values.image,

        // --- SỬA LOGIC NUMPEOPLE TẠI ĐÂY ---
        // Lấy số nhập vào (ví dụ "2") và nối thêm " người" -> "2 người"
        numPeople: `${values.numPeople} người`,

        cuisine: values.cuisine,
        status: values.status || false,
        ingredients: values.ingredients || [],
        nutritions: values.nutritions || [],
      };

      if (editingDishId) {
        await axios.patch(
          `http://localhost:3000/api/dishes/${editingDishId}`,
          payload
        );
        message.success("Cập nhật thành công");
      } else {
        await axios.post(`http://localhost:3000/api/dishes`, payload);
        message.success("Thêm mới thành công");
      }

      setIsModalVisible(false);
      setEditingDishId(null);
      form.resetFields();
      getAllDishes();
    } catch (error) {
      console.error("Lỗi submit:", error);
      message.error("Có lỗi xảy ra");
    }
  };

  // 3. Hàm Edit (Đã sửa lỗi load Note và Unit)
  const handleEditDish = async (dish) => {
    setEditingDishId(dish.id);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/dishes/${dish.id}`
      );
      const fullDishData = res.data.data;

      console.log("Data từ API:", fullDishData); // Debug xem dữ liệu trả về là hoa hay thường

      // Xử lý tách số từ chuỗi "2 người"
      let formattedNumPeople = "";
      if (fullDishData.servings) {
        formattedNumPeople = fullDishData.servings
          .toString()
          .replace(/[^\d-]/g, "");
      }

      form.setFieldsValue({
        name: fullDishData.name,
        image: fullDishData.image,
        price: fullDishData.price,
        shortDescription: fullDishData.shortDescription,
        description: fullDishData.description || fullDishData.about,
        cookTime: fullDishData.cookTime,
        numPeople: formattedNumPeople,
        cuisine: fullDishData.category,

        // Status: Kiểm tra kỹ các trường hợp trả về
        status:
          fullDishData.status === 1 ||
          fullDishData.status === true ||
          fullDishData.status === "1",

        // --- SỬA LỖI INGREDIENTS (NOTE) ---
        ingredients:
          fullDishData.ingredients?.map((i) => ({
            name: i.name || i.INGREDIENT, // Phòng hờ DB trả về tên cột gốc
            amount: parseFloat(i.amount || i.QUANTITY),

            // Unit: Ưu tiên lấy unit từ DB, nếu không có thì mới parse từ amount cũ
            unit:
              i.unit ||
              i.UNIT ||
              (typeof i.amount === "string"
                ? i.amount.replace(/[0-9.]/g, "").trim()
                : ""),

            // Note: Lấy i.note (thường) hoặc i.NOTE (hoa)
            note: i.note || i.NOTE || "",
          })) || [],

        // --- SỬA LỖI NUTRITIONS (UNIT) ---
        nutritions:
          fullDishData.nutrition?.map((n) => ({
            name: n.name || n.NAMETYPE,
            amount: n.amount || n.QUANTITY,

            // Unit: Lấy n.unit (thường) hoặc n.UNIT (hoa)
            unit: n.unit || n.UNIT || "",
          })) || [],
      });

      setIsModalVisible(true);
    } catch (err) {
      console.error("Lỗi lấy chi tiết món:", err);
      message.error("Không thể lấy thông tin món ăn");
    }
  };
  // Hàm "Xóa" mềm (Đổi status = 0/false)
  const handleDeleteDish = async (id) => {
    // 1. Hỏi xác nhận người dùng
    if (!window.confirm("Bạn có chắc muốn ngừng kinh doanh món này?")) return;

    try {
      // 2. Gọi API PATCH chỉ để update trường status
      await axios.patch(`http://localhost:3000/api/dishes/${id}`, {
        status: false, // Backend sẽ chuyển thành 0
      });

      // 3. Thông báo thành công
      message.success("Đã cập nhật trạng thái ngừng bán");

      // 4. Load lại bảng dữ liệu
      getAllDishes();
    } catch (error) {
      console.error("Lỗi xóa:", error);
      message.error("Có lỗi xảy ra khi xóa món ăn");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quản lý món ăn ({dishes.length})</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingDishId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm món ăn
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-t-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {/* Header Grid */}
          <div className="grid grid-cols-10 bg-gray-50 px-4 py-3 text-center text-md font-semibold text-gray-600">
            <p className="col-span-3 text-left">Món ăn</p>
            <p className="col-span-1">Loại</p>
            <p className="col-span-1">Giá</p>
            <p className="col-span-1">Đơn hàng</p>
            <p className="col-span-1">Đánh giá</p>
            <p className="col-span-2">Trạng thái</p>
            <p className="col-span-1">Thao tác</p>
          </div>

          {/* Body Grid */}
          <div className="flex flex-col divide-y divide-gray-100 bg-white">
            {dishes.map((dish) => {
              // --- LOGIC KIỂM TRA STATUS CHO TABLE ---
              // Chấp nhận: 1, true, hoặc "1" là Đang phục vụ
              const isActive =
                dish.status === 1 ||
                dish.status === true ||
                dish.status === "1";

              return (
                <div
                  key={dish.id}
                  className="grid grid-cols-10 items-center px-4 py-4 hover:bg-gray-50 transition-colors text-center text-base border-b border-gray-100"
                >
                  {/* Cột 1: Món ăn */}
                  <div className="col-span-3 flex items-center space-x-3 text-left">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <img
                        src={dish?.image || dishPlaceholder}
                        alt={dish.name}
                        className="w-full h-full object-cover rounded-lg border border-gray-100"
                        onError={(e) => {
                          e.target.src = dishPlaceholder;
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {dish.name}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {dish.shortDescription || "Không có mô tả"}
                      </p>
                    </div>
                  </div>

                  {/* Cột 2: Loại */}
                  <div className="col-span-1 flex flex-wrap justify-center gap-1">
                    {dish.cuisine && dish.cuisine.length > 0 ? (
                      dish.cuisine.map((type, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium border border-blue-100"
                        >
                          {type}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs">--</span>
                    )}
                  </div>

                  {/* Cột 3: Giá */}
                  <div className="col-span-1 font-medium text-gray-700">
                    {Number(dish.price).toLocaleString("vi-VN")}₫
                  </div>

                  {/* Cột 4: Đơn hàng */}
                  <div className="col-span-1 text-gray-600 font-semibold">
                    {dish.totalOrders || 0}
                  </div>

                  {/* Cột 5: Đánh giá */}
                  <div className="col-span-1 text-amber-500 font-bold flex justify-center items-center">
                    <Star size={14} className="fill-amber-500 mr-1" />
                    {dish.rating || 0}
                  </div>

                  {/* Cột 6: Trạng thái */}
                  <div className="col-span-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        isActive
                          ? "bg-green-100 text-green-600 border-green-200"
                          : "bg-red-100 text-red-600 border-red-200"
                      }`}
                    >
                      {isActive ? "Đang phục vụ" : "Ngừng bán"}
                    </span>
                  </div>

                  {/* Cột 7: Thao tác */}
                  <div className="col-span-1 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditDish(dish)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    {/* <button
                      onClick={() => handleDeleteDish(dish.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        title={editingDishId ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitDish}
          initialValues={{ status: true, numberOfPeople: 1 }}
        >
          <div className="grid grid-cols-2 gap-x-6">
            {/* Cột 1: Thông tin cơ bản */}
            <div>
              <Form.Item
                name="name"
                label="Tên món ăn"
                rules={[{ required: true }]}
              >
                <Input placeholder="Ví dụ: Spaghetti Carbonara" />
              </Form.Item>

              <Form.Item name="image" label="Link ảnh món ăn">
                <Input placeholder="http://.../image.jpg" />
              </Form.Item>

              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="w-full"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="₫"
                />
              </Form.Item>

              <Form.Item name="shortDescription" label="Mô tả ngắn">
                <Input placeholder="Khoảng 6-10 từ..." />
              </Form.Item>
            </div>

            {/* Cột 2: Thông số nấu nướng */}
            <div>
              <Form.Item
                name="cuisine"
                label="Loại ẩm thực"
                rules={[{ required: true }]}
              >
                <Select mode="multiple" placeholder="Chọn loại ẩm thực">
                  <Select.Option value="Món Việt">Món Việt</Select.Option>
                  <Select.Option value="Món Ý">Món Ý</Select.Option>
                  <Select.Option value="Món Âu">Món Âu</Select.Option>
                  <Select.Option value="Món Á">Món Á</Select.Option>
                  <Select.Option value="Healthy">Healthy</Select.Option>
                </Select>
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="cookTime" label="Thời gian nấu">
                  <Select placeholder="Chọn">
                    <Select.Option value="15 phút">15 phút</Select.Option>
                    <Select.Option value="30 phút">30 phút</Select.Option>
                    <Select.Option value="45 phút">45 phút</Select.Option>
                    <Select.Option value="60 phút">60 phút</Select.Option>
                  </Select>
                </Form.Item>

                {/* TRƯỜNG MỚI: SỐ NGƯỜI ĂN (DẠNG VĂN BẢN LINH HOẠT) */}
                <Form.Item
                  name="numPeople"
                  label="Số người ăn"
                  rules={[
                    { required: true },
                    {
                      pattern: /^[0-9-]+$/,
                      message: "Chỉ nhập số (VD: 2 hoặc 2-3)",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số người (VD: 2 hoặc 2-4)"
                    style={{ width: "100%" }}
                    onKeyPress={(event) => {
                      if (!/[0-9-]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="status"
                label="Trạng thái"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Đang phục vụ"
                  unCheckedChildren="Ngừng bán"
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item name="description" label="Mô tả chi tiết">
            <Input.TextArea
              rows={3}
              placeholder="Kể câu chuyện về món ăn của bạn..."
            />
          </Form.Item>

          <Divider />

          {/* PHẦN 1: NHẬP NGUYÊN LIỆU (DYNAMIC) */}
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Plus size={16} /> Nguyên liệu
          </h3>
          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Tên" }]}
                    >
                      <Input placeholder="Tên nguyên liệu" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "amount"]}
                      rules={[{ required: true, message: "Lượng" }]}
                    >
                      <InputNumber placeholder="Lượng" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "unit"]}
                      rules={[{ required: true, message: "Đơn vị" }]}
                    >
                      <Input
                        placeholder="g, ml, quả..."
                        style={{ width: 80 }}
                      />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "note"]}>
                      <Input placeholder="Ghi chú (tùy chọn)" />
                    </Form.Item>
                    <div className="h-8 flex items-center">
                      <Trash2 // Sử dụng Trash2 hoặc X từ lucide-react
                        size={18}
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => remove(name)}
                      />
                    </div>
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<Plus size={14} />}
                >
                  Thêm nguyên liệu
                </Button>
              </>
            )}
          </Form.List>

          <Divider />

          {/* PHẦN 2: NHẬP DINH DƯỠNG (DYNAMIC) */}
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Plus size={16} /> Thông tin dinh dưỡng
          </h3>
          <Form.List name="nutritions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 1 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Loại dinh dưỡng"
                        style={{ width: 150 }}
                      >
                        <Select.Option value="Calories">Calories</Select.Option>
                        <Select.Option value="Protein">Protein</Select.Option>
                        <Select.Option value="Carbs">Carbs</Select.Option>
                        <Select.Option value="Fat">Fat</Select.Option>
                        <Select.Option value="Vitamin">Vitamin</Select.Option>
                        <Select.Option value="Khoáng">Khoáng</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "amount"]}
                      rules={[{ required: true }]}
                    >
                      <InputNumber placeholder="Lượng" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "unit"]}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="kcal, g..." style={{ width: 80 }} />
                    </Form.Item>
                    <div className="h-8 flex items-center">
                      <Trash2 // Sử dụng Trash2 hoặc X từ lucide-react
                        size={18}
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => remove(name)}
                      />
                    </div>
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<Plus size={14} className="" />}
                >
                  Thêm thông số dinh dưỡng
                </Button>
              </>
            )}
          </Form.List>

          <div className="flex justify-end space-x-3 mt-10">
            <Button size="large" onClick={() => setIsModalVisible(false)}>
              Hủy
            </Button>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="bg-orange-500 hover:bg-orange-600 border-none"
            >
              Lưu món ăn
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DishManagement;
