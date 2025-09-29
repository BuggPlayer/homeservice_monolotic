import React from 'react';
import { Layout, Button, Badge, Dropdown, Space, Typography, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.ui);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const notificationItems = [
    {
      key: '1',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>New service request</Text>
          <br />
          <Text type="secondary">AC repair needed in downtown</Text>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>Quote accepted</Text>
          <br />
          <Text type="secondary">Your quote for plumbing job was accepted</Text>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>New review</Text>
          <br />
          <Text type="secondary">Customer left a 5-star review</Text>
        </div>
      ),
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px 0 rgba(29, 35, 41, 0.05)',
      }}
    >
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <Text strong style={{ fontSize: '18px' }}>
          Fixer Dashboard
        </Text>
      </Space>

      <Space size="middle">
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Badge count={unreadNotifications} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px' }}
            />
          </Badge>
        </Dropdown>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
            <Text>{user?.first_name} {user?.last_name}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
