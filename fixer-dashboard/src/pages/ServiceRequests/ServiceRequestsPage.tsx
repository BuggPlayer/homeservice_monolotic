import React from 'react';
import { Typography, Card } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ServiceRequestsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        Service Requests
      </Title>
      <Card>
        <p>Service requests management page - Coming soon!</p>
        <p>This page will include:</p>
        <ul>
          <li>Service request inbox</li>
          <li>Filtering and search</li>
          <li>Request details</li>
          <li>Quote submission</li>
        </ul>
      </Card>
    </div>
  );
};

export default ServiceRequestsPage;
