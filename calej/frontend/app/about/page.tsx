export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About CalEJ</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CalEJ (California Environmental Justice Mapper) is a free, open-source platform that makes environmental health data accessible to all California residents. We believe everyone has the right to understand the environmental risks in their community.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This tool helps residents, researchers, policymakers, and community advocates identify disadvantaged communities facing disproportionate pollution burdens and health risks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">What is CalEnviroScreen?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CalEnviroScreen is a mapping tool developed by the California Environmental Protection Agency (CalEPA) that identifies communities disproportionately burdened by multiple sources of pollution and vulnerable to pollution's effects.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The tool combines <strong>20 indicators</strong> into a single CalEnviroScreen score for each census tract:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Pollution Burden (50%)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Ozone concentrations</li>
                <li>PM2.5 concentrations</li>
                <li>Diesel particulate matter</li>
                <li>Drinking water contaminants</li>
                <li>Pesticide use</li>
                <li>Toxic releases from facilities</li>
                <li>Traffic density</li>
                <li>Cleanup sites</li>
                <li>Groundwater threats</li>
                <li>Hazardous waste</li>
                <li>Impaired water bodies</li>
                <li>Solid waste sites</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Population Characteristics (50%)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Asthma rates</li>
                <li>Low birth weight</li>
                <li>Cardiovascular disease</li>
                <li>Education levels</li>
                <li>Housing burden</li>
                <li>Linguistic isolation</li>
                <li>Poverty</li>
                <li>Unemployment</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Disadvantaged Communities (DACs)</strong> are census tracts scoring in the top 25% statewide (≥75th percentile). These communities are prioritized for environmental justice funding and programs.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">Data Sources</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">CalEnviroScreen 4.0</h3>
              <p className="text-sm text-gray-600">
                California Environmental Protection Agency (CalEPA) Office of Environmental Health Hazard Assessment (OEHHA)
              </p>
              <a href="https://oehha.ca.gov/calenviroscreen" className="text-calej-blue text-sm hover:underline">
                oehha.ca.gov/calenviroscreen
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">EPA Superfund Sites</h3>
              <p className="text-sm text-gray-600">
                Comprehensive Environmental Response, Compensation, and Liability Information System (CERCLIS)
              </p>
              <a href="https://www.epa.gov/superfund" className="text-calej-blue text-sm hover:underline">
                epa.gov/superfund
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">EPA Toxics Release Inventory (TRI)</h3>
              <p className="text-sm text-gray-600">
                Annual reporting of toxic chemical releases by industrial facilities
              </p>
              <a href="https://www.epa.gov/toxics-release-inventory-tri-program" className="text-calej-blue text-sm hover:underline">
                epa.gov/tri
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">US Census Bureau</h3>
              <p className="text-sm text-gray-600">
                Census tract boundaries and demographic data from American Community Survey (ACS)
              </p>
              <a href="https://www.census.gov" className="text-calej-blue text-sm hover:underline">
                census.gov
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">How to Use This Tool</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>Search your area:</strong> Enter your address, city, or ZIP code to locate your census tract
            </li>
            <li>
              <strong>View the map:</strong> Tracts are color-coded by CalEnviroScreen percentile (green = low burden, red = high burden)
            </li>
            <li>
              <strong>Click a tract:</strong> See basic information in a popup, or click "View Full Details" for comprehensive data
            </li>
            <li>
              <strong>Explore facilities:</strong> View nearby EPA Superfund sites and TRI facilities contributing to pollution
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">Open Source & Community</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CalEJ is 100% free and open source under the MIT License. The code is available on GitHub for anyone to use, modify, or contribute to.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://github.com/psadigh91/CalEJ"
              className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              View on GitHub
            </a>
            <a
              href="https://github.com/psadigh91/CalEJ/issues"
              className="inline-block border-2 border-gray-800 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Report an Issue
            </a>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-800 mb-2">Disclaimer</h3>
          <p className="text-sm text-yellow-700">
            CalEJ is an informational tool. Data is provided by government agencies and may not be complete or up-to-date. This tool should not be used as the sole basis for legal, medical, or policy decisions. For official determinations, consult CalEPA and local authorities.
          </p>
        </div>
      </div>
    </div>
  );
}
