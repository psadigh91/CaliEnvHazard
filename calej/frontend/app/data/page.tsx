export default function DataSourcesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Data Sources</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">CalEnviroScreen 4.0</h2>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              <strong>Source:</strong> California Environmental Protection Agency (CalEPA) - Office of Environmental Health Hazard Assessment (OEHHA)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Release Date:</strong> October 2021
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Coverage:</strong> 8,035 California census tracts
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Update Frequency:</strong> Every 3-4 years
            </p>
            <a
              href="https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40"
              className="text-calej-blue hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Official Site →
            </a>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-gray-800 mb-3">Indicators Included (20 total)</h3>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Pollution Burden (12 indicators)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Exposures</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Ozone</li>
                    <li>PM2.5</li>
                    <li>Diesel PM</li>
                    <li>Drinking water contaminants</li>
                    <li>Pesticide use</li>
                    <li>Toxic releases from facilities</li>
                    <li>Traffic density</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Environmental Effects</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Cleanup sites</li>
                    <li>Groundwater threats</li>
                    <li>Hazardous waste facilities</li>
                    <li>Impaired water bodies</li>
                    <li>Solid waste sites and facilities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Population Characteristics (8 indicators)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Sensitive Populations</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Asthma</li>
                    <li>Low birth weight</li>
                    <li>Cardiovascular disease</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Socioeconomic Factors</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Educational attainment</li>
                    <li>Housing burden</li>
                    <li>Linguistic isolation</li>
                    <li>Poverty</li>
                    <li>Unemployment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">EPA Superfund Sites (CERCLIS)</h2>
          <p className="text-gray-700 mb-2">
            <strong>Source:</strong> US Environmental Protection Agency - Comprehensive Environmental Response, Compensation, and Liability Information System
          </p>
          <p className="text-gray-700 mb-2">
            <strong>What it is:</strong> Database of hazardous waste sites identified for cleanup under the federal Superfund program
          </p>
          <p className="text-gray-700 mb-2">
            <strong>California Sites:</strong> 97 sites on the National Priorities List (NPL)
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Update Frequency:</strong> Quarterly
          </p>
          <a
            href="https://www.epa.gov/superfund/search-superfund-sites-where-you-live"
            className="text-calej-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Search EPA Superfund Sites →
          </a>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-gray-800 mb-2">NPL Status Categories</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Proposed NPL:</strong> Site proposed for addition to the National Priorities List</li>
              <li><strong>Final NPL:</strong> Site officially on the NPL, eligible for Superfund cleanup</li>
              <li><strong>Deleted NPL:</strong> Site removed after cleanup completion</li>
              <li><strong>CERCLIS-NFRAP:</strong> Site assessed but no further remedial action planned</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">EPA Toxics Release Inventory (TRI)</h2>
          <p className="text-gray-700 mb-2">
            <strong>Source:</strong> US Environmental Protection Agency - Toxics Release Inventory Program
          </p>
          <p className="text-gray-700 mb-2">
            <strong>What it is:</strong> Annual reports of toxic chemical releases from industrial facilities
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Reporting Threshold:</strong> Facilities that manufacture, process, or use certain toxic chemicals above threshold amounts
          </p>
          <p className="text-gray-700 mb-2">
            <strong>California Facilities:</strong> ~1,500 reporting facilities
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Update Frequency:</strong> Annually (data released with 2-year lag)
          </p>
          <a
            href="https://www.epa.gov/toxics-release-inventory-tri-program"
            className="text-calej-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn About TRI →
          </a>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-gray-800 mb-2">Industries Covered</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Chemical manufacturing</li>
              <li>Petroleum refineries</li>
              <li>Primary metals</li>
              <li>Electrical equipment</li>
              <li>Transportation equipment</li>
              <li>Hazardous waste treatment</li>
              <li>Solvent recovery</li>
              <li>And 30+ other industry sectors</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-calej-blue mb-4">US Census Bureau</h2>
          <p className="text-gray-700 mb-2">
            <strong>Source:</strong> US Census Bureau TIGER/Line Shapefiles and American Community Survey (ACS)
          </p>
          <p className="text-gray-700 mb-2">
            <strong>What it is:</strong> Census tract boundaries (geographic polygons) and demographic data
          </p>
          <p className="text-gray-700 mb-2">
            <strong>California Census Tracts:</strong> 8,000+ tracts (avg. population 4,000-5,000 per tract)
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Update Frequency:</strong> Tract boundaries every 10 years (decennial census), demographic data annually (ACS)
          </p>
          <a
            href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html"
            className="text-calej-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download TIGER/Line Files →
          </a>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-gray-800 mb-2">What is a Census Tract?</h3>
            <p className="text-sm text-gray-700">
              Census tracts are small, relatively permanent statistical subdivisions of a county. They generally have between 1,200 and 8,000 people, with an optimum size of 4,000 people. Boundaries are designed to be stable over time to allow for statistical comparisons from decade to decade.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-calej-blue mb-3">Data Usage & Licensing</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Public Domain:</strong> All government data sources (CalEnviroScreen, EPA, Census) are in the public domain and free to use.
            </p>
            <p>
              <strong>Attribution:</strong> While not required by law, we encourage attribution when using this data:
              <code className="block mt-2 bg-white p-2 rounded text-xs">
                Data sources: CalEnviroScreen 4.0 (OEHHA), EPA Superfund/TRI, US Census Bureau
              </code>
            </p>
            <p>
              <strong>No Warranties:</strong> Government data is provided "as is" without warranties. CalEJ does not guarantee accuracy, completeness, or timeliness.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-3">Important Notes</h2>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>
              <strong>Data Lag:</strong> CalEnviroScreen 4.0 uses data from 2017-2019. Environmental conditions may have changed since then.
            </li>
            <li>
              <strong>Census Tracts Only:</strong> Data is aggregated at the census tract level, not individual addresses. Conditions may vary within a tract.
            </li>
            <li>
              <strong>Score Interpretation:</strong> Higher scores indicate higher pollution burden, not necessarily poor health outcomes for all residents.
            </li>
            <li>
              <strong>Limitations:</strong> Not all pollution sources are captured. Some environmental hazards may not be included in CalEnviroScreen.
            </li>
            <li>
              <strong>Official Determinations:</strong> For legal or policy decisions, consult CalEPA directly at{' '}
              <a href="https://calepa.ca.gov" className="underline">calepa.ca.gov</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
