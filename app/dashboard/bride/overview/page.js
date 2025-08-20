'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { safeFetchJson } from '@/lib/utils/safeJson'

export default function BrideOverviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [weddingDate, setWeddingDate] = useState('')
  const [brideName, setBrideName] = useState('Bride')
  const [groomName, setGroomName] = useState('Groom')
  const [responses, setResponses] = useState({})

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    load()
  }, [session, status, router])

  const load = async () => {
    try {
      setLoading(true)
      const res = await safeFetchJson(
        '/api/wedding/questionnaire',
        {},
        { data: {} }
      )
      const q = res?.data?.questionnaire || null
      if (!q) {
        router.push('/dashboard/bride')
        return
      }
      setWeddingDate(
        q?.weddingDate ? new Date(q.weddingDate).toISOString().slice(0, 10) : ''
      )
      const prep = q?.responses?.preparations || {}
      setBrideName(prep.brideName || 'Bride')
      setGroomName(prep.groomName || 'Groom')
      setResponses(q.responses || {})
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white">Loading your wedding dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-gray-400 text-sm">Bride in Kentucky</div>
          <h1 className="text-3xl font-bold text-white">
            {brideName} & {groomName}
          </h1>
          <p className="text-gray-300 mt-1">
            Wedding Date: {weddingDate || 'TBD'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-2">Timeline</h2>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>Preparations: {responses.preparations?.bridePrep || '—'}</li>
              <li>Ceremony: {responses.ceremony?.timeLocation || '—'}</li>
              <li>Reception: {responses.reception?.times || '—'}</li>
            </ul>
          </div>
          <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-2">
              Key Contacts
            </h2>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>Coordinator: {responses.ceremony?.coordinator || '—'}</li>
              <li>Officiant: {responses.ceremony?.officiant || '—'}</li>
              <li>Vendors: {responses.reception?.vendors || '—'}</li>
            </ul>
          </div>
          <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-2">
              Highlights
            </h2>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>
                Special Moments: {responses.preparations?.specialMoments || '—'}
              </li>
              <li>Traditions: {responses.ceremony?.traditions || '—'}</li>
              <li>Shot List: {responses.reception?.photoVideo || '—'}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => router.push('/dashboard/bride')}
            className="px-4 py-2 bg-accent text-primary rounded hover:bg-accent/90"
          >
            Edit Questionnaire
          </button>
          <button
            onClick={() => router.push('/my-quotes')}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            View Quotes
          </button>
        </div>
      </main>
    </div>
  )
}
