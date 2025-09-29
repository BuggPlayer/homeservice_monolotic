import React from 'react';
import { Card, List, Typography, Button, Space, Avatar } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Message } from '../../types';

const { Text } = Typography;

interface RecentMessagesCardProps {
  messages: Message[];
}

const RecentMessagesCard: React.FC<RecentMessagesCardProps> = ({ messages }) => {
  return (
    <Card 
      title={
        <Space>
          <MessageOutlined />
          <span>Recent Messages</span>
        </Space>
      }
      size="small"
      extra={<Button type="link" size="small">View All</Button>}
    >
      <List
        dataSource={messages}
        renderItem={(message) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  src={message.sender?.profile_picture}
                />
              }
              title={
                <Space>
                  <Text strong>{message.sender?.first_name} {message.sender?.last_name}</Text>
                  {!message.is_read && (
                    <div 
                      style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: '#1890ff' 
                      }} 
                    />
                  )}
                </Space>
              }
              description={
                <Text 
                  type="secondary" 
                  ellipsis={{ tooltip: message.message }}
                  style={{ fontSize: '12px' }}
                >
                  {message.message}
                </Text>
              }
            />
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentMessagesCard;
