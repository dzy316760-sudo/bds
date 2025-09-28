import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const HomePage = () => (
  <div className={styles.container}>
    <Head>
      <title>ThuêNhàVN - Nền tảng bất động sản</title>
    </Head>
    <section className={styles.hero}>
      <h1>Chào mừng đến ThuêNhàVN</h1>
      <p>Nền tảng kết nối Chủ nhà, Nhà tiếp thị và Môi giới chuyên nghiệp.</p>
      <div className={styles.actions}>
        <Link href="/auth/signup" className={styles.primaryButton}>
          Đăng ký tài khoản
        </Link>
        <Link href="/auth/login" className={styles.secondaryButton}>
          Đăng nhập
        </Link>
      </div>
    </section>
  </div>
);

export default HomePage;
