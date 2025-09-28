import Link from 'next/link';
import styles from '../styles/RoleMenu.module.css';
import type { UserRole } from '../types/auth';

interface RoleMenuProps {
  role?: UserRole;
}

const roleMenus: Record<UserRole, { label: string; href: string }[]> = {
  Landlord: [
    { label: 'Trang cá nhân', href: '/profile' },
    { label: 'Tin đăng của tôi', href: '/profile?tab=listings' },
  ],
  Marketer: [
    { label: 'Trang cá nhân', href: '/profile' },
    { label: 'Leads', href: '/profile?tab=leads' },
  ],
  Broker: [
    { label: 'Trang cá nhân', href: '/profile' },
    { label: 'Lịch hẹn', href: '/profile?tab=calendar' },
  ],
};

const RoleMenu = ({ role }: RoleMenuProps) => {
  if (!role) {
    return null;
  }

  const entries = roleMenus[role] ?? [{ label: 'Trang cá nhân', href: '/profile' }];

  return (
    <ul className={styles.menu}>
      {entries.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={styles.link}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default RoleMenu;
