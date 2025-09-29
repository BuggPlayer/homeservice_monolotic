import React from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { Booking } from '../../types';

interface RecentBookingsTableProps {
  bookings: Booking[];
}

const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({ bookings }) => {
  const columns = [
    {
      title: 'Customer',
      dataIndex: ['customer', 'first_name'],
      key: 'customer',
      render: (text: string, record: Booking) => 
        `${record.customer?.first_name} ${record.customer?.last_name}`,
    },
    {
      title: 'Service',
      dataIndex: ['service_request', 'title'],
      key: 'service',
    },
    {
      title: 'Date',
      dataIndex: 'scheduled_time',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = {
          scheduled: 'blue',
          in_progress: 'orange',
          completed: 'green',
          cancelled: 'red',
        }[status] || 'default';
        
        return <Tag color={color}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Booking) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => console.log('View booking', record.id)}
          />
          <Button 
            type="text" 
            icon={<MessageOutlined />} 
            size="small"
            onClick={() => console.log('Message customer', record.customer_id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={bookings}
      rowKey="id"
      pagination={false}
      size="small"
    />
  );
};

export default RecentBookingsTable;
