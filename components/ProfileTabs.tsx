import { useEffect, useMemo, useState } from 'react';
import styles from '../styles/ProfileTabs.module.css';
import type { UserRole } from '../types/auth';

interface ProfileData {
  email?: string | null;
  phone?: string;
  role?: UserRole;
  avatarUrl?: string;
  displayName?: string;
}

interface ProfileTabsProps {
  profile: ProfileData;
  initialTab?: string;
  onChange?: (tabId: string) => void;
}

const ProfileTabs = ({ profile, initialTab, onChange }: ProfileTabsProps) => {
  const tabList = useMemo(() => {
    switch (profile.role) {
      case 'Landlord':
        return [
          {
            id: 'info',
            label: 'Thông tin cá nhân',
            content: (
              <div>
                <p>Email: {profile.email}</p>
                <p>Số điện thoại: {profile.phone}</p>
              </div>
            ),
          },
          {
            id: 'listings',
            label: 'Tin đăng của tôi',
            content: <p>Danh sách tin đăng sẽ hiển thị tại đây.</p>,
          },
          {
            id: 'transactions',
            label: 'Lịch sử giao dịch',
            content: (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã giao dịch</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3}>Chưa có dữ liệu giao dịch.</td>
                  </tr>
                </tbody>
              </table>
            ),
          },
        ];
      case 'Marketer':
        return [
          {
            id: 'info',
            label: 'Thông tin cá nhân',
            content: (
              <div>
                <p>Email: {profile.email}</p>
                <p>Số điện thoại: {profile.phone}</p>
              </div>
            ),
          },
          {
            id: 'leads',
            label: 'Bảng leads',
            content: <p>Bảng leads sẽ cập nhật sau.</p>,
          },
          {
            id: 'commission',
            label: 'Hoa hồng',
            content: <div className={styles.emptyChart}>Biểu đồ hoa hồng sẽ hiển thị ở đây.</div>,
          },
        ];
      case 'Broker':
        return [
          {
            id: 'info',
            label: 'Thông tin cá nhân',
            content: (
              <div>
                <p>Email: {profile.email}</p>
                <p>Số điện thoại: {profile.phone}</p>
              </div>
            ),
          },
          {
            id: 'assigned',
            label: 'Leads được giao',
            content: <p>Danh sách leads được giao sẽ xuất hiện tại đây.</p>,
          },
          {
            id: 'calendar',
            label: 'Lịch hẹn',
            content: <div className={styles.calendarPlaceholder}>Lịch hẹn sẽ tích hợp sau.</div>,
          },
        ];
      default:
        return [
          {
            id: 'info',
            label: 'Thông tin cá nhân',
            content: (
              <div>
                <p>Email: {profile.email}</p>
                <p>Số điện thoại: {profile.phone}</p>
              </div>
            ),
          },
        ];
    }
  }, [profile.email, profile.phone, profile.role]);

  const [activeTab, setActiveTab] = useState(tabList[0]?.id ?? 'info');

  useEffect(() => {
    const fallback = tabList[0]?.id ?? 'info';
    if (initialTab && initialTab !== activeTab && tabList.some((tab) => tab.id === initialTab)) {
      setActiveTab(initialTab);
    } else if (!tabList.some((tab) => tab.id === activeTab) && fallback !== activeTab) {
      setActiveTab(fallback);
    }
  }, [initialTab, tabList, activeTab]);

  const activeContent = useMemo(() => tabList.find((tab) => tab.id === activeTab)?.content, [tabList, activeTab]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabList}>
        {tabList.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              onChange?.(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabPanel}>{activeContent}</div>
    </div>
  );
};

export default ProfileTabs;
