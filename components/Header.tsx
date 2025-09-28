import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import RoleMenu from './RoleMenu';
import styles from '../styles/Header.module.css';

const Header = () => {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoArea}>
        <Link href="/">
          <span className={styles.logoText}>ThuêNhàVN</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        {user && profile ? (
          <>
            <RoleMenu role={profile.role} />
            <button type="button" className={styles.logout} onClick={handleLogout}>
              Đăng xuất
            </button>
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.placeholderAvatar}>{profile.email?.charAt(0) ?? 'U'}</div>
            )}
          </>
        ) : (
          <div className={styles.authLinks}>
            <Link href="/auth/login" className={styles.link}>
              Đăng nhập
            </Link>
            <Link href="/auth/signup" className={styles.signupButton}>
              Đăng ký tài khoản
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
