import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getPerformanceData } from '../../store/slices/dashboardSlice';

const PerformanceChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { performanceData, isLoading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(getPerformanceData('6m'));
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const data = performanceData.map(item => ({
    month: item.month,
    earnings: item.earnings,
    jobs: item.jobs,
    rating: item.rating,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Bar yAxisId="left" dataKey="earnings" fill="#1890ff" name="Earnings ($)" />
        <Bar yAxisId="left" dataKey="jobs" fill="#52c41a" name="Jobs" />
        <Bar yAxisId="right" dataKey="rating" fill="#faad14" name="Rating" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
