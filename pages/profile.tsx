import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProfileTabs from '../components/ProfileTabs';
import AvatarUploader from '../components/AvatarUploader';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/Profile.module.css';
import type { UserRole } from '../types/auth';

const ProfilePage = () => {
  const { user, profile, loading, updateProfile, uploadAvatar } = useAuth();
  const router = useRouter();
  const initialTab = typeof router.query.tab === 'string' ? router.query.tab : undefined;
  const [form, setForm] = useState<{ displayName: string; phone: string; role: UserRole }>(
    { displayName: '', phone: '', role: 'Landlord' }
  );
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName ?? '',
        phone: profile.phone ?? '',
        role: profile.role ?? 'Landlord',
      });
    }
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className={styles.loading}>
        <Head>
          <title>Hồ sơ ThuêNhàVN</title>
        </Head>
        <p>Đang tải hồ sơ...</p>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      await updateProfile(form);
      setStatus('Đã cập nhật thông tin hồ sơ.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể cập nhật hồ sơ.';
      setError(message);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Hồ sơ ThuêNhàVN</title>
      </Head>
      <section className={styles.card}>
        <h1>Hồ sơ của bạn</h1>
        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <AvatarUploader avatarUrl={profile.avatarUrl} onUpload={uploadAvatar} />
          <label>
            Họ tên hiển thị
            <input
              type="text"
              value={form.displayName}
              onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
            />
          </label>
          <label>
            Số điện thoại
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
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
          <button type="submit">Lưu hồ sơ</button>
          {status && <p className={styles.success}>{status}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </section>
      <section className={styles.card}>
        <h2>Tổng quan theo vai trò</h2>
        <ProfileTabs
          profile={{ ...profile, ...form }}
          initialTab={initialTab}
          onChange={(tabId) => {
            const query = tabId === 'info' ? {} : { tab: tabId };
            router.replace({ pathname: '/profile', query }, undefined, { shallow: true });
          }}
        />
     </section>
    </div>
  );
};

export default ProfilePage;
