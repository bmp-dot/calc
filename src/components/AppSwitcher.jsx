import React from 'react';
import CalculatorApp from './capacity';
import RackCalculator from './rack';
import '../styles/App.css';

function AppSwitcher() {
  const [activeTab, setActiveTab] = React.useState('Capacity');

  const AppLayout = ({ children }) => (
    <div className="max-w-4xl mx-auto px-4">{children}</div>
  );

  return (
    <div className="tab-container bg-gray-900 min-h-screen p-4 sm:p-8">
      
      {/* ✅ Wrap the buttons in AppLayout */}
      <AppLayout>
        <div className="tab-buttons mb-6">
          <button
            className={`tab-button ${activeTab === 'Capacity' ? 'active' : ''}`}
            onClick={() => setActiveTab('Capacity')}
          >
            Capacity
          </button>
          <button
            className={`tab-button ${activeTab === 'Rack' ? 'active' : ''}`}
            onClick={() => setActiveTab('Rack')}
          >
            Rack
          </button>
        </div>
      </AppLayout>

      <AppLayout>
        {activeTab === 'Capacity' && <CalculatorApp />}
        {activeTab === 'Rack' && <RackCalculator />}
      </AppLayout>
    </div>
  );
}

export default AppSwitcher;
