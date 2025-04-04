import React, { useState } from 'react';

export default function RackCalculator() {
  // Allow inputs to be empty strings for better UX
  const [totalServers, setTotalServers] = useState('');
  const [serverRU, setServerRU] = useState('');
  const [rackTotal, setRackTotal] = useState('');
  const [ruPerRack, setRuPerRack] = useState('');
  const [showDistribution, setShowDistribution] = useState(false);

  // Parse numeric values for calculations
  const parsedTotalServers = parseInt(totalServers, 10) || 0;
  const parsedServerRU = parseFloat(serverRU) || 0;
  const parsedRackTotal = parseInt(rackTotal, 10) || 0;
  const parsedRuPerRack = parseFloat(ruPerRack) || 0;

  const validInputs = parsedServerRU > 0 && parsedRuPerRack > 0 && parsedRackTotal > 0;

  // Main calculations
  const maxServersPerRack = validInputs
    ? Math.floor(parsedRuPerRack / parsedServerRU)
    : 0;

  const baseServersPerRack = validInputs
    ? Math.min(Math.floor(parsedTotalServers / parsedRackTotal), maxServersPerRack)
    : 0;

  const extraDistribution = parsedRackTotal > 0 ? parsedTotalServers % parsedRackTotal : 0;
  const ruAvailableTotal = parsedRuPerRack * parsedRackTotal;
  const totalRUNeeded = parsedTotalServers * parsedServerRU;

  const ruUtilization = ruAvailableTotal > 0
    ? ((totalRUNeeded / ruAvailableTotal) * 100).toFixed(1)
    : 0;

  // Server distribution array
  const distribution = Array.from({ length: parsedRackTotal }, (_, i) =>
    i < extraDistribution ? baseServersPerRack + 1 : baseServersPerRack
  );

  const rackSummary = distribution.reduce((acc, count) => {
    acc[count] = (acc[count] || 0) + 1;
    return acc;
  }, {});

  // Even distribution suggestion
  let serversForEvenDistribution = null;
  let additionalServersNeeded = null;

  if (validInputs) {
    const totalRUCapacity = parsedRackTotal * parsedRuPerRack;
    const maxPhysicalServers = Math.floor(totalRUCapacity / parsedServerRU);

    serversForEvenDistribution = parsedTotalServers;
    while (serversForEvenDistribution % parsedRackTotal !== 0) {
      serversForEvenDistribution++;
    }

    if (serversForEvenDistribution > maxPhysicalServers) {
      serversForEvenDistribution = null;
    } else {
      additionalServersNeeded = serversForEvenDistribution - parsedTotalServers;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="border border-gray-700 rounded-lg shadow-md p-6 bg-gray-800 w-full max-w-4xl mx-auto mb-8">
        <h1 className="text-xl font-bold mb-4 text-purple-300">Rack Layout Calculator</h1>

        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-300 text-sm mb-1 block">Total Servers:</span>
            <input
              type="number"
              className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg"
              value={totalServers}
              onChange={(e) => setTotalServers(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-gray-300 text-sm mb-1 block">Server RU:</span>
            <input
              type="number"
              className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg"
              value={serverRU}
              onChange={(e) => setServerRU(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-gray-300 text-sm mb-1 block">Rack Total:</span>
            <input
              type="number"
              className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg"
              value={rackTotal}
              onChange={(e) => setRackTotal(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-gray-300 text-sm mb-1 block">RU per Rack:</span>
            <input
              type="number"
              className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg"
              value={ruPerRack}
              onChange={(e) => setRuPerRack(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-purple-500 text-purple-300">
          <p>Max Servers Per Rack: <strong>{maxServersPerRack}</strong></p>
          <p>Base Servers Per Rack: <strong>{baseServersPerRack}</strong></p>
          <p>Extra Distribution: <strong>{extraDistribution}</strong></p>
          <p>Rack RU Available: <strong>{ruAvailableTotal}</strong></p>
          <p>Rack RU Needed: <strong>{totalRUNeeded}</strong></p>
          <p>RU Utilization: <strong>{ruUtilization}%</strong></p>

          {totalRUNeeded > ruAvailableTotal && (
            <p className="text-red-400 mt-2">
              ⚠️ Not enough RU available: You need <strong>{totalRUNeeded}</strong> RU but only have <strong>{ruAvailableTotal}</strong> RU across {parsedRackTotal} racks.
            </p>
          )}

          <h3 className="text-lg font-semibold mt-4">Rack Count Summary:</h3>
          <ul className="list-disc ml-5">
            {Object.entries(rackSummary).map(([count, racks]) => (
              <li key={count}>Racks with <strong>{count}</strong> servers: <strong>{racks}</strong></li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-4">Even Distribution Suggestion:</h3>


          
            {parsedTotalServers > 0 &&
             parsedServerRU > 0 &&
             parsedRackTotal > 0 &&
             parsedRuPerRack > 0 && (
              serversForEvenDistribution !== null ? (
                <p>
                  To evenly distribute servers across all racks: <strong>{serversForEvenDistribution}</strong> servers total (
                  {additionalServersNeeded > 0
                    ? `add ${additionalServersNeeded} more`
                    : "already even"}
                  ).
                </p>
              ) : (
                <p className="text-red-400">
                  ⚠️ Cannot evenly distribute more servers without exceeding rack RU limits.
                </p>
              )
            )}



          

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowDistribution(!showDistribution)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              {showDistribution ? 'Hide' : 'Show'} Server Distribution
            </button>

            <button
              onClick={() => {
                setTotalServers('');
                setServerRU('');
                setRackTotal('');
                setRuPerRack('');
                setShowDistribution(false);
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Reset
            </button>
          </div>

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
  );
}
