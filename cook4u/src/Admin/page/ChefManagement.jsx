import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail, Star, Coins } from 'lucide-react';
import { Button, Modal, Form, Input, Select, Rate, message, Spin } from 'antd';
import axios from 'axios';

const ChefManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingChef, setEditingChef] = useState(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const getAllChefs = async () => {
    try {
      setLoading(true);
      const res = await axios({
        url: `http://localhost:3000/api/chefs`,
        method: "GET"
      });
      
      const chefsData = res.data.data || [];
      console.log("Chefs list data:", chefsData);
      
      setChefs(Array.isArray(chefsData) ? chefsData : []);
    } catch (err) {
      console.log("Lỗi lấy tất cả đầu bếp", err);
      message.error('Không thể tải danh sách đầu bếp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllChefs();
  }, []);

  const handleAddChef = async (values) => {
    try {
      setLoading(true);
      const chefData = {
        chefname: values.name,
        email: values.email,
        phonenumber: values.phone,
        avturl: values.avatar || '',
        expyear: Number(values.experience),
        chefarea: values.district,
        cheftime: `${values.cookTime}`,
        priceperhour: Number(values.price),
        chefstatus: values.status === 1 ? 1 : 0,
        valid: values.valid === "Đã chứng nhận" ? "Đã chứng nhận" : "Chưa chứng nhận",
        cuisine: values.specialty || [],
        descr: values.description || '',
        languages: values.languages || [],
        certifications: values.certifications ? 
          values.certifications.split(',').map(cert => cert.trim()) : [],
        serviceDetails: {
          includes: values.serviceIncludes || []
        },
        minhour: values.minDuration || 1
      };

      console.log('Adding chef data:', chefData);
      
      const response = await axios.post('http://localhost:3000/api/chefs', chefData);
      
      if (response.status === 201) {
        message.success('Thêm đầu bếp thành công');
        setIsModalVisible(false);
        addForm.resetFields();
        await getAllChefs(); // Reload danh sách
      }
    } catch (error) {
      console.error('Error adding chef:', error);
      message.error(`Thêm đầu bếp thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChef = async (chefId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/chefs/${chefId}`);
      const chef = response.data.data;
      
      if (!chef) {
        message.error('Không tìm thấy thông tin đầu bếp');
        return;
      }

      setEditingChef({ ...chef, id: chefId });

      // Xử lý price
      let priceValue = 0;
      if (chef.price) {
        const priceStr = String(chef.price || '0');
        priceValue = parseInt(priceStr.replace(/[^\d]/g, '')) || 0;
      }

      // Xử lý cookTime
      let cookTimeValue = 2;
      if (chef.cookTime) {
        const timeMatch = chef.cookTime.match(/\d+/);
        cookTimeValue = timeMatch ? parseInt(timeMatch[0]) : 2;
      }

      // Xử lý minDuration
      let minDurationValue = 1;
      if (chef.serviceDetails?.minDuration) {
        const durationMatch = chef.serviceDetails.minDuration.match(/\d+/);
        minDurationValue = durationMatch ? parseInt(durationMatch[0]) : 1;
      }

      // Xử lý valid
      let validValue = "Chưa chứng nhận";
      if (chef.valid === 'Đã chứng nhận') {
        validValue = "Đã chứng nhận";
      }

      // Xử lý languages mapping
      const mapLanguageToFormValue = (lang) => {
        const languageMap = {
          'Anh': 'english',
          'Việt': 'vietnamese',
          'Ý': 'italian',
          'Pháp': 'french',
          'Nhật': 'japanese',
          'Hàn': 'korean',
          'Trung': 'chinese',
          'Tây Ban Nha': 'spanish',
          'Đức': 'german',
          'Nga': 'russian'
        };
        return languageMap[lang] || lang.toLowerCase();
      };

      const languagesValue = chef.languages ? 
        chef.languages.map(mapLanguageToFormValue) : [];

      // Xử lý cuisine
      let cuisineArray = [];
      if (Array.isArray(chef.cuisine)) {
        cuisineArray = chef.cuisine;
      }

      // Map dữ liệu
      editForm.setFieldsValue({
        name: chef.name || '',
        email: chef.email || '',
        phone: chef.phone || '',
        avatar: chef.avatar || '',
        experience: chef.yearNum || 0,
        district: chef.district || '',
        cookTime: cookTimeValue,
        price: priceValue,
        status: chef.status || 0,
        valid: validValue,
        specialty: cuisineArray,
        description: chef.description || '',
        languages: languagesValue,
        certifications: chef.certifications ? 
          (Array.isArray(chef.certifications) ? chef.certifications.join(', ') : chef.certifications) : '',
        serviceIncludes: chef.serviceDetails?.includes || [],
        minDuration: minDurationValue
      });

      setIsEditModalVisible(true);
    } catch (error) {
      console.error('Error loading chef data:', error);
      message.error('Lỗi khi tải thông tin đầu bếp');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChef = async (values) => {
  if (!editingChef) return;
  
  try {
    setUpdating(true);
    
    // Map ngôn ngữ
    const mapLanguageToDisplay = (lang) => {
      const languageDisplayMap = {
        'english': 'Anh',
        'vietnamese': 'Việt',
        'italian': 'Ý',
        'french': 'Pháp',
        'japanese': 'Nhật',
        'korean': 'Hàn',
        'chinese': 'Trung',
        'spanish': 'Tây Ban Nha',
        'german': 'Đức',
        'russian': 'Nga'
      };
      return languageDisplayMap[lang] || lang;
    };

    // 1. Cập nhật thông tin chính của chef
    let cookTimeDisplay = `${values.cookTime}`;
    if (values.cookTime < 3) {
      cookTimeDisplay = `${values.cookTime}-${values.cookTime + 1} tiếng`;
    } else {
      cookTimeDisplay = `${values.cookTime} tiếng`;
    }

    const updateData = {
      chefname: values.name,
      email: values.email,
      phonenumber: values.phone,
      avturl: values.avatar || '',
      expyear: Number(values.experience),
      chefarea: values.district,
      cheftime: cookTimeDisplay,
      priceperhour: Number(values.price),
      chefstatus: values.status,
      valid: values.valid, 
      descr: values.description || '',
      minhour: values.minDuration || 1
    };

    console.log('1. Updating chef basic info:', updateData);
    
    // Gọi API chính để cập nhật thông tin cơ bản
    await axios.patch(
      `http://localhost:3000/api/chefs/${editingChef.id}`,
      updateData
    );
    console.log('✓ Updated basic info');

    // 2. Cập nhật cuisine types - FIX: Dùng CUISINETYPE thay vì CUISINE
    if (values.specialty && values.specialty.length > 0) {
      console.log('2. Updating cuisine:', values.specialty);
      await axios.patch(
        `http://localhost:3000/api/chefs/${editingChef.id}/cuisine-types`,
        { cuisine: values.specialty } // Gửi array trực tiếp
      );
      console.log('✓ Updated cuisine');
    } else {
      // Nếu xóa hết chuyên môn thì xóa tất cả
      await axios.patch(
        `http://localhost:3000/api/chefs/${editingChef.id}/cuisine-types`,
        { cuisine: [] }
      );
    }

    // 3. Cập nhật languages - Đảm bảo API nhận đúng format
    if (values.languages && values.languages.length > 0) {
      const displayLanguages = values.languages.map(mapLanguageToDisplay);
      console.log('3. Updating languages:', displayLanguages);
      await axios.patch(
        `http://localhost:3000/api/chefs/${editingChef.id}/languages`,
        { languages: displayLanguages }
      );
      console.log('✓ Updated languages');
    } else {
      await axios.patch(
        `http://localhost:3000/api/chefs/${editingChef.id}/languages`,
        { languages: [] }
      );
    }

    // 4. Cập nhật certifications - Kiểm tra API có nhận array không
    if (values.certifications && values.certifications.trim()) {
      const certsArray = values.certifications.split(',').map(cert => cert.trim()).filter(cert => cert);
      console.log('4. Updating certifications:', certsArray);
      await axios.patch(
        `http://localhost:3000/api/chefs/${editingChef.id}/certifications`,
        { certifications: certsArray }
      );
      console.log('✓ Updated certifications');
    } else {
      await axios.patch(
        `http://localhost:3000/api/chefs/${editingChef.id}/certifications`,
        { certifications: [] }
      );
    }

    // 5. Cập nhật service details - Kiểm tra API có nhận array không
    if (values.serviceIncludes && values.serviceIncludes.length > 0) {
      console.log('5. Updating service details:', values.serviceIncludes);
      await axios.patch(
        `http://localhost:3000/api/chefs/${editingChef.id}/services-details`,
        { serviceDetails: values.serviceIncludes }
      );
      console.log('✓ Updated service details');
    } else {
      await axios.patch(
        `http://localhost:3000/api/chefs/${editingChef.id}/services-details`,
        { serviceDetails: [] }
      );
    }

    message.success('Cập nhật đầu bếp thành công');
    
    // Đóng modal và reset
    setIsEditModalVisible(false);
    setEditingChef(null);
    editForm.resetFields();
    
    // Reload danh sách chefs
    await getAllChefs();
    
  } catch (error) {
    console.error('Error updating chef:', error);
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      data: error.config?.data
    });
    
    // Hiển thị lỗi chi tiết hơn
    if (error.response?.data?.error) {
      message.error(`Lỗi: ${error.response.data.error}`);
    } else {
      message.error(`Cập nhật thất bại: ${error.message}`);
    }
  } finally {
    setUpdating(false);
  }
};

  const handleDeleteChef = async (chefId) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa đầu bếp này?')) {
        setLoading(true);
        // await axios.delete(`http://localhost:3000/api/chefs/${chefId}`);
        message.success('Xóa đầu bếp thành công');
        await getAllChefs();
      }
    } catch (error) {
      console.error('Error deleting chef:', error);
      message.error('Xóa đầu bếp thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy giá trị chính xác từ chef
  const getChefValue = (chef, key) => {
    if (key === 'experience') {
      return chef.experience !== undefined ? chef.experience : (chef.yearNum || 0);
    }
    
    if (key === 'cuisine') {
      if (Array.isArray(chef.cuisine)) {
        return chef.cuisine;
      } else if (typeof chef.cuisine === 'string') {
        return chef.cuisine.split(',').map(item => item.trim());
      }
      return [];
    }
    
    return chef[key] || '';
  };

  // Hàm format price
  const formatPrice = (priceString) => {
    if (!priceString && priceString !== '0') return '0';
    
    if (typeof priceString === 'string' && priceString.includes(',')) {
      return priceString;
    }
    
    const priceNum = parseInt(priceString) || 0;
    return priceNum.toLocaleString('vi-VN');
  };

  // Hàm render cho bảng chefs
  const renderChefsTable = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="py-8 text-center">
            <Spin size="large" />
          </td>
        </tr>
      );
    }

    if (!Array.isArray(chefs) || chefs.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="py-8 text-center text-gray-500">
            Không có đầu bếp nào
          </td>
        </tr>
      );
    }

    return chefs.map((chef) => {
      const chefName = chef.name || '';
      const chefEmail = chef.email || '';
      const chefAvatar = chef.avatar || '';
      const chefPhone = chef.phone || '';
      const experience = getChefValue(chef, 'experience');
      const price = chef.price || '0';
      const status = chef.status || 0;
      const cuisineArray = getChefValue(chef, 'cuisine');
      const rating = chef.rating || '0.0';

      return (
        <tr key={chef.id} className="hover:bg-gray-50">
          <td className="py-4 px-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold bg-blue-100 text-blue-600 overflow-hidden">
                {chefAvatar ? (
                  <img
                    src={chefAvatar}
                    alt={chefName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (chefName || 'C').charAt(0)
                )}
              </div>
              <div>
                <p className="font-medium">{chefName}</p>
                <p className="text-sm text-gray-500">{chefEmail}</p>
              </div>
            </div>
          </td>
          <td className="py-4 px-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Phone size={14} className="mr-2 text-gray-400" />
                {chefPhone || 'Chưa có'}
              </div>
              <div className="flex items-center text-sm">
                <Mail size={14} className="mr-2 text-gray-400" />
                {chefEmail}
              </div>
            </div>
          </td>
          <td className="py-4 px-4">{experience} năm</td>
          <td className="py-4 px-4">
            {cuisineArray.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {cuisineArray.slice(0, 2).map((cuisine, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                    {cuisine}
                  </span>
                ))}
                {cuisineArray.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{cuisineArray.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Chưa có</span>
            )}
          </td>
          <td className="py-4 px-4">
            <div className="flex items-center">
              <Coins className="text-yellow-500" />
              <span className="ml-2 font-medium">{price}</span>
            </div>
          </td>
          <td className="py-4 px-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              status === 1 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {status === 1 ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </td>
          <td className="py-4 px-4">
            <div className="flex space-x-2">
              <button
                className="p-2 text-blue-600 hover:bg-blue-200 cursor-pointer rounded-lg"
                onClick={() => handleEditChef(chef.id)}
                disabled={loading}
              >
                <Edit2 size={20} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quản lý đầu bếp ({Array.isArray(chefs) ? chefs.length : 0})</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsModalVisible(true)}
          loading={loading}
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
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Giá (VNĐ/giờ)</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {renderChefsTable()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Chef Modal */}
      <Modal
        title={<div className="text-xl font-bold text-gray-800">Thêm đầu bếp mới</div>}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          addForm.resetFields();
        }}
        footer={null}
        width={600}
        className="modal-custom"
        confirmLoading={loading}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddChef}>
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
              placeholder="123456789"
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
              label={<span className="font-semibold text-gray-700">Giá (VNĐ/giờ)</span>}
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
                <Select.Option value="Đã chứng nhận">Đã chứng nhận</Select.Option>
                <Select.Option value="Chưa chứng nhận">Chưa chứng nhận</Select.Option>
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
              <Select.Option value="Fine Dining">Fine Dining</Select.Option>
              <Select.Option value="Món Âu">Món Âu</Select.Option>
              <Select.Option value="Món Ý">Món Ý</Select.Option>
              <Select.Option value="Hải Sản">Hải Sản</Select.Option>
              <Select.Option value="Món Á">Món Á</Select.Option>
              <Select.Option value="Món Việt">Món Việt</Select.Option>
              <Select.Option value="Healthy">Healthy</Select.Option>
              <Select.Option value="Món Nhật">Món Nhật</Select.Option>
              <Select.Option value="Sushi">Sushi</Select.Option>
              <Select.Option value="Đồ Nướng">Đồ Nướng</Select.Option>
              <Select.Option value="Món Cay">Món Cay</Select.Option>
              <Select.Option value="Món Hàn">Món Hàn</Select.Option>
              <Select.Option value="Món Pháp">Món Pháp</Select.Option>
              <Select.Option value="Steak">Steak</Select.Option>
              <Select.Option value="BBQ">BBQ</Select.Option>
              <Select.Option value="Latin">Latin</Select.Option>
              <Select.Option value="Món Mexico">Món Mexico</Select.Option>
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
            name="serviceIncludes"
            label={<span className="font-semibold text-gray-700">Dịch vụ bao gồm</span>}
          >
            <Select
              mode="multiple"
              placeholder="Chọn dịch vụ"
              allowClear
              className="h-auto min-h-[40px]"
            >
              <Select.Option value="Dọn dẹp bếp">Dọn dẹp bếp</Select.Option>
              <Select.Option value="Đi chợ hộ">Đi chợ hộ</Select.Option>
              <Select.Option value="Tư vấn thực đơn">Tư vấn thực đơn</Select.Option>
              <Select.Option value="Chuẩn bị nguyên liệu">Chuẩn bị nguyên liệu</Select.Option>
              <Select.Option value="Hướng dẫn nấu ăn">Hướng dẫn nấu ăn</Select.Option>
              <Select.Option value="Phục vụ tại bàn">Phục vụ tại bàn</Select.Option>
              <Select.Option value="Trang trí món ăn">Trang trí món ăn</Select.Option>
              <Select.Option value="Dọn dẹp sau bữa ăn">Dọn dẹp sau bữa ăn</Select.Option>
              <Select.Option value="Tổ chức tiệc">Tổ chức tiệc</Select.Option>
              <Select.Option value="Nấu ăn theo yêu cầu">Nấu ăn theo yêu cầu</Select.Option>
              <Select.Option value="Dịch vụ giao tận nơi">Dịch vụ giao tận nơi</Select.Option>
              <Select.Option value="Dạy nấu ăn">Dạy nấu ăn</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="minDuration"
            label={<span className="font-semibold text-gray-700">Thời gian tối thiểu (giờ)</span>}
          >
            <Input
              type="number"
              min="1"
              step="0.5"
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

      {/* Edit Chef Modal */}
      <Modal
        title={<div className="text-xl font-bold text-gray-800">Chỉnh sửa đầu bếp</div>}
        open={isEditModalVisible}
        onCancel={() => {
          if (!updating) {
            setIsEditModalVisible(false);
            setEditingChef(null);
            editForm.resetFields();
          }
        }}
        footer={null}
        width={600}
        className="modal-custom"
        forceRender
        confirmLoading={updating}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateChef}>
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Tên đầu bếp</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên đầu bếp' }]}
          >
            <Input placeholder="Maria Rodriguez" className="h-10" disabled={updating} />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="font-semibold text-gray-700">Email</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="maria@example.com" className="h-10" disabled={updating} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="font-semibold text-gray-700">Số điện thoại</span>}
          >
            <Input placeholder="123456789" className="h-10" disabled={updating} />
          </Form.Item>

          <Form.Item
            name="avatar"
            label={<span className="font-semibold text-gray-700">Ảnh đại diện (URL)</span>}
          >
            <Input placeholder="https://example.com/avatar.jpg" className="h-10" disabled={updating} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="experience"
              label={<span className="font-semibold text-gray-700">Kinh nghiệm (năm)</span>}
            >
              <Input type="number" min="0" placeholder="5" className="h-10" disabled={updating} />
            </Form.Item>

            <Form.Item
              name="district"
              label={<span className="font-semibold text-gray-700">Quận/Huyện</span>}
            >
              <Input placeholder="Quận 1, TP.HCM" className="h-10" disabled={updating} />
            </Form.Item>

            <Form.Item
              name="cookTime"
              label={<span className="font-semibold text-gray-700">Thời gian nấu (giờ)</span>}
            >
              <Input type="number" min="0" placeholder="2" className="h-10" disabled={updating} />
            </Form.Item>

            <Form.Item
              name="price"
              label={<span className="font-semibold text-gray-700">Giá (VNĐ/bữa)</span>}
            >
              <Input type="number" min="0" placeholder="500000" className="h-10" disabled={updating} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="status"
              label={<span className="font-semibold text-gray-700">Trạng thái</span>}
            >
              <Select placeholder="Chọn trạng thái" className="h-10" disabled={updating}>
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Không hoạt động</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="valid"
              label={<span className="font-semibold text-gray-700">Hiệu lực</span>}
            >
              <Select placeholder="Chọn trạng thái hiệu lực" className="h-10" disabled={updating}>
                <Select.Option value="Đã chứng nhận">Đã chứng nhận</Select.Option>
                <Select.Option value="Chưa chứng nhận">Chưa chứng nhận</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="specialty"
            label={<span className="font-semibold text-gray-700">Chuyên môn</span>}
          >
            <Select
              mode="multiple"
              placeholder="Chọn chuyên môn"
              allowClear
              className="h-auto min-h-[40px]"
              disabled={updating}
            >
              <Select.Option value="Fine Dining">Fine Dining</Select.Option>
              <Select.Option value="Món Âu">Món Âu</Select.Option>
              <Select.Option value="Món Ý">Món Ý</Select.Option>
              <Select.Option value="Hải Sản">Hải Sản</Select.Option>
              <Select.Option value="Món Á">Món Á</Select.Option>
              <Select.Option value="Món Việt">Món Việt</Select.Option>
              <Select.Option value="Healthy">Healthy</Select.Option>
              <Select.Option value="Món Nhật">Món Nhật</Select.Option>
              <Select.Option value="Sushi">Sushi</Select.Option>
              <Select.Option value="Đồ Nướng">Đồ Nướng</Select.Option>
              <Select.Option value="Món Cay">Món Cay</Select.Option>
              <Select.Option value="Món Hàn">Món Hàn</Select.Option>
              <Select.Option value="Món Pháp">Món Pháp</Select.Option>
              <Select.Option value="Steak">Steak</Select.Option>
              <Select.Option value="BBQ">BBQ</Select.Option>
              <Select.Option value="Latin">Latin</Select.Option>
              <Select.Option value="Món Mexico">Món Mexico</Select.Option>
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
              disabled={updating}
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
              disabled={updating}
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
              disabled={updating}
            />
          </Form.Item>

          <Form.Item
            name="serviceIncludes"
            label={<span className="font-semibold text-gray-700">Dịch vụ bao gồm</span>}
          >
            <Select
              mode="multiple"
              placeholder="Chọn dịch vụ"
              allowClear
              className="h-auto min-h-[40px]"
              disabled={updating}
            >
              <Select.Option value="Dọn dẹp bếp">Dọn dẹp bếp</Select.Option>
              <Select.Option value="Đi chợ hộ">Đi chợ hộ</Select.Option>
              <Select.Option value="Tư vấn thực đơn">Tư vấn thực đơn</Select.Option>
              <Select.Option value="Chuẩn bị nguyên liệu">Chuẩn bị nguyên liệu</Select.Option>
              <Select.Option value="Hướng dẫn nấu ăn">Hướng dẫn nấu ăn</Select.Option>
              <Select.Option value="Phục vụ tại bàn">Phục vụ tại bàn</Select.Option>
              <Select.Option value="Trang trí món ăn">Trang trí món ăn</Select.Option>
              <Select.Option value="Dọn dẹp sau bữa ăn">Dọn dẹp sau bữa ăn</Select.Option>
              <Select.Option value="Tổ chức tiệc">Tổ chức tiệc</Select.Option>
              <Select.Option value="Nấu ăn theo yêu cầu">Nấu ăn theo yêu cầu</Select.Option>
              <Select.Option value="Dịch vụ giao tận nơi">Dịch vụ giao tận nơi</Select.Option>
              <Select.Option value="Dạy nấu ăn">Dạy nấu ăn</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="minDuration"
            label={<span className="font-semibold text-gray-700">Thời gian tối thiểu (giờ)</span>}
          >
            <Input type="number" min="0" placeholder="1" className="h-10" disabled={updating} />
          </Form.Item>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setIsEditModalVisible(false);
                setEditingChef(null);
                editForm.resetFields();
              }}
              className="h-10 px-6 font-medium"
              disabled={updating}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="h-10 px-6 font-medium"
              loading={updating}
            >
              {updating ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ChefManagement;