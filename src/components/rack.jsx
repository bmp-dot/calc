import React, { useState, useEffect } from 'react';

export default function RackCalculator() {
  const [totalServers, setTotalServers] = useState(0);
  const [serverRU, setServerRU] = useState(0);
  const [rackTotal, setRackTotal] = useState(0);
  const [ruPerRack, setRuPerRack] = useState(0);
  const [showDistribution, setShowDistribution] = useState(false);

  // Calculations
  const maxServersPerRack = serverRU > 0 ? Math.floor(ruPerRack / serverRU) : 0;
  const baseServersPerRack = (rackTotal > 0 && maxServersPerRack > 0)
    ? Math.min(Math.floor(totalServers / rackTotal), maxServersPerRack)
    : 0;
  const extraDistribution = rackTotal > 0 ? totalServers % rackTotal : 0;
  const ruAvailableTotal = ruPerRack * rackTotal;
  const totalRUNeeded = totalServers * serverRU;

  // Distribute servers across racks as evenly as possible
  const distribution = Array.from({ length: rackTotal }, (_, i) =>
    i < extraDistribution ? baseServersPerRack + 1 : baseServersPerRack
  );

  const rackSummary = distribution.reduce((acc, count) => {
    acc[count] = (acc[count] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="border border-gray-700 rounded-lg shadow-md p-6 bg-gray-800 w-full max-w-xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-4 text-purple-300">Rack Layout Calculator</h1>

        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-300 text-sm mb-1 block">Total Servers:</span>
            <input
              type="number"
              className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg"
              value={totalServers}
              onChange={(e) => setTotalServers(parseInt(e.target.value, 10))}
            />
          </label>

          <label className="block">
            <span className="text-gray-300 text-sm mb-1 block">Server RU:</span>
            <input
              type="number"
              className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg"
              value={serverRU}
              onChange={(e) => setServerRU(parseFloat(e.target.value))}
            />
          </label>

          <label className="block">
            <span className="text-gray-300 text-sm mb-1 block">Rack Total:</span>
            <input
              type="number"
              className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg"
              value={rackTotal}
              onChange={(e) => setRackTotal(parseInt(e.target.value, 10))}
            />
          </label>

          <label className="block">
            <span className="text-gray-300 text-sm mb-1 block">RU per Rack:</span>
            <input
              type="number"
              className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg"
              value={ruPerRack}
              onChange={(e) => setRuPerRack(parseFloat(e.target.value))}
            />
          </label>
        </div>

        <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-purple-500 text-purple-300">
          <h2 className="text-xl font-semibold">Results:</h2>
          <p>Max Servers Per Rack: <strong>{maxServersPerRack}</strong></p>
          <p>Base Servers Per Rack: <strong>{baseServersPerRack}</strong></p>
          <p>Extra Distribution: <strong>{extraDistribution}</strong></p>
          <p>Rack RU Available: <strong>{ruAvailableTotal}</strong></p>
          <p>Rack RU Needed: <strong>{totalRUNeeded}</strong></p>

          <h3 className="text-lg font-semibold mt-4">Rack Count Summary:</h3>
          <ul className="list-disc ml-5">
            {Object.entries(rackSummary).map(([count, racks]) => (
              <li key={count}>Racks with <strong>{count}</strong> servers: <strong>{racks}</strong></li>
            ))}
          </ul>

          <div className="mt-4">
            <button
              onClick={() => setShowDistribution(!showDistribution)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              {showDistribution ? 'Hide' : 'Show'} Server Distribution Across Racks
            </button>

            {showDistribution && (
              <ul className="list-disc ml-5 mt-2">
                {distribution.map((count, i) => (
                  <li key={i}>Rack {i + 1}: <strong>{count}</strong> servers</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
