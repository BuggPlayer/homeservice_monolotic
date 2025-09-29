import React from 'react';
import { Layout, Menu, Avatar, Typography, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  MessageOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ToolOutlined,
  BarChartOutlined,
  TeamOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/service-requests',
      icon: <FileTextOutlined />,
      label: 'Service Requests',
    },
    {
      key: '/quotes',
      icon: <DollarOutlined />,
      label: 'Quotes',
    },
    {
      key: '/bookings',
      icon: <CalendarOutlined />,
      label: 'Bookings',
    },
    {
      key: '/customers',
      icon: <TeamOutlined />,
      label: 'Customers',
    },
    {
      key: '/messages',
      icon: <MessageOutlined />,
      label: 'Messages',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const selectedKeys = [location.pathname];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Avatar
          size={collapsed ? 32 : 48}
          style={{ backgroundColor: '#1890ff', marginBottom: collapsed ? 0 : 8 }}
        >
          {user?.first_name?.charAt(0) || 'U'}
        </Avatar>
        {!collapsed && (
          <div>
            <Text strong style={{ display: 'block' }}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Service Provider
            </Text>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        onClick={handleMenuClick}
        style={{ border: 'none' }}
        items={menuItems}
      />

      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <Menu
          mode="inline"
          style={{ border: 'none' }}
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: handleLogout,
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
