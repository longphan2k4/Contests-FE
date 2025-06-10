import React from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Sử dụng tư vấn và hỗ trợ thông tin tuyển sinh, chương trình đào tạo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <MapPinIcon className="w-8 h-8" />, title: 'Địa chỉ', content: '65 Huỳnh Thúc Kháng, P.Bến Nghé, Q.1, Tp.HCM.' },
            { icon: <PhoneIcon className="w-8 h-8" />, title: 'Điện thoại', content: '028 38 212 868 - 028 38 212 360' },
            { icon: <EnvelopeIcon className="w-8 h-8" />, title: 'Email', content: 'ktcaothang@caothang.edu.vn' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-blue-100">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300">
            <a href='https://chatbot.caothang.edu.vn/'>Đăng ký tư vấn miễn phí</a>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;