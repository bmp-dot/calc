function AppSwitcher() {
  const [activeTab, setActiveTab] = React.useState('Capacity');

  const AppLayout = ({ children }) => (
    <div className="max-w-4xl mx-auto px-4">{children}</div>
  );

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-8">
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

        {activeTab === 'Capacity' && <CalculatorApp />}
        {activeTab === 'Rack' && <RackCalculator />}
      </AppLayout>
    </div>
  );
}
