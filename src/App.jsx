import React, { useState, useEffect } from 'react';

export default function CalculatorApp() {
  const [numServers, setNumServers] = useState('');
  const [numNVMe, setNumNVMe] = useState('');
  const [nvmeSize, setNvmeSize] = useState('');
  const [fourKDrivers, setFourKDrivers] = useState('');
  const [numFourKDrives, setNumFourKDrives] = useState(''); // Displays per-server count
  const [parity, setParity] = useState('');
  const [spare, setSpare] = useState('');
  const [failureDomain, setFailureDomain] = useState('');
  const [hostFailures, setHostFailures] = useState('');
  const [result, setResult] = useState(null);
  const [rawTotal, setRawTotal] = useState(null);
  const [usableCapacity, setUsableCapacity] = useState(null);
  const [efficiency, setEfficiency] = useState(null);
  const [backendsPerDomain, setBackendsPerDomain] = useState(null);
  const [failureDomainUsable, setFailureDomainUsable] = useState(null);
  const [capacityToRecover, setCapacityToRecover] = useState(null);

  useEffect(() => {
    const servers = parseInt(numServers) || 0;
    const nvme = parseInt(numNVMe) || 0;
    const size = parseFloat(nvmeSize) || 0;
    const fourKSize = parseFloat(fourKDrivers) || 0;

    // Calculate 4k drives per server
    const fourKDrivesCount = size > 31 && fourKSize > 0 && nvme > 0 ? Math.max(Math.ceil(nvme / 11), 1) : 0;
    setNumFourKDrives(fourKDrivesCount > 0 ? fourKDrivesCount.toString() : '');

    const parityValue = parseInt(parity) || 0;
    const spareValue = parseInt(spare) || 0;
    const hostFailuresValue = parseInt(hostFailures) || 0;
    const failureDomainValue = parseInt(failureDomain) || 0;

   const totalDrives = (servers * nvme) + (servers * fourKDrivesCount);

    let rawTotalCapacity = 0;
    if (totalDrives > 0 && size > 0) {
      rawTotalCapacity = (servers * nvme * size) + (fourKDrivesCount * servers * fourKSize);
    }

    if (servers > 0 && nvme > 0 && size > 0 && hostFailuresValue >= 0) {
      const recoveryCapacity = nvme * size * hostFailuresValue * ((servers - spareValue) / servers) * 0.9;
      setCapacityToRecover(
        `Capacity to Recover (TB): ${recoveryCapacity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      );
    } else {
      setCapacityToRecover(null);
    }

    const dataValue = servers > parityValue ? Math.min(16, servers - parityValue - 1) : 0;
    let totalUsableCapacity = 0;

    // Determine variable efficiencyFactor based on rawTotalCapacity
    let efficiencyFactor = 0.9;
    if (rawTotalCapacity >= 200000) efficiencyFactor = 0.97;
    else if (rawTotalCapacity >= 150000) efficiencyFactor = 0.96;
    else if (rawTotalCapacity >= 100000) efficiencyFactor = 0.95;
    else if (rawTotalCapacity >= 50000) efficiencyFactor = 0.94;
    else if (rawTotalCapacity >= 5000) efficiencyFactor = 0.93;
    else if (rawTotalCapacity >= 1000) efficiencyFactor = 0.92;

    if (servers > spareValue && dataValue + parityValue > 0) {
      totalUsableCapacity =
        rawTotalCapacity * ((servers - spareValue) / servers) * (dataValue / (dataValue + parityValue)) * efficiencyFactor;
    }

    const efficiencyValue = rawTotalCapacity > 0 ? totalUsableCapacity / rawTotalCapacity : 0;

    setResult(totalDrives > 0 ? `Total Number of drives: ${totalDrives.toLocaleString()}` : null);
    setRawTotal(
      rawTotalCapacity > 0
        ? `Total Raw Capacity TB: ${rawTotalCapacity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        : null
    );
    setUsableCapacity(
      totalUsableCapacity > 0
        ? `Total Usable Capacity TB: ${totalUsableCapacity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        : null
    );
    setEfficiency(
      efficiencyValue > 0
        ? `Efficiency: ${(efficiencyValue * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
        : null
    );

    if (failureDomainValue > 0 && servers > 0) {
      const perDomain = servers / failureDomainValue;
      const usablePerDomain = totalUsableCapacity / failureDomainValue;
      setBackendsPerDomain(
        `Backends per Failure Domain: ${perDomain.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      );
      setFailureDomainUsable(
        usablePerDomain > 0
          ? `Failure Domain Usable Capacity TB: ${usablePerDomain.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          : null
      );
    } else {
      setBackendsPerDomain(null);
      setFailureDomainUsable(null);
    }
  }, [numServers, numNVMe, nvmeSize, fourKDrivers, parity, spare, failureDomain, hostFailures]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-white w-full max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#7A1FA2]">Capacity Calculator</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col space-y-4 w-full lg:w-1/2">
            <input type="number" value={numServers} onChange={(e) => setNumServers(e.target.value)} placeholder="# BE hosts" className="p-2 border rounded-lg" min="0" />
            <input type="number" value={numNVMe} onChange={(e) => setNumNVMe(e.target.value)} placeholder="# NVMe per BE" className="p-2 border rounded-lg" min="0" />
            <select value={nvmeSize} onChange={(e) => { setNvmeSize(e.target.value); if (parseFloat(e.target.value) <= 31) { setFourKDrivers(''); setNumFourKDrives(''); } }} className="p-2 border rounded-lg">
              <option value="">Select NVMe Size</option>
              {[1.92, 3.84, 7.68, 15.36, 30.72, 61.44, 122.88].map((size) => (
                <option key={size} value={size}>{size} TB</option>
              ))}
            </select>
            {parseFloat(nvmeSize) > 31 && (
              <>
                <select value={fourKDrivers} onChange={(e) => setFourKDrivers(e.target.value)} className="p-2 border rounded-lg">
                  <option value="">Select 4k NVMe Size</option>
                  {[1.6, 3.2, 6.4, 12.8, 25.6].map((size) => (
                    <option key={size} value={size}>{size} TB</option>
                  ))}
                </select>
                <input type="number" value={numFourKDrives} readOnly placeholder="# 4k Drives per Server (auto-calculated)" className="p-2 border rounded-lg bg-gray-200 cursor-not-allowed" />
              </>
            )}
            <input type="number" value={parity ? Math.min(16, (parseInt(numServers) || 0) - parseInt(parity) - 1) : ''} readOnly placeholder="Data Stripe (auto-calculated)" className="p-2 border rounded-lg bg-gray-200 cursor-not-allowed" />
            <select value={parity} onChange={(e) => setParity(e.target.value)} className="p-2 border rounded-lg">
              <option value="">Protection Level</option>
              {[2, 3, 4].map((p) => (
                <option key={p} value={p}>+{p}</option>
              ))}
            </select>
            <select value={failureDomain} onChange={(e) => setFailureDomain(e.target.value)} className="p-2 border rounded-lg">
              <option value=""># of Failure Domains</option>
              {(() => {
                const options = [];
                const num = parseInt(numServers) || 0;
                if (num > 0) {
                  for (let div = 1; div <= num; div++) {
                    if (num % div === 0) {
                      const value = num / div;
                      if (value < 19) continue;
                      if (value > 0 && !options.includes(value)) {
                        options.push(value);
                      }
                    }
                  }
                }
                return options.map((val) => (
                  <option key={val} value={val}>{val}</option>
                ));
              })()}
            </select>
            <input type="number" value={spare} onChange={(e) => setSpare(e.target.value)} placeholder="Virtual Hot Spare" className="p-2 border rounded-lg" min="0" />
          </div>
          <div className="flex flex-col space-y-4 w-full lg:w-1/2 bg-white border border-[#7A1FA2] p-4 rounded-lg text-[#7A1FA2]">
            {rawTotal && <p className="text-lg">{rawTotal}</p>}
            {usableCapacity && <p className="text-lg">{usableCapacity}</p>}
            {result && <p className="text-lg">{result}</p>}
            {efficiency && <p className="text-lg">{efficiency}</p>}
            {backendsPerDomain && <p className="text-lg">{backendsPerDomain}</p>}
            {failureDomainUsable && <p className="text-lg">{failureDomainUsable}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
