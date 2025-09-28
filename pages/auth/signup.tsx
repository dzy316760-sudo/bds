import { FormEvent, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/Auth.module.css';
import type { UserRole } from '../../types/auth';

const SignupPage = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState<{ email: string; password: string; phone: string; role: UserRole }>(
    { email: '', password: '', phone: '', role: 'Landlord' }
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form);
      router.push('/profile');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể đăng ký tài khoản.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Đăng ký tài khoản</title>
      </Head>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Đăng ký tài khoản</h1>
        {error && <p className={styles.error}>{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
            placeholder="nhanvien@thuenhavn.vn"
          />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            minLength={6}
          />
        </label>
        <label>
          Số điện thoại
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />
        </label>
        <label>
          Vai trò
          <select
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
          >
            <option value="Landlord">Chủ nhà</option>
            <option value="Marketer">Nhà tiếp thị</option>
            <option value="Broker">Môi giới</option>
          </select>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </button>
        <p className={styles.switchText}>
          Đã có tài khoản? <Link href="/auth/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
