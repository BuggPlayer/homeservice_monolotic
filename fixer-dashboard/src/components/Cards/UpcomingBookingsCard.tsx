import React from 'react';
import { Card, List, Tag, Typography, Button } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Booking } from '../../types';

const { Text, Title } = Typography;

interface UpcomingBookingsCardProps {
  bookings: Booking[];
}

const UpcomingBookingsCard: React.FC<UpcomingBookingsCardProps> = ({ bookings }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'blue',
      in_progress: 'orange',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  return (
    <Card 
      title={
        <Space>
          <CalendarOutlined />
          <span>Upcoming Bookings</span>
        </Space>
      }
      size="small"
      extra={<Button type="link" size="small">View All</Button>}
    >
      <List
        dataSource={bookings}
        renderItem={(booking) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Space>
                  <Text strong>{booking.customer?.first_name} {booking.customer?.last_name}</Text>
                  <Tag color={getStatusColor(booking.status)} size="small">
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">{booking.service_request?.title}</Text>
                  <Space>
                    <ClockCircleOutlined />
                    <Text type="secondary">
                      {new Date(booking.scheduled_time).toLocaleString()}
                    </Text>
                  </Space>
                  <Text strong>${booking.total_amount.toFixed(2)}</Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default UpcomingBookingsCard;
