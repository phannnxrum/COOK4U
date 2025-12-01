import React from 'react';
import { Users, Award, Shield, Star, ChefHat, Clock, Heart, MapPin } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Shield,
      title: "An toàn & Chất lượng",
      description: "Tất cả đầu bếp đều được xác minh và đánh giá kỹ lưỡng"
    },
    {
      icon: Heart,
      title: "Tận tâm & Chuyên nghiệp",
      description: "Đội ngũ đầu bếp có tay nghề cao và nhiệt tình"
    },
    {
      icon: Clock,
      title: "Tiện lợi & Nhanh chóng",
      description: "Đặt dịch vụ chỉ trong vài phút, phục vụ tận nơi"
    }
  ];

  const stats = [
    { 
      number: "50,000+", 
      label: "Khách hàng hài lòng", 
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    { 
      number: "1,200+", 
      label: "Đầu bếp chuyên nghiệp", 
      icon: ChefHat,
      color: "from-orange-500 to-orange-600"
    },
    { 
      number: "15+", 
      label: "Tỉnh thành phủ sóng", 
      icon: MapPin,
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-200 to-stone-300">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-orange-200 via-white/20 to-orange-200">
        <div className="mx-auto px-4 md:px-6">
          <div className=" mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Về <span className="text-orange-600">COOK4U</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Nền tảng kết nối thực khách với đầu bếp tài năng, 
              mang trải nghiệm ẩm thực đặc biệt đến nhà bạn
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section - Nổi bật hơn */}
      <section className="py-8 -mt-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
                <div className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                  {stat.number}
                </h3>
                <p className="text-gray-700 text-center font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 ml-4">
                  Câu chuyện của chúng tôi
                </h2>
              </div>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                  COOK4U ra đời với sứ mệnh kết nối những người yêu ẩm thực với các đầu bếp chuyên nghiệp. 
                  Chúng tôi tin rằng mỗi bữa ăn là một trải nghiệm văn hóa đặc sắc.
                </p>
                <p className="p-6">
                  Từ những món ăn gia đình ấm cúng đến các bữa tiệc sang trọng, 
                  COOK4U tự hào là cầu nối đáng tin cậy, mang đến sự tiện lợi và chất lượng 
                  cho hàng ngàn khách hàng trên khắp cả nước.
                </p>
              </div>
            </div>

            {/* Values */}
            <div>
              <div className="flex items-center justify-center mb-10">
                <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mx-4 text-center">
                  Giá trị cốt lõi
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                  <Star className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Trải nghiệm ẩm thực đẳng cấp
                </h2>
                <p className="mb-8 opacity-95 text-lg">
                  Đăng ký ngay để được tận hưởng dịch vụ đầu bếp tại nhà tốt nhất
                </p>
                <button className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                  Bắt đầu ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 