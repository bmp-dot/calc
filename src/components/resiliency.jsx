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
