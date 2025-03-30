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
      <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-white w-full max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#7A1FA2]">Capacity Calculator</h2>
        <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col space-y-4 w-full lg:w-1/2">
          <input
            type="text"
            value={numServers}
            onChange={(e) => setNumServers(e.target.value)}
            placeholder="# BE hosts"
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            value={numNVMe}
            onChange={(e) => setNumNVMe(e.target.value)}
            placeholder="# NVMe per BE"
            className="p-2 border rounded-lg"
          />
          <select
            value={nvmeSize}
            onChange={(e) => setNvmeSize(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Select NVMe Size</option>
            <option value="30.72">30.72 TB</option>
            <option value="15.36">15.36 TB</option>
            <option value="7.68">7.68 TB</option>
            <option value="3.84">3.84 TB</option>
            <option value="1.92">1.92 TB</option>
          </select>
          <input
            type="text"
            value={data}
            readOnly
            placeholder="Data Stripe (auto-calculated)"
            className="p-2 border rounded-lg bg-gray-200 cursor-not-allowed"
          />
          <select
            value={parity}
            onChange={(e) => setParity(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Protection Level</option>
            <option value="2">+2</option>
            <option value="3">+3</option>
            <option value="4">+4</option>
          </select>
<select
  value={failureDomain}
  onChange={(e) => setFailureDomain(e.target.value)}
  className="p-2 border rounded-lg"
>
  <option value=""># of Failure Domains</option>
  {(() => {
    const options = [];
    const num = parseInt(numServers);
    if (!isNaN(num) && num > 0) {
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
    return options.map(val => (
      <option key={val} value={val}>{val}</option>
    ));
  })()}
</select>

          <input
            type="text"
            value={spare}
            onChange={(e) => setSpare(e.target.value)}
            placeholder="Virtual Hot Spare"
            className="p-2 border rounded-lg"
          />
        </div>
        <div className="flex flex-col space-y-4 w-full lg:w-1/2 bg-white border border-[#7A1FA2] p-4 rounded-lg text-[#7A1FA2]">
          {rawTotal !== null && <p className="text-lg">Total Raw Capacity TB: <span className="font-bold">{rawTotal.split(': ')[1]}</span></p>}
          {usableCapacity !== null && <p className="text-lg">Total Usable Capacity TB: <span className="font-bold">{usableCapacity.split(': ')[1]}</span></p>}
          {result !== null && <p className="text-lg">Total Number of drives: <span className="font-bold">{result.split(': ')[1]}</span></p>}
          {efficiency !== null && rawTotal !== null && usableCapacity !== null && <p className="text-lg">Efficiency: <span className="font-bold">{efficiency.split(': ')[1]}</span></p>}
        {backendsPerDomain !== null && <p className="text-lg">Backends per Failure Domain: <span className="font-bold">{backendsPerDomain.split(': ')[1]}</span></p>}
          {failureDomainUsable !== null && <p className="text-lg">Failure Domain Usable Capacity: <span className="font-bold">{failureDomainUsable.split(': ')[1]}</span></p>}
        </div>
      </div>
      </div>

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
          <input
            type="text"
            value={failureDomainUsable ? failureDomainUsable.split(': ')[1] : ''}
            readOnly
            placeholder="Failure Domain Usable Capacity"
            className="p-2 border rounded-lg bg-gray-200 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
