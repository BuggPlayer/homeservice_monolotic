import React from 'react';
import { Typography, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <UserOutlined style={{ marginRight: 8 }} />
        Profile
      </Title>
      <Card>
        <p>Profile management page - Coming soon!</p>
        <p>This page will include:</p>
        <ul>
          <li>Business information</li>
          <li>Service areas</li>
          <li>Document upload</li>
          <li>Verification status</li>
        </ul>
      </Card>
    </div>
  );
};

export default ProfilePage;
