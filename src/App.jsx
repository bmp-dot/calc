import React, { useState, useEffect, useCallback } from 'react';

const NVME_SIZES = [1.92, 3.84, 7.68, 15.36, 30.72, 61.44, 122.88];
const FOUR_K_SIZES = [1.6, 3.2, 6.4, 12.8, 25.6];
const PROTECTION_LEVELS = [2, 3, 4];

export default function CalculatorApp() {
  // State declarations remain the same
  const [numServers, setNumServers] = useState('');
  const [numNVMe, setNumNVMe] = useState('');
  const [nvmeSize, setNvmeSize] = useState('');
  // ... other states

  const calculateMetrics = useCallback(() => {
    const servers = parseInt(numServers) || 0;
    const nvme = parseInt(numNVMe) || 0;
    const size = parseFloat(nvmeSize) || 0;
    const fourKSize = parseFloat(fourKDrivers) || 0;
    const parityValue = parseInt(parity) || 0;
    const spareValue = parseInt(spare) || 0;
    const hostFailuresValue = parseInt(hostFailures) || 0;
    const failureDomainValue = parseInt(failureDomain) || 0;

    // Calculate number of 4K drives
    const fourKDrivesCount = size > 31 && fourKSize > 0 && nvme > 0 
      ? Math.max(Math.ceil(nvme / 11), 1) 
      : 0;
    setNumFourKDrives(fourKDrivesCount > 0 ? fourKDrivesCount.toString() : '');

    const totalDrives = servers * (nvme + fourKDrivesCount);
    const rawTotalCapacity = servers * (nvme * size + fourKDrivesCount * fourKSize);

    // Efficiency calculation
    const getEfficiencyFactor = (capacity) => {
      if (capacity >= 200000) return 0.97;
      if (capacity >= 150000) return 0.96;
      if (capacity >= 100000) return 0.95;
      if (capacity >= 50000) return 0.94;
      if (capacity >= 5000) return 0.93;
      if (capacity >= 1000) return 0.92;
      return 0.9;
    };

    const efficiencyFactor = getEfficiencyFactor(rawTotalCapacity);
    const dataValue = servers > parityValue ? Math.min(16, servers - parityValue - 1) : 0;
    const usableCapacity = servers > spareValue && dataValue + parityValue > 0
      ? rawTotalCapacity * 
        ((servers - spareValue) / servers) * 
        (dataValue / (dataValue + parityValue)) * 
        efficiencyFactor
      : 0;

    // Update all states
    setResult(totalDrives > 0 ? `Total Drives: ${totalDrives.toLocaleString()}` : null);
    setRawTotal(rawTotalCapacity > 0 
      ? `Raw Capacity (TB): ${rawTotalCapacity.toLocaleString(undefined, { maximumFractionDigits: 2 })}` 
      : null);
    setUsableCapacity(usableCapacity > 0
      ? `Usable Capacity (TB): ${usableCapacity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : null);
    setEfficiency(usableCapacity > 0 && rawTotalCapacity > 0
      ? `Efficiency: ${((usableCapacity / rawTotalCapacity) * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
      : null);
    
    // Failure domain calculations
    if (failureDomainValue > 0 && servers > 0) {
      const perDomain = servers / failureDomainValue;
      const usablePerDomain = usableCapacity / failureDomainValue;
      setBackendsPerDomain(`Backends/Failure Domain: ${perDomain.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      setFailureDomainUsable(usablePerDomain > 0
        ? `Failure Domain Usable (TB): ${usablePerDomain.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        : null);
    } else {
      setBackendsPerDomain(null);
      setFailureDomainUsable(null);
    }
  }, [numServers, numNVMe, nvmeSize, fourKDrivers, parity, spare, failureDomain, hostFailures]);

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex justify-center">
      <div className="border border-gray-700 rounded-lg shadow-md p-6 bg-gray-800 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4 text-purple-300">Storage Capacity Calculator</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Input fields with labels for better accessibility */}
            <div>
              <label className="block text-sm mb-1">Number of BE Hosts</label>
              <input
                type="number"
                value={numServers}
                onChange={(e) => setNumServers(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
                min="0"
              />
            </div>
            {/* Add similar labels to other inputs */}
            <div>
              <label className="block text-sm mb-1">NVMe Size</label>
              <select
                value={nvmeSize}
                onChange={(e) => {
                  setNvmeSize(e.target.value);
                  if (parseFloat(e.target.value) <= 31) {
                    setFourKDrivers('');
                    setNumFourKDrives('');
                  }
                }}
                className="w-full p-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
              >
                <option value="">Select NVMe Size</option>
                {NVME_SIZES.map(size => (
                  <option key={size} value={size}>{size} TB</option>
                ))}
              </select>
            </div>
            {/* Rest of the inputs */}
          </div>
          <div className="space-y-4 bg-gray-800 border border-purple-500 p-4 rounded-lg text-purple-300">
            {[rawTotal, usableCapacity, result, efficiency, backendsPerDomain, failureDomainUsable]
              .filter(Boolean)
              .map((metric, index) => (
                <p key={index} className="text-lg">{metric}</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
