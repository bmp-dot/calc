import React from 'react';
import CalculatorApp from './capacity';
import RackCalculator from './rack';
import '../styles/App.css';

function AppSwitcher() {
  const [activeTab, setActiveTab] = React.useState('Capacity');
  const handleTabClick = (tab) => setActiveTab(tab);
  const AppLayout = ({ children }) => (
      <div className="max-w-7xl mx-auto px-4 border border-red-500">{children}</div>
);
  
  return (
    <div className="tab-container bg-gray-900 min-h-screen p-4 sm:p-8"> {/* Set to bg-gray-900 */}
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'Capacity' ? 'active' : ''}`}
          onClick={() => handleTabClick('Capacity')}
        >
          Capacity
        </button>
        <button
          className={`tab-button ${activeTab === 'Rack' ? 'active' : ''}`}
          onClick={() => handleTabClick('Rack')}
        >
          Rack
        </button>
      </div>
      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'Capacity' ? 'active' : ''}`}>
          <AppLayout>
          <CalculatorApp />
          </AppLayout>
        </div>
        <div className={`tab-pane ${activeTab === 'Rack' ? 'active' : ''}`}>
          <AppLayout>
          <RackCalculator />
          </AppLayout>
        </div>
      </div>
    </div>
  );
}

export default AppSwitcher;
