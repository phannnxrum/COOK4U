import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Phone, Mail, Star } from "lucide-react";
import { Button, Modal, Form, Input, Select, Rate, message } from "antd";
import axios from "axios";

const ChefManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingChef, setEditingChef] = useState(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [chefs, setChefs] = useState([]);

  const getAllChefs = async () => {
    try {
      let res = await axios({
        url: `http://localhost:3000/api/chefs`,
        method: "GET",
      });
      console.log(res.data.data);
      setChefs(res.data.data);
    } catch (err) {
      console.log("Lỗi lấy tất cả đầu bếp", err);
      message.error("Không thể tải danh sách đầu bếp");
    }
  };

  useEffect(() => {
    getAllChefs();
  }, []);

  const handleAddChef = async (values) => {
    try {
      // Xử lý serviceDetails
      const serviceDetails = {
        includes: values.serviceIncludes || [],
        minDuration: `${values.minDuration || 1} tiếng`,
      };

      const formattedValues = {
        ...values,
        experience: Number(values.experience),
        cookTime: Number(values.cookTime),
        price: Number(values.price),
        rating: Number(values.rating) || 0,
        status: values.status === 1 ? true : false,
        valid: values.valid === 1 ? "Đã chứng nhận" : "Chưa chứng nhận",
        minDuration: values.minDuration ? Number(values.minDuration) : 1,
        avatar: values.avatar || null,
        specialty: values.specialty || [],
        languages: values.languages || [],
        certifications: values.certifications
          ? values.certifications.split(",").map((cert) => cert.trim())
          : [],
        serviceDetails: serviceDetails,
      };

      console.log("Add chef data:", formattedValues);
      // await axios.post('http://localhost:3000/api/chefs', formattedValues);

      message.success("Thêm đầu bếp thành công");
      setIsModalVisible(false);
      addForm.resetFields();
      getAllChefs();
    } catch (error) {
      console.error("Error adding chef:", error);
      message.error("Thêm đầu bếp thất bại");
    }
  };

  const handleEditChef = async (chefId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/chefs/${chefId}`
      );
      const chef = response.data.data;

      if (!chef) {
        message.error("Không tìm thấy thông tin đầu bếp");
        return;
      }

      setEditingChef(chef);

      // Xử lý dữ liệu
      const priceValue = chef.price
        ? parseInt(chef.price.replace(/,/g, ""))
        : 0;
      const cookTimeMatch = chef.cookTime?.match(/\d+/);
      const cookTimeValue = cookTimeMatch ? parseInt(cookTimeMatch[0]) : 2;
      const validValue = chef.valid === "Đã chứng nhận" ? 1 : 0;
      const statusValue = chef.status === true || chef.status === 1 ? 1 : 0;

      // Xử lý serviceDetails
      const minDurationMatch = chef.serviceDetails?.minDuration?.match(/\d+/);
      const minDurationValue = minDurationMatch
        ? parseInt(minDurationMatch[0])
        : 1;

      // Map ngôn ngữ
      const mapLanguage = (lang) => {
        const languageMap = {
          Anh: "english",
          Việt: "vietnamese",
          Ý: "italian",
          Pháp: "french",
          Nhật: "japanese",
          Hàn: "korean",
          Trung: "chinese",
          "Tây Ban Nha": "spanish",
          Đức: "german",
          Nga: "russian",
        };
        return languageMap[lang] || lang.toLowerCase();
      };

      const languagesValue = chef.languages?.map(mapLanguage) || [];

      // Điền dữ liệu vào form
      editForm.setFieldsValue({
        name: chef.name || "",
        email: chef.email || "",
        phone: chef.phone || "",
        avatar: chef.avatar || "",
        experience: chef.yearNum || 0,
        district: chef.district || "",
        cookTime: cookTimeValue,
        price: priceValue,
        status: statusValue,
        valid: validValue,
        specialty: chef.cuisine || [],
        description: chef.description || "",
        bio: chef.bio || "",
        languages: languagesValue,
        certifications: chef.certifications
          ? chef.certifications.join(", ")
          : "",
        serviceIncludes: chef.serviceDetails?.includes || [],
        minDuration: minDurationValue,
      });

      setIsEditModalVisible(true);
    } catch (error) {
      console.error("Error loading chef data:", error);
      message.error("Lỗi khi tải thông tin đầu bếp");
    }
  };

  const handleUpdateChef = async (values) => {
    try {
      // Xử lý serviceDetails
      const serviceDetails = {
        includes: values.serviceIncludes || [],
        minDuration: `${values.minDuration || 1} tiếng`,
      };

      const updateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: values.avatar || null,
        yearNum: Number(values.experience),
        district: values.district,
        cookTime: `${values.cookTime} giờ`,
        price: values.price.toLocaleString(),
        valid: values.valid === 1 ? "Đã chứng nhận" : "Chưa chứng nhận",
        description: values.description,
        bio: values.bio,
        cuisine: values.specialty,
        languages:
          values.languages?.map((lang) => {
            const languageDisplay = {
              english: "Anh",
              vietnamese: "Việt",
              italian: "Ý",
              french: "Pháp",
              japanese: "Nhật",
              korean: "Hàn",
              chinese: "Trung",
              spanish: "Tây Ban Nha",
              german: "Đức",
              russian: "Nga",
            };
            return languageDisplay[lang] || lang;
          }) || [],
        certifications: values.certifications
          ? values.certifications.split(",").map((cert) => cert.trim())
          : [],
        serviceDetails: serviceDetails,
      };

      console.log("Update chef data:", updateData);
      // await axios.put(`http://localhost:3000/api/chefs/${editingChef.id}`, updateData);

      message.success("Cập nhật đầu bếp thành công");
      setIsEditModalVisible(false);
      setEditingChef(null);
      editForm.resetFields();
      getAllChefs();
    } catch (error) {
      console.error("Error updating chef:", error);
      message.error("Cập nhật đầu bếp thất bại");
    }
  };

  const handleDeleteChef = async (chefId) => {
    try {
      if (window.confirm("Bạn có chắc chắn muốn xóa đầu bếp này?")) {
        // await axios.delete(`http://localhost:3000/api/chefs/${chefId}`);
        message.success("Xóa đầu bếp thành công");
        getAllChefs();
      }
    } catch (error) {
      console.error("Error deleting chef:", error);
      message.error("Xóa đầu bếp thất bại");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quản lý đầu bếp ({chefs.length})</h2>
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
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Đầu bếp
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Liên hệ
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Kinh nghiệm
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Chuyên môn
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Đánh giá
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Thao tác
                </th>
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
                          chef.name?.charAt(0) || "C"
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
                        {chef.phone || "Chưa có"}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        {chef.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{chef.experience || 0} năm</td>
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
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        chef.status === true || chef.status === 1
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {chef.status === true || chef.status === 1
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-200 cursor-pointer rounded-lg"
                        onClick={() => handleEditChef(chef.id)}
                      >
                        <Edit2 size={20} />
                      </button>
                      {/* <button
                        className="p-2 text-red-600 hover:bg-red-200   cursor-pointer rounded-lg"
                        onClick={() => handleDeleteChef(chef.id)}
                      >
                        <Trash2 size={16} />
                      </button> */}
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
        onCancel={() => {
          setIsModalVisible(false);
          addForm.resetFields();
        }}
        footer={null}
        width={600}
        className="modal-custom"
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddChef}>
          <Form.Item
            name="name"
            label={
              <span className="font-semibold text-gray-700">Tên đầu bếp</span>
            }
            rules={[{ required: true, message: "Vui lòng nhập tên đầu bếp" }]}
          >
            <Input placeholder="Maria Rodriguez" className="h-10" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="font-semibold text-gray-700">Email</span>}
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="maria@example.com" className="h-10" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span className="font-semibold text-gray-700">Số điện thoại</span>
            }
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="+84 123 456 789" className="h-10" />
          </Form.Item>

          <Form.Item
            name="avatar"
            label={
              <span className="font-semibold text-gray-700">
                Ảnh đại diện (URL)
              </span>
            }
            rules={[
              { required: true, message: "Vui lòng nhập URL ảnh đại diện" },
            ]}
          >
            <Input
              placeholder="https://example.com/avatar.jpg"
              className="h-10"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="experience"
              label={
                <span className="font-semibold text-gray-700">
                  Kinh nghiệm (năm)
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập kinh nghiệm" }]}
            >
              <Input type="number" min="0" placeholder="5" className="h-10" />
            </Form.Item>

            <Form.Item
              name="district"
              label={
                <span className="font-semibold text-gray-700">Quận/Huyện</span>
              }
              rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
            >
              <Input placeholder="Quận 1, TP.HCM" className="h-10" />
            </Form.Item>

            <Form.Item
              name="cookTime"
              label={
                <span className="font-semibold text-gray-700">
                  Thời gian nấu (giờ)
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập thời gian nấu" },
              ]}
            >
              <Input type="number" min="0" placeholder="2" className="h-10" />
            </Form.Item>

            <Form.Item
              name="price"
              label={
                <span className="font-semibold text-gray-700">
                  Giá (VNĐ/bữa)
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
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
              label={
                <span className="font-semibold text-gray-700">Trạng thái</span>
              }
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái" className="h-10">
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Không hoạt động</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="valid"
              label={
                <span className="font-semibold text-gray-700">Hiệu lực</span>
              }
            >
              <Select placeholder="Chọn trạng thái hiệu lực" className="h-10">
                <Select.Option value={1}>Đã chứng nhận</Select.Option>
                <Select.Option value={0}>Chưa chứng nhận</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="specialty"
            label={
              <span className="font-semibold text-gray-700">Chuyên môn</span>
            }
            rules={[{ required: true, message: "Vui lòng chọn chuyên môn" }]}
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
            label={
              <span className="font-semibold text-gray-700">Ngôn ngữ</span>
            }
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
            label={
              <span className="font-semibold text-gray-700">
                Chứng chỉ (cách nhau bằng dấu phẩy)
              </span>
            }
          >
            <Input
              placeholder="Chứng chỉ ẩm thực quốc tế, Chứng chỉ vệ sinh an toàn thực phẩm"
              className="h-10"
            />
          </Form.Item>

          <Form.Item
            name="serviceIncludes"
            label={
              <span className="font-semibold text-gray-700">
                Dịch vụ bao gồm
              </span>
            }
          >
            <Select
              mode="multiple"
              placeholder="Chọn dịch vụ"
              allowClear
              className="h-auto min-h-[40px]"
            >
              <Select.Option value="Dọn dẹp bếp">Dọn dẹp bếp</Select.Option>
              <Select.Option value="Đi chợ hộ">Đi chợ hộ</Select.Option>
              <Select.Option value="Tư vấn thực đơn">
                Tư vấn thực đơn
              </Select.Option>
              <Select.Option value="Chuẩn bị nguyên liệu">
                Chuẩn bị nguyên liệu
              </Select.Option>
              <Select.Option value="Hướng dẫn nấu ăn">
                Hướng dẫn nấu ăn
              </Select.Option>
              <Select.Option value="Phục vụ tại bàn">
                Phục vụ tại bàn
              </Select.Option>
              <Select.Option value="Trang trí món ăn">
                Trang trí món ăn
              </Select.Option>
              <Select.Option value="Dọn dẹp sau bữa ăn">
                Dọn dẹp sau bữa ăn
              </Select.Option>
              <Select.Option value="Tổ chức tiệc">Tổ chức tiệc</Select.Option>
              <Select.Option value="Nấu ăn theo yêu cầu">
                Nấu ăn theo yêu cầu
              </Select.Option>
              <Select.Option value="Dịch vụ giao tận nơi">
                Dịch vụ giao tận nơi
              </Select.Option>
              <Select.Option value="Dạy nấu ăn">Dạy nấu ăn</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="minDuration"
            label={
              <span className="font-semibold text-gray-700">
                Thời gian tối thiểu (giờ)
              </span>
            }
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
        title={
          <div className="text-xl font-bold text-gray-800">
            Chỉnh sửa đầu bếp
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingChef(null);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
        className="modal-custom"
        forceRender
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateChef}>
          <Form.Item
            name="name"
            label={
              <span className="font-semibold text-gray-700">Tên đầu bếp</span>
            }
            rules={[{ required: true, message: "Vui lòng nhập tên đầu bếp" }]}
          >
            <Input placeholder="Maria Rodriguez" className="h-10" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="font-semibold text-gray-700">Email</span>}
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="maria@example.com" className="h-10" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span className="font-semibold text-gray-700">Số điện thoại</span>
            }
          >
            <Input placeholder="+84 123 456 789" className="h-10" />
          </Form.Item>

          <Form.Item
            name="avatar"
            label={
              <span className="font-semibold text-gray-700">
                Ảnh đại diện (URL)
              </span>
            }
          >
            <Input
              placeholder="https://example.com/avatar.jpg"
              className="h-10"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="experience"
              label={
                <span className="font-semibold text-gray-700">
                  Kinh nghiệm (năm)
                </span>
              }
            >
              <Input type="number" min="0" placeholder="5" className="h-10" />
            </Form.Item>

            <Form.Item
              name="district"
              label={
                <span className="font-semibold text-gray-700">Quận/Huyện</span>
              }
            >
              <Input placeholder="Quận 1, TP.HCM" className="h-10" />
            </Form.Item>

            <Form.Item
              name="cookTime"
              label={
                <span className="font-semibold text-gray-700">
                  Thời gian nấu (giờ)
                </span>
              }
            >
              <Input type="number" min="0" placeholder="2" className="h-10" />
            </Form.Item>

            <Form.Item
              name="price"
              label={
                <span className="font-semibold text-gray-700">
                  Giá (VNĐ/bữa)
                </span>
              }
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
              label={
                <span className="font-semibold text-gray-700">Trạng thái</span>
              }
            >
              <Select placeholder="Chọn trạng thái" className="h-10">
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Không hoạt động</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="valid"
              label={
                <span className="font-semibold text-gray-700">Hiệu lực</span>
              }
            >
              <Select placeholder="Chọn trạng thái hiệu lực" className="h-10">
                <Select.Option value={1}>Đã chứng nhận</Select.Option>
                <Select.Option value={0}>Chưa chứng nhận</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="specialty"
            label={
              <span className="font-semibold text-gray-700">Chuyên môn</span>
            }
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
            label={
              <span className="font-semibold text-gray-700">Ngôn ngữ</span>
            }
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
            label={
              <span className="font-semibold text-gray-700">
                Chứng chỉ (cách nhau bằng dấu phẩy)
              </span>
            }
          >
            <Input
              placeholder="Chứng chỉ ẩm thực quốc tế, Chứng chỉ vệ sinh an toàn thực phẩm"
              className="h-10"
            />
          </Form.Item>

          <Form.Item
            name="serviceIncludes"
            label={
              <span className="font-semibold text-gray-700">
                Dịch vụ bao gồm
              </span>
            }
          >
            <Select
              mode="multiple"
              placeholder="Chọn dịch vụ"
              allowClear
              className="h-auto min-h-[40px]"
            >
              <Select.Option value="Dọn dẹp bếp">Dọn dẹp bếp</Select.Option>
              <Select.Option value="Đi chợ hộ">Đi chợ hộ</Select.Option>
              <Select.Option value="Tư vấn thực đơn">
                Tư vấn thực đơn
              </Select.Option>
              <Select.Option value="Chuẩn bị nguyên liệu">
                Chuẩn bị nguyên liệu
              </Select.Option>
              <Select.Option value="Hướng dẫn nấu ăn">
                Hướng dẫn nấu ăn
              </Select.Option>
              <Select.Option value="Phục vụ tại bàn">
                Phục vụ tại bàn
              </Select.Option>
              <Select.Option value="Trang trí món ăn">
                Trang trí món ăn
              </Select.Option>
              <Select.Option value="Dọn dẹp sau bữa ăn">
                Dọn dẹp sau bữa ăn
              </Select.Option>
              <Select.Option value="Tổ chức tiệc">Tổ chức tiệc</Select.Option>
              <Select.Option value="Nấu ăn theo yêu cầu">
                Nấu ăn theo yêu cầu
              </Select.Option>
              <Select.Option value="Dịch vụ giao tận nơi">
                Dịch vụ giao tận nơi
              </Select.Option>
              <Select.Option value="Dạy nấu ăn">Dạy nấu ăn</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="minDuration"
            label={
              <span className="font-semibold text-gray-700">
                Thời gian tối thiểu (giờ)
              </span>
            }
          >
            <Input type="number" min="0" placeholder="1" className="h-10" />
          </Form.Item>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setIsEditModalVisible(false);
                setEditingChef(null);
              }}
              className="h-10 px-6 font-medium"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="h-10 px-6 font-medium"
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ChefManagement;
