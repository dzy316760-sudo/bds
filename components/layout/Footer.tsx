import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <div>
          <p className="text-lg font-semibold text-primary">ThuêNhàVN</p>
          <p className="mt-2 max-w-sm text-sm text-slate-600">
            ThuêNhàVN giúp bạn tìm kiếm và quản lý bất động sản cho thuê nhanh chóng, minh bạch và an toàn.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm text-slate-600 md:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-800">Sản phẩm</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/phong-tro">Phòng trọ</Link>
              </li>
              <li>
                <Link href="/nha-nguyen-can">Nhà nguyên căn</Link>
              </li>
              <li>
                <Link href="/van-phong">Văn phòng</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Về chúng tôi</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/ve-chung-toi">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/bao-mat">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="/dieu-khoan">Điều khoản sử dụng</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Hỗ trợ</p>
            <ul className="mt-2 space-y-1">
              <li>Email: support@thuenhavn.vn</li>
              <li>Hotline: 1900 1234</li>
              <li>
                <Link href="/lien-he">Liên hệ</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t bg-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ThuêNhàVN. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;
