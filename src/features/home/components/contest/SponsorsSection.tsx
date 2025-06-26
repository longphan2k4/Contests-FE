
const SponsorsSection = () => {
  // Dữ liệu mẫu cho các nhà tài trợ
  const sponsors = [
    {
      id: 1,
      name: "FPT Software",
      logo: "/api/placeholder/200/80",
      tier: "platinum",
      website: "https://www.fpt-software.com"
    },
    {
      id: 2,
      name: "Viettel",
      logo: "/api/placeholder/200/80",
      tier: "platinum",
      website: "https://www.viettel.com.vn"
    },
    {
      id: 3,
      name: "Nvidia",
      logo: "https://th.bing.com/th/id/R.86fd08d25f7cb15216a8de0a5013bbcf?rik=L5x9K9A0pPWa1Q&riu=http%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f10%2fNvidia_logo.png&ehk=Co0aePG6%2f4gh4I1tSSeqEuAQF%2bozxkbbtgm0CUJazrA%3d&risl=&pid=ImgRaw&r=0",
      tier: "gold",
      website: "https://www.nvidia.com/en-us/drivers/"
    },
    {
      id: 4,
      name: "Lexar",
      logo: "https://th.bing.com/th/id/OIP.EOs7xmX6kpb872r9Q6mQ8wHaB-?r=0&rs=1&pid=ImgDetMain",
      tier: "silver",
      website: "https://www.lexar.com/global/"
    },
    {
      id: 5,
      name: "Smnet",
      logo: "https://smnet.vn/wp-content/uploads/2024/11/logo-smnet-2024.png",
      tier: "silver",
      website: "https://smnet.vn/en/"
    },
    {
      id: 6,
      name: "Tin học đại dương",
      logo: "https://th.bing.com/th/id/OIP.JQ57f2ePcXF22b9-0hL3kwHaHa?r=0&rs=1&pid=ImgDetMain",
      tier: "silver",
      website: "https://tinhocdaiduong.vn/"
    },
    {
      id: 7,
      name: "Nguyễn Thuận Computer",
      logo: "https://thuancomputer.com/wp-content/uploads/2024/07/logo-to-hai.png",
      tier: "silver",
      website: "https://thuancomputer.com/"
    },
    {
      id: 8,
      name: "Anta6",
      logo: "https://anta6.com/wp-content/uploads/2025/03/1-1.png",
      tier: "bronze",
      website: "https://anta6.com/"
    }
  ];

  const getSponsorsByTier = (tier: string) => {
    return sponsors.filter(sponsor => sponsor.tier === tier);
  };

  const getTierTitle = (tier: string) => {
    const titles = {
      platinum: "Nhà tài trợ Bạch Kim",
      gold: "Nhà tài trợ Vàng", 
      silver: "Nhà tài trợ Bạc",
      bronze: "Nhà tài trợ Đồng"
    };
    return titles[tier as keyof typeof titles];
  };

  const getTierGradient = (tier: string) => {
    const gradients = {
      platinum: "from-gray-400 via-gray-300 to-gray-400",
      gold: "from-yellow-400 via-yellow-300 to-yellow-400",
      silver: "from-gray-300 via-gray-200 to-gray-300",
      bronze: "from-orange-400 via-orange-300 to-orange-400"
    };
    return gradients[tier as keyof typeof gradients];
  };

  const renderSponsorTier = (tier: string) => {
    const tierSponsors = getSponsorsByTier(tier);
    if (tierSponsors.length === 0) return null;

    return (
      <div key={tier} className="mb-12">
        <h3 className={`text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r ${getTierGradient(tier)} bg-clip-text text-transparent`}>
          {getTierTitle(tier)}
        </h3>
        <div className={`flex flex-wrap justify-center items-center gap-8 ${
          tier === 'platinum' ? 'mb-8' : 
          tier === 'gold' ? 'mb-6' : 
          tier === 'silver' ? 'mb-4' : 'mb-2'
        }`}>
          {tierSponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group block transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
            >
              <div className={`
                bg-white rounded-lg p-6 shadow-lg border border-gray-200 
                hover:shadow-2xl hover:border-blue-300 transition-all duration-300
                ${tier === 'platinum' ? 'p-8' : 
                  tier === 'gold' ? 'p-6' : 
                  tier === 'silver' ? 'p-5' : 'p-4'}
              `}>
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className={`
                    object-contain mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300
                    ${tier === 'platinum' ? 'h-20 w-48' : 
                      tier === 'gold' ? 'h-16 w-44' : 
                      tier === 'silver' ? 'h-12 w-40' : 'h-10 w-36'}
                  `}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Nhà tài trợ
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Chúng tôi xin chân thành cảm ơn các đối tác đã đồng hành cùng cuộc thi lập trình
          </p>
        </div>

        <div className="space-y-12">
          {['gold', 'silver', 'bronze'].map(tier => renderSponsorTier(tier))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Trở thành nhà tài trợ
            </h3>
            <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
              Tham gia cùng chúng tôi để hỗ trợ cộng đồng lập trình viên Việt Nam và quảng bá thương hiệu của bạn
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30">
              Liên hệ tài trợ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;