import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import { Button, Modal, Form, Input, Select, Rate } from 'antd';

const ChefManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const chefs = [
    {
      id: 1,
      initials: 'MR',
      name: 'Maria Rodriguez',
      email: 'maria@example.com',
      phone: '+84 123 456 789',
      experience: '6 năm',
      specialty: 'Món Ý',
      rating: 4.9,
      orders: 142,
      status: 'hoạt động',
    },
    {
      id: 2,
      initials: 'LN',
      name: 'Linh Nguyen',
      email: 'linh@example.com',
      phone: '+84 234 567 890',
      experience: '6 năm',
      specialty: 'Món Việt',
      rating: 4.8,
      orders: 98,
      status: 'hoạt động',
    },
    {
      id: 3,
      initials: 'AT',
      name: 'Alex Thompson',
      email: 'alex@example.com',
      phone: '+84 345 678 901',
      experience: '5 năm',
      specialty: 'Món Âu',
      rating: 4.4,
      orders: 45,
      status: 'ngừng hoạt động',
    },
  ];

  const handleAddChef = (values) => {
    console.log('Add chef:', values);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quản lý đầu bếp (3)</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsModalVisible(true)}
        >
          Thêm đầu bếp
        </Button>
      </div>

      {/* Chefs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Đầu bếp</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Liên hệ</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Kinh nghiệm</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Chuyên môn</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Đánh giá</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Đơn hàng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chefs.map((chef) => (
                <tr key={chef.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                        {chef.initials}
                      </div>
                      <div>
                        <p className="font-medium">{chef.name}</p>
                        <p className="text-sm text-gray-500">{chef.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-2 text-gray-400" />
                        {chef.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        {chef.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{chef.experience}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {chef.specialty}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Rate disabled defaultValue={chef.rating} allowHalf className="text-yellow-500" />
                      <span className="ml-2 font-medium">{chef.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">{chef.orders}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      chef.status === 'hoạt động'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {chef.status}
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

      {/* Add Chef Modal */}
      <Modal
        title="Thêm đầu bếp mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddChef}>
          <Form.Item
            name="name"
            label="Tên đầu bếp"
            rules={[{ required: true, message: 'Vui lòng nhập tên đầu bếp' }]}
          >
            <Input placeholder="Maria Rodriguez" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="maria@example.com" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="+84 123 456 789" />
          </Form.Item>
          
          <Form.Item
            name="experience"
            label="Kinh nghiệm"
            rules={[{ required: true, message: 'Vui lòng nhập kinh nghiệm' }]}
          >
            <Input placeholder="5 năm" />
          </Form.Item>
          
          <Form.Item
            name="specialty"
            label="Chuyên môn"
            rules={[{ required: true, message: 'Vui lòng chọn chuyên môn' }]}
          >
            <Select placeholder="Chọn chuyên môn">
              <Select.Option value="vietnam">Món Việt</Select.Option>
              <Select.Option value="italian">Món Ý</Select.Option>
              <Select.Option value="european">Món Âu</Select.Option>
              <Select.Option value="asian">Món Á</Select.Option>
            </Select>
          </Form.Item>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm đầu bếp
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ChefManagement;