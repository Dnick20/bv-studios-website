'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AdminLayout, safeJson } from '../../../lib/imports.js'
import {
  RocketLaunchIcon,
  PlayIcon,
  StopIcon,
  Cog6ToothIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function DeploymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [deploymentData, setDeploymentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [configModal, setConfigModal] = useState(false)
  const [config, setConfig] = useState({})

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/admin')
      return
    }

    fetchDeploymentData()
  }, [session, status, router])

  const fetchDeploymentData = async () => {
    try {
      const response = await fetch('/api/admin/bots/deployment')
      if (response.ok) {
        const data = await safeJson(response)
        setDeploymentData(data)
        setConfig({
          deploymentDelay: data.status?.deploymentDelay || 30000,
          maxDeploymentsPerHour: data.status?.maxDeploymentsPerHour || 5,
        })
      }
    } catch (error) {
      console.error('Error fetching deployment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeAction = async (action, additionalData = {}) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/bots/deployment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...additionalData,
        }),
      })

      if (response.ok) {
        const result = await safeJson(response)
        console.log(`${action} result:`, result)

        // Refresh data
        await fetchDeploymentData()

        // Show success message
        alert(`Action "${action}" completed successfully!`)
      } else {
        const error = await safeJson(response)
        alert(`Action failed: ${error.message}`)
      }
    } catch (error) {
      console.error(`Error executing ${action}:`, error)
      alert(`Error executing ${action}: ${error.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  const updateConfig = async () => {
    try {
      await executeAction('update-config', { config })
      setConfigModal(false)
    } catch (error) {
      console.error('Error updating config:', error)
    }
  }

  const formatDuration = (ms) => {
    if (!ms) return 'N/A'
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    }
    return `${seconds}s`
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <RocketLaunchIcon className="h-8 w-8 text-blue-600 mr-3" />
            Auto-Deployment Management
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and control automatic deployments triggered by bot
            activities
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full ${
                  deploymentData?.status?.enabled
                    ? 'bg-green-100'
                    : 'bg-red-100'
                }`}
              >
                {deploymentData?.status?.enabled ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p
                  className={`text-lg font-semibold ${
                    deploymentData?.status?.enabled
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {deploymentData?.status?.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Pending Deployments
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {deploymentData?.status?.pendingDeployments?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100">
                <RocketLaunchIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Deployments This Hour
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {deploymentData?.status?.deploymentCount || 0} /{' '}
                  {deploymentData?.status?.maxDeploymentsPerHour || 5}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full ${
                  deploymentData?.isDeploying ? 'bg-yellow-100' : 'bg-gray-100'
                }`}
              >
                <ExclamationTriangleIcon
                  className={`h-6 w-6 ${
                    deploymentData?.isDeploying
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Currently Deploying
                </p>
                <p
                  className={`text-lg font-semibold ${
                    deploymentData?.isDeploying
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}
                >
                  {deploymentData?.isDeploying ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => executeAction('enable')}
              disabled={actionLoading || deploymentData?.status?.enabled}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Enable Auto-Deploy
            </button>

            <button
              onClick={() => executeAction('disable')}
              disabled={actionLoading || !deploymentData?.status?.enabled}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <StopIcon className="h-5 w-5 mr-2" />
              Disable Auto-Deploy
            </button>

            <button
              onClick={() => executeAction('manual-deploy')}
              disabled={actionLoading || deploymentData?.isDeploying}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Manual Deploy
            </button>

            <button
              onClick={() => setConfigModal(true)}
              disabled={actionLoading}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Configuration
            </button>
          </div>
        </div>

        {/* Last Deployment */}
        {deploymentData?.lastDeployment && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Last Deployment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  {deploymentData.lastDeployment.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDuration(deploymentData.lastDeployment.duration)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Timestamp</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatTimestamp(deploymentData.lastDeployment.timestamp)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">URL</p>
                <a
                  href={deploymentData.lastDeployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {deploymentData.lastDeployment.url}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Deployment History */}
        {deploymentData?.deploymentHistory &&
          deploymentData.deploymentHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Deployment History
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Environment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trigger
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deploymentData.deploymentHistory
                      .slice(-10)
                      .reverse()
                      .map((deployment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTimestamp(deployment.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {deployment.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {deployment.environment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {deployment.trigger || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                deployment.status === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {deployment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Configuration Modal */}
        {configModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Auto-Deployment Configuration
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deployment Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={config.deploymentDelay}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        deploymentDelay: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Deployments Per Hour
                  </label>
                  <input
                    type="number"
                    value={config.maxDeploymentsPerHour}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        maxDeploymentsPerHour: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setConfigModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateConfig}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
