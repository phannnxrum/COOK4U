import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail, Star } from 'lucide-react';
import { Button, Modal, Form, Input, Select, Rate } from 'antd';
import axios from 'axios';

const ChefManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [chefs, setChefs] = useState([]);

  const getAllChefs = async () => {
    try {
      let res = await axios({
        url: `http://localhost:3000/api/chefs`,
        method: "GET"
      })
      console.log(res.data.data);
      setChefs(res.data.data)
    }
    catch (err) {
      console.log("Lỗi lấy tất cả đầu bếp", err);
    }
  }

  useEffect(() => {
    getAllChefs();
  }, []);
  // const chefs = [
  //   {
  //     id: 1,
  //     initials: 'MR',
  //     name: 'Maria Rodriguez',
  //     email: 'maria@example.com',
  //     phone: '+84 123 456 789',
  //     experience: '6 năm',
  //     specialty: 'Món Ý',
  //     rating: 4.9,
  //     orders: 142,
  //     status: 'hoạt động',
  //   }
  // ];

  const handleAddChef = async (values) => {
    try {
      const formattedValues = {
        ...values,
        experience: Number(values.experience),
        cookTime: Number(values.cookTime),
        price: Number(values.price),
        rating: Number(values.rating),
        status: values.status === 1 ? true : false,
        valid: values.valid === 1 ? true : false,
        minDuration: values.minDuration ? Number(values.minDuration) : 1,
        avatar: values.avatar || null,
        // specialty và languages đã là mảng từ form
        specialty: values.specialty || [],
        languages: values.languages || [],
        // Xử lý certifications nếu vẫn là chuỗi
        certifications: values.certifications ? values.certifications.split(',').map(cert => cert.trim()) : []
      };

      console.log('Add chef data:', formattedValues);

      // Gọi API POST
      // await axios.post('http://localhost:3000/api/chefs', formattedValues);

      setIsModalVisible(false);
      form.resetFields();
      getAllChefs();
    } catch (error) {
      console.error('Error adding chef:', error);
    }
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
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chefs.map((chef) => (
                <tr key={chef.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold bg-blue-100 text-blue-600">
                        {chef.avatar ? (
                          <img
                            src={chef.avatar}
                            alt={chef.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          chef.name?.charAt(0) || 'C'
                        )}
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
                  <td className="py-4 px-4">{chef.experience} năm</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {chef.cuisine}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Star className="text-yellow-500" />
                      <span className="ml-2 font-medium">{chef.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${chef.status === 1
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                      }`}>
                      {chef.status ? 'Hoạt động' : 'Không hoạt động'}
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
  title={
    <div className="text-xl font-bold text-gray-800">
      Thêm đầu bếp mới
    </div>
  }
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  width={600}
  className="modal-custom"
>
  <Form form={form} layout="vertical" onFinish={handleAddChef}>
    <Form.Item
      name="name"
      label={<span className="font-semibold text-gray-700">Tên đầu bếp</span>}
      rules={[{ required: true, message: 'Vui lòng nhập tên đầu bếp' }]}
    >
      <Input 
        placeholder="Maria Rodriguez" 
        className="h-10"
      />
    </Form.Item>

    <Form.Item
      name="email"
      label={<span className="font-semibold text-gray-700">Email</span>}
      rules={[
        { required: true, message: 'Vui lòng nhập email' },
        { type: 'email', message: 'Email không hợp lệ' }
      ]}
    >
      <Input 
        placeholder="maria@example.com" 
        className="h-10"
      />
    </Form.Item>

    <Form.Item
      name="phone"
      label={<span className="font-semibold text-gray-700">Số điện thoại</span>}
      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
    >
      <Input 
        placeholder="+84 123 456 789" 
        className="h-10"
      />
    </Form.Item>

    <Form.Item
      name="avatar"
      label={<span className="font-semibold text-gray-700">Ảnh đại diện (URL)</span>}
      rules={[{ required: true, message: 'Vui lòng nhập URL ảnh đại diện' }]}
    >
      <Input 
        placeholder="https://example.com/avatar.jpg" 
        className="h-10"
      />
    </Form.Item>

    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        name="experience"
        label={<span className="font-semibold text-gray-700">Kinh nghiệm (năm)</span>}
        rules={[{ required: true, message: 'Vui lòng nhập kinh nghiệm' }]}
      >
        <Input 
          type="number" 
          min="0" 
          placeholder="5" 
          className="h-10"
        />
      </Form.Item>

      <Form.Item
        name="district"
        label={<span className="font-semibold text-gray-700">Quận/Huyện</span>}
        rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
      >
        <Input 
          placeholder="Quận 1, TP.HCM" 
          className="h-10"
        />
      </Form.Item>

      <Form.Item
        name="cookTime"
        label={<span className="font-semibold text-gray-700">Thời gian nấu (giờ)</span>}
        rules={[{ required: true, message: 'Vui lòng nhập thời gian nấu' }]}
      >
        <Input 
          type="number" 
          min="0" 
          placeholder="2" 
          className="h-10"
        />
      </Form.Item>

      <Form.Item
        name="price"
        label={<span className="font-semibold text-gray-700">Giá (VNĐ/bữa)</span>}
        rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
      >
        <Input 
          type="number" 
          min="0" 
          placeholder="500000" 
          className="h-10"
        />
      </Form.Item>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        name="status"
        label={<span className="font-semibold text-gray-700">Trạng thái</span>}
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select 
          placeholder="Chọn trạng thái"
          className="h-10"
        >
          <Select.Option value={1}>Hoạt động</Select.Option>
          <Select.Option value={0}>Không hoạt động</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="valid"
        label={<span className="font-semibold text-gray-700">Hiệu lực</span>}
      >
        <Select 
          placeholder="Chọn trạng thái hiệu lực"
          className="h-10"
        >
          <Select.Option value={1}>Đã chứng nhận</Select.Option>
          <Select.Option value={0}>Chưa chứng nhận</Select.Option>
        </Select>
      </Form.Item>
    </div>

    <Form.Item
      name="specialty"
      label={<span className="font-semibold text-gray-700">Chuyên môn</span>}
      rules={[{ required: true, message: 'Vui lòng chọn chuyên môn' }]}
    >
      <Select
        mode="multiple"
        placeholder="Chọn chuyên môn"
        allowClear
        className="h-auto min-h-[40px]"
      >
        <Select.Option value="vietnamese">Món Việt</Select.Option>
        <Select.Option value="italian">Món Ý</Select.Option>
        <Select.Option value="french">Món Pháp</Select.Option>
        <Select.Option value="japanese">Món Nhật</Select.Option>
        <Select.Option value="korean">Món Hàn</Select.Option>
        <Select.Option value="chinese">Món Trung</Select.Option>
        <Select.Option value="thai">Món Thái</Select.Option>
        <Select.Option value="american">Món Mỹ</Select.Option>
        <Select.Option value="mexican">Món Mexico</Select.Option>
        <Select.Option value="indian">Món Ấn Độ</Select.Option>
        <Select.Option value="vegetarian">Món chay</Select.Option>
        <Select.Option value="seafood">Hải sản</Select.Option>
        <Select.Option value="barbecue">BBQ/Nướng</Select.Option>
        <Select.Option value="dessert">Tráng miệng</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="description"
      label={<span className="font-semibold text-gray-700">Mô tả</span>}
    >
      <Input.TextArea 
        rows={2} 
        placeholder="Mô tả ngắn về đầu bếp..." 
        className="text-base"
      />
    </Form.Item>

    <Form.Item
      name="languages"
      label={<span className="font-semibold text-gray-700">Ngôn ngữ</span>}
    >
      <Select
        mode="multiple"
        placeholder="Chọn ngôn ngữ"
        allowClear
        className="h-auto min-h-[40px]"
      >
        <Select.Option value="vietnamese">Tiếng Việt</Select.Option>
        <Select.Option value="english">Tiếng Anh</Select.Option>
        <Select.Option value="french">Tiếng Pháp</Select.Option>
        <Select.Option value="japanese">Tiếng Nhật</Select.Option>
        <Select.Option value="korean">Tiếng Hàn</Select.Option>
        <Select.Option value="chinese">Tiếng Trung</Select.Option>
        <Select.Option value="spanish">Tiếng Tây Ban Nha</Select.Option>
        <Select.Option value="german">Tiếng Đức</Select.Option>
        <Select.Option value="russian">Tiếng Nga</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="certifications"
      label={<span className="font-semibold text-gray-700">Chứng chỉ (cách nhau bằng dấu phẩy)</span>}
    >
      <Input 
        placeholder="Chứng chỉ ẩm thực quốc tế, Chứng chỉ vệ sinh an toàn thực phẩm" 
        className="h-10"
      />
    </Form.Item>

    <Form.Item
      name="serviceDetails"
      label={<span className="font-semibold text-gray-700">Chi tiết dịch vụ</span>}
    >
      <Input.TextArea 
        rows={3} 
        placeholder="Chi tiết về các dịch vụ cung cấp..." 
        className="text-base"
      />
    </Form.Item>

    <Form.Item
      name="minDuration"
      label={<span className="font-semibold text-gray-700">Thời gian tối thiểu (giờ)</span>}
    >
      <Input 
        type="number" 
        min="0" 
        placeholder="1" 
        className="h-10"
      />
    </Form.Item>

    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
      <Button 
        onClick={() => setIsModalVisible(false)}
        className="h-10 px-6 font-medium"
      >
        Hủy
      </Button>
      <Button 
        type="primary" 
        htmlType="submit"
        className="h-10 px-6 font-medium"
      >
        Thêm đầu bếp
      </Button>
    </div>
  </Form>
</Modal>
    </div>
  );
};

export default ChefManagement;