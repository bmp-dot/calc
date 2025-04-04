import React, { useState, useEffect } from 'react';

export default function CalculatorApp() {
  const [numServers, setNumServers] = useState('');
  const [numNVMe, setNumNVMe] = useState('');
  const [nvmeSize, setNvmeSize] = useState('');
  const [data, setData] = useState('');
  const [parity, setParity] = useState('');
  const [spare, setSpare] = useState('');
  const [failureDomain, setFailureDomain] = useState('');
  const [result, setResult] = useState(null);
  const [rawTotal, setRawTotal] = useState(null);
  const [usableCapacity, setUsableCapacity] = useState(null);
  const [efficiency, setEfficiency] = useState(null);
  const [backendsPerDomain, setBackendsPerDomain] = useState(null);
  const [failureDomainUsable, setFailureDomainUsable] = useState(null);

  useEffect(() => {
    // Automatically calculate Data Stripe using formula: IF(SUM(numServers - parity -1)>16,16,SUM(numServers - parity -1))
    const serversNum = parseFloat(numServers);
    const parityNum = parseFloat(parity);
    if (!isNaN(serversNum) && !isNaN(parityNum)) {
      const computedData = Math.min(16, serversNum - parityNum - 1);
      setData(!isNaN(computedData) && computedData > 0 ? computedData.toString() : '');
    }

    const servers = parseFloat(numServers);
    const nvme = parseFloat(numNVMe);
    const size = parseFloat(nvmeSize);
    const parityValue = parseFloat(parity);
    const dataValue = Math.min(16, servers - parityValue - 1);
    const spareValue = parseFloat(spare);

    let totalDrives = null;
    let rawTotalCapacity = null;
    let totalUsableCapacity = null;
    let efficiencyValue = null;

    if (!isNaN(servers) && !isNaN(nvme)) {
      totalDrives = servers * nvme;
    }

    

    if (!isNaN(servers) && !isNaN(nvme) && !isNaN(size)) {
      rawTotalCapacity = servers * nvme * size;
    }

    if (
      !isNaN(rawTotalCapacity) &&
      !isNaN(servers) &&
      !isNaN(spareValue) &&
      !isNaN(dataValue) &&
      !isNaN(parityValue) &&
      (dataValue + parityValue) !== 0
    ) {
      totalUsableCapacity =
        rawTotalCapacity * ((servers - spareValue) / servers) * (dataValue / (dataValue + parityValue)) * 0.9;
    }

    if (!isNaN(totalUsableCapacity) && !isNaN(rawTotalCapacity) && rawTotalCapacity !== 0) {
      efficiencyValue = totalUsableCapacity / rawTotalCapacity;
    }

    setResult(totalDrives !== null ? `Total Number of drives: ${totalDrives.toLocaleString()}` : null);
    setRawTotal(rawTotalCapacity !== null ? `Total Raw Capacity TB: ${rawTotalCapacity.toLocaleString()}` : null);
    setUsableCapacity(totalUsableCapacity !== null ? `Total Usable Capacity TB: ${totalUsableCapacity.toLocaleString()}` : null);
    setEfficiency(efficiencyValue !== null ? `Efficiency: ${(efficiencyValue * 100).toFixed(2)}%` : null);
    const failureDomainValue = parseInt(failureDomain);
    if (!isNaN(failureDomainValue) && !isNaN(servers) && failureDomainValue !== 0) {
      const perDomain = servers / failureDomainValue;
      if (!isNaN(totalUsableCapacity)) {
        const usablePerDomain = totalUsableCapacity / failureDomainValue;
        setFailureDomainUsable(`Failure Domain Usable Capacity: ${usablePerDomain.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      }
      setBackendsPerDomain(`Backends per Failure Domain: ${perDomain.toFixed(2)}`);
    } else {
      setBackendsPerDomain(null);
    }
  }, [numServers, numNVMe, nvmeSize, data, parity, spare, failureDomain]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 sm:p-8">

      {/* Resiliency Calculator Section */}
      <div className="mt-12 border border-gray-300 rounded-lg shadow-md p-6 bg-white w-full max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-[#7A1FA2]">Resiliency Calculator</h2>
        <div className="flex flex-col space-y-4 w-full lg:w-1/2">
          
          <input
            type="text"
            placeholder="# Compute Cores per BE"
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Percent Full"
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            value={failureDomainUsable ? failureDomainUsable.split(': ')[1] : ''}
            readOnly
            placeholder="Failure Domain Usable Capacity"
            className="p-2 border rounded-lg bg-gray-200 cursor-not-allowed"
          />
          <select
            className="p-2 border rounded-lg"
            
            
          >
            <option value=""># FD Failures</option>
            {[1, 2, 3, 4].filter(n => !parity || n <= parseInt(parity)).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

