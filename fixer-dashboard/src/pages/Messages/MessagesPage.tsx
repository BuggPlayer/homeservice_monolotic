import React from 'react';
import { Typography, Card } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { Title } = Typography;

const MessagesPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <MessageOutlined style={{ marginRight: 8 }} />
        Messages
      </Title>
      <Card>
        <p>Messages page - Coming soon!</p>
        <p>This page will include:</p>
        <ul>
          <li>Real-time messaging</li>
          <li>Message history</li>
          <li>File sharing</li>
          <li>Call integration</li>
        </ul>
      </Card>
    </div>
  );
};

export default MessagesPage;
