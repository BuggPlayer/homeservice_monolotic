import React from 'react';
import { Typography, Card } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CustomersPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <TeamOutlined style={{ marginRight: 8 }} />
        Customers
      </Title>
      <Card>
        <p>Customer management page - Coming soon!</p>
        <p>This page will include:</p>
        <ul>
          <li>Customer profiles</li>
          <li>Service history</li>
          <li>Communication logs</li>
          <li>Review management</li>
        </ul>
      </Card>
    </div>
  );
};

export default CustomersPage;
