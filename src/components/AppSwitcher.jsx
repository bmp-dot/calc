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
          className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => handleTabClick('calculator')}
        >
          Calculator
        </button>
        <button
          className={`tab-button ${activeTab === 'other' ? 'active' : ''}`}
          onClick={() => handleTabClick('other')}
        >
          Other App
        </button>
      </div>
      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'calculator' ? 'active' : ''}`}>
          <CalculatorApp />
        </div>
        <div className={`tab-pane ${activeTab === 'other' ? 'active' : ''}`}>
          <OtherApp />
        </div>
      </div>
    </div>
  );
}

export default AppSwitcher;
