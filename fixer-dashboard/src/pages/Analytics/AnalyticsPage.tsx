import React from 'react';
import { Typography, Card } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <BarChartOutlined style={{ marginRight: 8 }} />
        Analytics
      </Title>
      <Card>
        <p>Analytics page - Coming soon!</p>
        <p>This page will include:</p>
        <ul>
          <li>Performance metrics</li>
          <li>Earnings reports</li>
          <li>Customer insights</li>
          <li>Service analytics</li>
        </ul>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
