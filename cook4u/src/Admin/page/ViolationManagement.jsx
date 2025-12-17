import React from 'react';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

const ViolationManagement = () => {
  const violations = [
    {
      id: 1,
      reporter: 'Nguyễn Văn A',
      type: 'Chef',
      name: 'Maria Rodriguez',
      reason: 'Món ăn không đúng mô tả',
      description: 'Món ăn giao đến không giống như hình ảnh và mô tả. Chất lượng kém.',
      status: 'Đã xử lý',
      severity: 'Trung bình',
    },
    {
      id: 2,
      reporter: 'Trần Thị B',
      type: 'Chef',
      name: 'Linh Nguyen',
      reason: 'Giao hàng trễ',
      description: 'Đầu bếp nấu món ăn trễ 30 phút so với thời gian đã hẹn.',
      status: 'Đang xử lý',
      severity: 'Thấp',
    },
    {
      id: 3,
      reporter: 'Lê Văn C',
      type: 'Customer',
      name: 'Phạm Thị D',
      reason: 'Hành vi không phù hợp',
      description: 'Khách hàng có thái độ thô lỗ với đầu bếp, sử dụng ngôn từ không phù hợp.',
      status: 'Đã xử lý',
      severity: 'Cao',
    },
    {
      id: 4,
      reporter: 'Hoàng Văn E',
      type: 'Chef',
      name: 'Alex Thompson',
      reason: 'Vệ sinh thực phẩm',
      description: 'Phát hiện tóc trong món ăn, nghi ngờ về vệ sinh an toàn thực phẩm.',
      status: 'Đang xử lý',
      severity: 'Cao',
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'cao':
        return 'bg-red-100 text-red-600';
      case 'trung bình':
        return 'bg-yellow-100 text-yellow-600';
      case 'thấp':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'đã xử lý':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'đang xử lý':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quản lý vi phạm (4)</h2>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Người báo cáo</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Đối tượng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Tên</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Lý do</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Mô tả</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Độ nghiêm trọng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {violations.map((violation) => (
                <tr key={violation.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="font-medium">{violation.reporter}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      violation.type === 'Chef' 
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {violation.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium">{violation.name}</td>
                  <td className="py-4 px-4">
                    <p className="max-w-xs">{violation.reason}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="max-w-xs text-sm text-gray-600">{violation.description}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getStatusIcon(violation.status)}
                      <span className="ml-2">{violation.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(violation.severity)}`}>
                      {violation.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViolationManagement;