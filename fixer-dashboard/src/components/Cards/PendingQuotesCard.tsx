import React from 'react';
import { Card, List, Tag, Typography, Button, Space } from 'antd';
import { DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Quote } from '../../types';

const { Text, Title } = Typography;

interface PendingQuotesCardProps {
  quotes: Quote[];
}

const PendingQuotesCard: React.FC<PendingQuotesCardProps> = ({ quotes }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'orange',
      accepted: 'green',
      rejected: 'red',
      expired: 'gray',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  return (
    <Card 
      title={
        <Space>
          <DollarOutlined />
          <span>Pending Quotes</span>
        </Space>
      }
      size="small"
      extra={<Button type="link" size="small">View All</Button>}
    >
      <List
        dataSource={quotes}
        renderItem={(quote) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Space>
                  <Text strong>${quote.amount.toFixed(2)}</Text>
                  <Tag color={getStatusColor(quote.status)} size="small">
                    {quote.status.toUpperCase()}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">{quote.service_request?.title}</Text>
                  <Space>
                    <ClockCircleOutlined />
                    <Text type="secondary">
                      Expires: {new Date(quote.valid_until).toLocaleDateString()}
                    </Text>
                  </Space>
                  {quote.notes && (
                    <Text type="secondary" ellipsis={{ tooltip: quote.notes }}>
                      {quote.notes}
                    </Text>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default PendingQuotesCard;
