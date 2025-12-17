import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button, Modal, Form, Input, Select, InputNumber } from 'antd';

const DishManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const dishes = [
    {
      id: 1,
      name: 'Homemade Pasta Carbonara',
      type: 'Ý',
      price: '120,000đ',
      orders: 45,
      rating: 4.9,
      status: 'Đang bán',
      chef: 'Maria Rodriguez',
    },
    {
      id: 2,
      name: 'Phở Bò Hà Nội',
      type: 'Việt Nam',
      price: '85,000đ',
      orders: 38,
      rating: 4.8,
      status: 'Đang bán',
      chef: 'Linh Nguyen',
    },
    {
      id: 3,
      name: 'Pizza Margherita',
      type: 'Ý',
      price: '95,000đ',
      orders: 12,
      rating: 4.5,
      status: 'Ngừng bán',
      chef: 'Mario Rossi',
    },
  ];

  const handleAddDish = (values) => {
    console.log('Add dish:', values);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quản lý món ăn (3)</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsModalVisible(true)}
        >
          Thêm món ăn
        </Button>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Món ăn</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Loại</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Giá</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Đơn hàng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Đánh giá</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{dish.name}</p>
                      <p className="text-sm text-gray-500">{dish.chef}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {dish.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium">{dish.price}</td>
                  <td className="py-4 px-4">{dish.orders}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{dish.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      dish.status === 'Đang bán'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {dish.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dish Modal */}
      <Modal
        title="Thêm món ăn mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDish}>
          <Form.Item
            name="name"
            label="Tên món ăn"
            rules={[{ required: true, message: 'Vui lòng nhập tên món ăn' }]}
          >
            <Input placeholder="Homemade Pasta Carbonara" />
          </Form.Item>
          
          <Form.Item
            name="chef"
            label="Đầu bếp"
            rules={[{ required: true, message: 'Vui lòng chọn đầu bếp' }]}
          >
            <Select placeholder="Chọn đầu bếp">
              <Select.Option value="maria">Maria Rodriguez</Select.Option>
              <Select.Option value="linh">Linh Nguyen</Select.Option>
              <Select.Option value="alex">Alex Thompson</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Loại món"
            rules={[{ required: true, message: 'Vui lòng chọn loại món' }]}
          >
            <Select placeholder="Chọn loại món">
              <Select.Option value="vietnam">Việt Nam</Select.Option>
              <Select.Option value="italian">Ý</Select.Option>
              <Select.Option value="european">Âu</Select.Option>
              <Select.Option value="asian">Á</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Giá (VND)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="120000"
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={4} placeholder="Mô tả món ăn..." />
          </Form.Item>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm món ăn
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DishManagement;