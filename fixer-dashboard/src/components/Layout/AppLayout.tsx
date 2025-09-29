import React from 'react';
import { Layout, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed, theme: appTheme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  if (!user) {
    return <Outlet />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={sidebarCollapsed} />
      <Layout>
        <Header 
          collapsed={sidebarCollapsed} 
          onToggle={handleSidebarToggle}
        />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
