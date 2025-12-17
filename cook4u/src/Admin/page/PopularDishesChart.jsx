import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PopularDishesChart = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { name: 'Việt Nam', value: 23 },
    { name: 'Ý', value: 20 },
    { name: 'Á', value: 15 },
    { name: 'Âu', value: 12 },
    { name: 'Khác', value: 30 },
  ];

  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Tỷ lệ']}
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: '20px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularDishesChart;