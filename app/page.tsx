import ListingCard from '@/components/listings/ListingCard';
import QuickSearchForm from '@/components/listings/QuickSearchForm';
import AuthForm from '@/components/auth/AuthForm';
import { Listing } from '@/types';

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Căn hộ studio hiện đại tại Quận 1',
    userId: 'user1',
    propertyType: 'phòng trọ',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80'],
    address: '25 Nguyễn Huệ, Quận 1, TP.HCM',
    mapLocation: { lat: 10.776889, lng: 106.700806 },
    area: 35,
    bedrooms: 1,
    bathrooms: 1,
    furniture: 'đầy đủ',
    price: 10000000,
    deposit: 20000000,
    status: 'active'
  },
  {
    id: '2',
    title: 'Nhà nguyên căn 3 tầng tại Đà Nẵng',
    userId: 'user2',
    propertyType: 'nhà nguyên căn',
    images: ['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'],
    address: '85 Trần Phú, Hải Châu, Đà Nẵng',
    mapLocation: { lat: 16.06778, lng: 108.220833 },
    area: 180,
    bedrooms: 4,
    bathrooms: 3,
    furniture: 'cơ bản',
    price: 25000000,
    deposit: 50000000,
    status: 'active'
  },
  {
    id: '3',
    title: 'Văn phòng hạng B tại Cầu Giấy',
    userId: 'user3',
    propertyType: 'văn phòng',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'],
    address: '18 Duy Tân, Cầu Giấy, Hà Nội',
    mapLocation: { lat: 21.033781, lng: 105.800476 },
    area: 90,
    bedrooms: 0,
    bathrooms: 2,
    furniture: 'không',
    price: 30000000,
    deposit: 60000000,
    status: 'active'
  }
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10">
        <div className="mx-auto max-w-6xl px-4 py-16 md:flex md:items-center md:gap-12 md:px-6 md:py-20">
          <div className="md:w-1/2">
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">ThuêNhàVN</p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-5xl">
              Giải pháp thuê nhà toàn diện cho người Việt
            </h1>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Khám phá hàng nghìn bất động sản cho thuê từ phòng trọ, nhà nguyên căn đến văn phòng.
              Kết nối trực tiếp với chủ nhà, marketer và môi giới uy tín.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90">
                Khám phá ngay
              </button>
              <button className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10">
                Đăng tin cho thuê
              </button>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 text-sm text-slate-600 md:grid-cols-3">
              <div>
                <dt className="font-semibold text-slate-800">+8,000</dt>
                <dd>Tin đăng mới mỗi tháng</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-800">+2,000</dt>
                <dd>Chủ nhà & marketer tin dùng</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-800">24/7</dt>
                <dd>Hỗ trợ khách hàng</dd>
              </div>
            </dl>
          </div>
          <div className="mt-12 md:mt-0 md:w-1/2">
            <QuickSearchForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Bất động sản nổi bật</h2>
            <p className="mt-2 text-sm text-slate-600">
              Lựa chọn được kiểm duyệt với vị trí đẹp, giá hợp lý và thông tin minh bạch.
            </p>
          </div>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-primary hover:text-primary">
            Xem tất cả
          </button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Đăng ký để quản lý bất động sản hiệu quả</h2>
              <p className="mt-3 text-sm text-slate-600">
                ThuêNhàVN sử dụng Firebase Authentication để bảo mật tài khoản của bạn. Đăng ký bằng email để nhận
                xác minh hoặc sử dụng số điện thoại với OTP tiện lợi.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li>• Đồng bộ thông tin người dùng với cơ sở dữ liệu PostgreSQL thông qua Prisma.</li>
                <li>• Quản lý vai trò linh hoạt: Chủ nhà, Marketer, Môi giới.</li>
                <li>• Theo dõi trạng thái xác thực và cập nhật hồ sơ nhanh chóng.</li>
              </ul>
            </div>
            <AuthForm />
          </div>
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16 text-white md:px-6 md:py-20">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold">Dành cho chủ nhà</h3>
              <p className="mt-3 text-sm text-slate-300">
                Đăng tin dễ dàng, quản lý lịch xem nhà và tìm khách thuê phù hợp với công cụ sàng lọc thông minh.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Dành cho marketer</h3>
              <p className="mt-3 text-sm text-slate-300">
                Theo dõi hiệu quả chiến dịch, tối ưu ngân sách quảng cáo và nhận lead chất lượng theo thời gian thực.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Dành cho môi giới</h3>
              <p className="mt-3 text-sm text-slate-300">
                Kết nối với nguồn nhà phong phú, đặt lịch xem nhà nhanh chóng và quản lý khách hàng tập trung.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-secondary/90">
              Tư vấn miễn phí
            </button>
            <button className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
