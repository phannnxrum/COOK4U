import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { name: 'T1', revenue: 18000000 },
    { name: 'T2', revenue: 21000000 },
    { name: 'T3', revenue: 16000000 },
    { name: 'T4', revenue: 19000000 },
    { name: 'T5', revenue: 23000000 },
    { name: 'T6', revenue: 22000000 },
    { name: 'T7', revenue: 25000000 },
  ];

  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(0)}M`;
  };

  // Render placeholder while mounting
  if (!isMounted) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-500">Đang tải biểu đồ...</div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#f0f0f0" 
            vertical={false}
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCurrency}
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ 
              stroke: '#ef4444', 
              strokeWidth: 2, 
              r: 4,
              fill: '#fff'
            }}
            activeDot={{ r: 6, fill: '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;