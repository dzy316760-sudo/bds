import { FormEvent, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/Auth.module.css';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/profile';
      router.push(redirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể đăng nhập.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Đăng nhập ThuêNhàVN</h1>
        {error && <p className={styles.error}>{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
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
        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <p className={styles.switchText}>
          Chưa có tài khoản? <Link href="/auth/signup">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
