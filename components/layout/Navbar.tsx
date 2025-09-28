'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const roleMenus: Record<string, { label: string; href: string }[]> = {
  Landlord: [
    { label: 'Đăng tin', href: '/dang-tin' },
    { label: 'Quản lý tin', href: '/quan-ly' }
  ],
  Marketer: [
    { label: 'Chiến dịch', href: '/chien-dich' },
    { label: 'Khách hàng', href: '/khach-hang' }
  ],
  Broker: [
    { label: 'Nguồn nhà', href: '/nguon-nha' },
    { label: 'Lịch hẹn', href: '/lich-hen' }
  ]
};

const roles = [
  { value: 'Landlord', label: 'Chủ nhà' },
  { value: 'Marketer', label: 'Marketer' },
  { value: 'Broker', label: 'Môi giới' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('Landlord');

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-xl font-semibold text-primary">
          ThuêNhàVN
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <RoleSwitcher selectedRole={selectedRole} onChange={setSelectedRole} />
          <RoleLinks selectedRole={selectedRole} />
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10">
              Đăng nhập
            </button>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
              Đăng ký
            </button>
          </div>
        </nav>
        <button
          className="rounded-md p-2 text-slate-700 md:hidden"
          onClick={toggleMenu}
          aria-label="menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <RoleSwitcher selectedRole={selectedRole} onChange={setSelectedRole} />
          <RoleLinks selectedRole={selectedRole} isMobile />
          <div className="mt-4 flex flex-col gap-2">
            <button className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary">
              Đăng nhập
            </button>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
              Đăng ký
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const RoleSwitcher = ({
  selectedRole,
  onChange
}: {
  selectedRole: string;
  onChange: (value: string) => void;
}) => {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
      Vai trò:
      <select
        value={selectedRole}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 focus:border-primary focus:outline-none"
      >
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </label>
  );
};

const RoleLinks = ({ selectedRole, isMobile = false }: { selectedRole: string; isMobile?: boolean }) => {
  const links = roleMenus[selectedRole] ?? [];

  return (
    <ul className={`mt-4 flex flex-col gap-2 ${!isMobile ? 'mt-0 flex-row items-center' : ''}`}>
      {links.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="text-sm font-medium text-slate-700 hover:text-primary">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
