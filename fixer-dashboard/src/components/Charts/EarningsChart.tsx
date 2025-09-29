import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getEarningsData } from '../../store/slices/dashboardSlice';

const EarningsChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { earningsData, isLoading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(getEarningsData('30d'));
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const data = earningsData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    earnings: item.amount,
    jobs: item.jobs,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="earnings" 
          stroke="#1890ff" 
          strokeWidth={2}
          name="Earnings ($)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EarningsChart;
