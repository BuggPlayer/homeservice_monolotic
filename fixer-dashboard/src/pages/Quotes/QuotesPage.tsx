import React from 'react';
import { Typography, Card } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const QuotesPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <DollarOutlined style={{ marginRight: 8 }} />
        Quotes
      </Title>
      <Card>
        <p>Quotes management page - Coming soon!</p>
        <p>This page will include:</p>
        <ul>
          <li>Quote submission</li>
          <li>Quote tracking</li>
          <li>Quote editing</li>
          <li>Quote analytics</li>
        </ul>
      </Card>
    </div>
  );
};

export default QuotesPage;
