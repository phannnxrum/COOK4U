import React, { useState } from 'react'
import DashboardLayout from './page/DashboardLayout.jsx'
import DashboardOverview from './page/DashboardOverview.jsx';
import DishManagement from './page/DishManagement.jsx';
import ChefManagement from './page/ChefManagement.jsx';
import ViolationManagement from './page/ViolationManagement.jsx';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'dishes':
        return <DishManagement />;
      case 'chefs':
        return <ChefManagement />;
      case 'violations':
        return <ViolationManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default Admin