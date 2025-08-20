'use client'

import { useState, useEffect } from 'react'
import { AdminLayout, safeJson } from '../../../lib/imports.js'

export default function BotsPage() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [error, setError] = useState(null)

  // Helper to safely parse JSON
  // Using shared safeJson utility

  // Fetch bot health status
  const fetchHealth = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/bots/health')
      const data = await safeJson(res)
      setHealth(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch bot health status')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Test a specific bot operation
  const testBot = async (botType, operation) => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/bots/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botType,
          operation,
          options: {
            limit: 5, // Limit results for testing
          },
        }),
      })
      const data = await safeJson(res)
      setTestResult(data)
      setError(null)
    } catch (err) {
      setError('Bot test failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    // Refresh health status every 5 minutes
    const interval = setInterval(fetchHealth, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Bot Management</h1>

        {/* Health Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Bot Health Status</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {health && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(health.bots).map(([botName, status]) => (
                <div key={botName} className="p-4 border rounded-lg">
                  <h3 className="font-semibold capitalize">{botName} Bot</h3>
                  <p
                    className={`mt-2 ${
                      status.database ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    Status: {status.database ? 'Healthy' : 'Unhealthy'}
                  </p>
                  {status.capabilities && (
                    <div className="mt-2">
                      <p className="font-medium">Capabilities:</p>
                      <ul className="list-disc list-inside">
                        {status.capabilities.map((cap) => (
                          <li key={cap} className="text-sm">
                            {cap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Operations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Bot Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Content Bot Tests */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Content Bot</h3>
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => testBot('content', 'seo-descriptions')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test SEO Descriptions
                </button>
                <button
                  onClick={() => testBot('content', 'social-captions')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test Social Captions
                </button>
              </div>
            </div>

            {/* Database Bot Tests */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Database Bot</h3>
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => testBot('database', 'health-check')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test Health Check
                </button>
                <button
                  onClick={() => testBot('database', 'analytics')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test Analytics
                </button>
              </div>
            </div>

            {/* Lead Bot Tests */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Lead Bot</h3>
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => testBot('lead', 'score-leads')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test Lead Scoring
                </button>
                <button
                  onClick={() => testBot('lead', 'qualify-inquiries')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test Lead Qualification
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
