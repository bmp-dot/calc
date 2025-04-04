import React from 'react';
import CalculatorApp from './capacity';
import RackCalculator from './rack';
import '../styles/App.css';

function AppSwitcher() {
  const [activeTab, setActiveTab] = React.useState('calculator');
  const handleTabClick = (tab) => setActiveTab(tab);

  return (
    <div className="tab-container">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'Capacity' ? 'active' : ''}`}
          onClick={() => handleTabClick('Capacity')}
        >
          Calculator
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
          <CalculatorApp />
        </div>
        <div className={`tab-pane ${activeTab === 'Rack' ? 'active' : ''}`}>
          <RackCalculator />
        </div>
      </div>
    </div>
  );
}

export default AppSwitcher;
