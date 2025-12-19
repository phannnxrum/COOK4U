import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, Minus } from "lucide-react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Divider,
} from "antd";
import axios from "axios";

const DishManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [form] = Form.useForm();
  let dishPlaceholder = "/cook4u/public/image/placeholder.png";

  // const dishes = [
  //   {
  //     id: 1,
  //     name: 'Homemade Pasta Carbonara',
  //     type: 'Ý',
  //     price: '120,000đ',
  //     orders: 45,
  //     rating: 4.9,
  //     status: 'Đang bán',
  //     chef: 'Maria Rodriguez',
  //   },
  //   {
  //     id: 2,
  //     name: 'Phở Bò Hà Nội',
  //     type: 'Việt Nam',
  //     price: '85,000đ',
  //     orders: 38,
  //     rating: 4.8,
  //     status: 'Đang bán',
  //     chef: 'Linh Nguyen',
  //   },
  //   {
  //     id: 3,
  //     name: 'Pizza Margherita',
  //     type: 'Ý',
  //     price: '95,000đ',
  //     orders: 12,
  //     rating: 4.5,
  //     status: 'Ngừng bán',
  //     chef: 'Mario Rossi',
  //   },
  // ];
  const getAllDishes = async () => {
    try {
      let res = await axios({
        url: `http://localhost:3000/api/dishes`,
        method: "GET",
      });
      console.log(res.data.data);
      setDishes(res.data.data);
    } catch (err) {
      console.log("Lỗi lấy tất cả đầu bếp", err);
      message.error("Không thể tải danh sách đầu bếp");
    }
  };

  useEffect(() => {
    getAllDishes();
  }, []);

  const handleAddDish = (values) => {
    console.log("Add dish:", values);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quản lý món ăn ({dishes.length})</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsModalVisible(true)}
        >
          Thêm món ăn
        </Button>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-t-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-10 bg-gray-50 px-4 py-3 text-center text-md font-semibold text-gray-600">
            <p className="col-span-3 text-left">Món ăn</p>
            <p>Loại</p>
            <p>Giá</p>
            <p>Đơn hàng</p>
            <p>Đánh giá</p>
            <p className="col-span-2">Trạng thái</p>
            <p>Thao tác</p>
          </div>
          {/* Dishes Table Content */}
          <div className="flex flex-col divide-y divide-gray-100 bg-white">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="grid grid-cols-10 self-center items-center px-4 py-4 hover:bg-gray-50 transition-colors text-center text-base"
              >
                {/* Cột Món ăn (Ảnh + Tên) */}
                <div className="col-span-3 flex items-center space-x-3 text-left">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img
                      src={dish?.image || dishPlaceholder}
                      alt={dish.name}
                      className="w-full h-full object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {dish.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dish.shortDescription?.substring(0, 30)}...
                    </p>
                  </div>
                </div>

                {/* Cột Loại (Cuisine Tags) */}
                <div className=" flex flex-wrap justify-center gap-1">
                  {dish.cuisine?.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium border border-blue-100"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* Cột Giá */}
                <div className="col-span-1 font-medium text-gray-700">
                  {Number(dish.price).toLocaleString("vi-VN")}₫
                </div>

                {/* Cột Đơn hàng */}
                <div className="col-span-1 text-gray-600 font-semibold">
                  {dish.totalOrders || 0}
                </div>

                {/* Cột Đánh giá */}
                <div className="col-span-1">
                  <div className="flex items-center justify-center text-amber-500 font-bold">
                    <Star size={14} className="fill-amber-500 mr-1" />
                    {dish.rating || 0}
                  </div>
                  <p className="text-sm text-gray-400">
                    ({dish.totalReviews || 0} lượt)
                  </p>
                </div>

                {/* Cột Trạng thái */}
                <div className="col-span-2">
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-bold ${
                      dish.status
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {dish.status ? "Đang phục vụ" : "Ngừng bán"}
                  </span>
                </div>

                {/* Cột Thao tác */}
                <div className="col-span-1 flex justify-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Dish Modal */}
      <Modal
        title={<span className="text-xl font-bold">Thêm món ăn mới</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800} // Tăng chiều rộng để đủ chỗ cho các nhóm input
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDish}
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

              <Form.Item
                name="shortDescription"
                label="Mô tả ngắn (Hiển thị ở Card)"
              >
                <Input placeholder="Khoảng 6-10 từ..." />
              </Form.Item>
            </div>

            {/* Cột 2: Thông số nấu nướng */}
            <div>
              <Form.Item
                name="cuisine"
                label="Loại ẩm thực (Chọn nhiều)"
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

                <Form.Item name="numberOfPeople" label="Số người ăn">
                  <InputNumber min={1} max={50} className="w-full" />
                </Form.Item>
              </div>

              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Select.Option value={true}>Đang phục vụ</Select.Option>
                  <Select.Option value={false}>Ngưng phục vụ</Select.Option>
                </Select>
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
            <Plus size={16} /> Nguyên liệu (Ingredients)
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
                    <Minus
                      className="text-red-500 cursor-pointer"
                      onClick={() => remove(name)}
                    />
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
            <Plus size={16} /> Thông tin dinh dưỡng (Nutrition)
          </h3>
          <Form.List name="nutritions">
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
                    <Minus
                      className="text-red-500 cursor-pointer"
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<Plus size={14} />}
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
