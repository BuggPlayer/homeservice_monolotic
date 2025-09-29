import React from 'react';
import { Typography, Card } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <SettingOutlined style={{ marginRight: 8 }} />
        Settings
      </Title>
      <Card>
        <p>Settings page - Coming soon!</p>
        <p>This page will include:</p>
        <ul>
          <li>Account settings</li>
          <li>Notification preferences</li>
          <li>Payment methods</li>
          <li>Privacy settings</li>
        </ul>
      </Card>
    </div>
  );
};

export default SettingsPage;
