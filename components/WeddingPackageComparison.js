'use client'

import { useState, useEffect } from 'react'

const WeddingPackageComparison = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPackages, setSelectedPackages] = useState([])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/wedding/packages')
        if (response.ok) {
          const data = await response.json()
          setPackages(data.packages || [])
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const handlePackageSelect = (pkg) => {
    setSelectedPackages(prev => {
      const isSelected = prev.find(p => p.id === pkg.id)
      if (isSelected) {
        return prev.filter(p => p.id !== pkg.id)
      } else {
        return [...prev, pkg].slice(0, 3) // Limit to 3 packages
      }
    })
  }

  const getAllFeatures = () => {
    const allFeatures = new Set()
    packages.forEach(pkg => {
      pkg.features.forEach(feature => allFeatures.add(feature))
    })
    return Array.from(allFeatures)
  }

  const hasFeature = (pkg, feature) => {
    return pkg.features.includes(feature)
  }

  const formatPrice = (price) => {
    return `$${(price / 100).toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Compare Wedding Packages
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select up to 3 packages to compare features, pricing, and value
        </p>
      </div>

      {/* Package Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Packages to Compare
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedPackages.find(p => p.id === pkg.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePackageSelect(pkg)}
            >
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">{pkg.name}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatPrice(pkg.price)}
                </div>
                <div className="text-sm text-gray-600">{pkg.duration} hours</div>
                <div className={`w-6 h-6 rounded-full border-2 mx-auto mt-2 ${
                  selectedPackages.find(p => p.id === pkg.id)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPackages.find(p => p.id === pkg.id) && (
                    <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedPackages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Features
                  </th>
                  {selectedPackages.map((pkg) => (
                    <th key={pkg.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Pricing Row */}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Price
                  </td>
                  {selectedPackages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(pkg.price)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Duration Row */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Coverage Duration
                  </td>
                  {selectedPackages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {pkg.duration} hours
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Features */}
                {getAllFeatures().map((feature) => (
                  <tr key={feature}>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {feature}
                    </td>
                    {selectedPackages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center">
                        {hasFeature(pkg, feature) ? (
                          <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Value Analysis */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Price per Hour
                  </td>
                  {selectedPackages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      <div className="text-sm font-semibold text-gray-700">
                        {formatPrice(Math.round(pkg.price / pkg.duration))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Features per Hour
                  </td>
                  {selectedPackages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      <div className="text-sm font-semibold text-gray-700">
                        {(pkg.features.length / pkg.duration).toFixed(1)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {selectedPackages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recommendations
          </h3>
          <div className="space-y-4">
            {selectedPackages.length >= 2 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Best Value</h4>
                <p className="text-sm text-blue-700">
                  {(() => {
                    const bestValue = selectedPackages.reduce((best, current) => {
                      const bestRatio = best.features.length / best.price
                      const currentRatio = current.features.length / current.price
                      return currentRatio > bestRatio ? current : best
                    })
                    return `${bestValue.name} offers the most features per dollar at ${(bestValue.features.length / (bestValue.price / 100)).toFixed(2)} features per $100.`
                  })()}
                </p>
              </div>
            )}

            {selectedPackages.length >= 2 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Most Comprehensive</h4>
                <p className="text-sm text-green-700">
                  {(() => {
                    const mostFeatures = selectedPackages.reduce((best, current) => 
                      current.features.length > best.features.length ? current : best
                    )
                    return `${mostFeatures.name} includes the most features (${mostFeatures.features.length}) for the most complete coverage.`
                  })()}
                </p>
              </div>
            )}

            {selectedPackages.length >= 2 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Budget Friendly</h4>
                <p className="text-sm text-yellow-700">
                  {(() => {
                    const cheapest = selectedPackages.reduce((best, current) => 
                      current.price < best.price ? current : best
                    )
                    return `${cheapest.name} is the most affordable option at ${formatPrice(cheapest.price)} while still providing quality coverage.`
                  })()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call to Action */}
      {selectedPackages.length > 0 && (
        <div className="text-center">
          <a
            href="/wedding-booking"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started with Your Preferred Package
          </a>
        </div>
      )}
    </div>
  )
}

export default WeddingPackageComparison 