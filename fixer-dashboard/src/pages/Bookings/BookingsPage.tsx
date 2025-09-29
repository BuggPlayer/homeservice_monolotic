import React from 'react';
import { Typography, Card } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const BookingsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <CalendarOutlined style={{ marginRight: 8 }} />
        Bookings
      </Title>
      <Card>
        <p>Bookings management page - Coming soon!</p>
        <p>This page will include:</p>
        <ul>
          <li>Booking calendar</li>
          <li>Job status tracking</li>
          <li>Schedule management</li>
          <li>Availability settings</li>
        </ul>
      </Card>
    </div>
  );
};

export default BookingsPage;
