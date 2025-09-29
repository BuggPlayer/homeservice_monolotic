import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  StarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getAnalytics, getRecentBookings, getUpcomingBookings, getPendingQuotes, getRecentMessages } from '../../store/slices/dashboardSlice';
import EarningsChart from '../../components/Charts/EarningsChart';
import PerformanceChart from '../../components/Charts/PerformanceChart';
import RecentBookingsTable from '../../components/Tables/RecentBookingsTable';
import UpcomingBookingsCard from '../../components/Cards/UpcomingBookingsCard';
import PendingQuotesCard from '../../components/Cards/PendingQuotesCard';
import RecentMessagesCard from '../../components/Cards/RecentMessagesCard';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, recentBookings, upcomingBookings, pendingQuotes, recentMessages, isLoading } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(getAnalytics());
    dispatch(getRecentBookings(5));
    dispatch(getUpcomingBookings(5));
    dispatch(getPendingQuotes(5));
    dispatch(getRecentMessages(5));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Earnings"
              value={analytics?.total_earnings || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed Jobs"
              value={analytics?.completed_jobs || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={analytics?.average_rating || 0}
              prefix={<StarOutlined />}
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Response Time"
              value={analytics?.response_time || 0}
              prefix={<ClockCircleOutlined />}
              suffix="min"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Earnings Trend" style={{ height: 400 }}>
            <EarningsChart />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Performance Overview" style={{ height: 400 }}>
            <PerformanceChart />
          </Card>
        </Col>
      </Row>

      {/* Tables and Cards Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Bookings" style={{ height: 400 }}>
            <RecentBookingsTable bookings={recentBookings} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <UpcomingBookingsCard bookings={upcomingBookings} />
            <PendingQuotesCard quotes={pendingQuotes} />
            <RecentMessagesCard messages={recentMessages} />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
