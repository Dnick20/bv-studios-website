'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { safeFetchJson } from '@/lib/utils/safeJson'

const sectionClasses = 'bg-black/20 rounded-lg p-6 border border-gray-800'

export default function BrideDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [welcome, setWelcome] = useState(
    'Welcome to BV Studios, Kentucky Bride! We’ve guided countless couples through their big day with ease, care, and creativity—let’s make your wedding video unforgettable.'
  )
  const [questionnaire, setQuestionnaire] = useState(null)
  const [weddingDate, setWeddingDate] = useState('')
  const [saving, setSaving] = useState(false)

  // Form state grouped by sections
  const [prep, setPrep] = useState({})
  const [ceremony, setCeremony] = useState({})
  const [reception, setReception] = useState({})

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
      const defaultDate = res?.data?.defaultWeddingDate
      setQuestionnaire(q)
      setWeddingDate(
        q?.weddingDate?.slice?.(0, 10) ||
          (defaultDate ? new Date(defaultDate).toISOString().slice(0, 10) : '')
      )
      const responses = q?.responses || {}
      setPrep(responses.preparations || {})
      setCeremony(responses.ceremony || {})
      setReception(responses.reception || {})
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = {
        weddingDate: weddingDate || null,
        tag: 'Bride in Kentucky',
        region: 'KY',
        responses: {
          preparations: prep,
          ceremony,
          reception,
        },
      }
      const res = await fetch('/api/wedding/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || 'Save failed')
      setQuestionnaire(data.data)
      alert('Saved! Your responses were sent to admin.')
      if (data?.code === 'P2021') {
        alert(
          'Heads up: The questionnaire table is not migrated yet. Please run database migrations in production to persist responses.'
        )
      }
      router.push('/dashboard/bride/overview')
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-gray-400 text-sm">Bride in Kentucky</div>
          <h1 className="text-3xl font-bold text-white">Wedding Dashboard</h1>
          <p className="text-gray-300 mt-2">{welcome}</p>
        </div>

        {/* Wedding date */}
        <div className={`${sectionClasses} mb-8`}>
          <h2 className="text-xl font-semibold text-white mb-4">
            Wedding Date
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
            />
            <span className="text-gray-400 text-sm">
              Pulled from your first quote when available. You can update it
              anytime.
            </span>
          </div>
        </div>

        {/* Questionnaire */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preparations */}
          <section className={sectionClasses}>
            <h3 className="text-lg font-semibold text-white mb-4">
              Preparations
            </h3>
            <div className="space-y-3">
              <input
                placeholder="Bride name"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.brideName || ''}
                onChange={(e) =>
                  setPrep({ ...prep, brideName: e.target.value })
                }
              />
              <input
                placeholder="Groom name"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.groomName || ''}
                onChange={(e) =>
                  setPrep({ ...prep, groomName: e.target.value })
                }
              />
              <input
                placeholder="Names"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.names || ''}
                onChange={(e) => setPrep({ ...prep, names: e.target.value })}
              />
              <input
                placeholder="Emails"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.emails || ''}
                onChange={(e) => setPrep({ ...prep, emails: e.target.value })}
              />
              <input
                placeholder="Bride prep time & location"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.bridePrep || ''}
                onChange={(e) =>
                  setPrep({ ...prep, bridePrep: e.target.value })
                }
              />
              <input
                placeholder="Groom prep time & location"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.groomPrep || ''}
                onChange={(e) =>
                  setPrep({ ...prep, groomPrep: e.target.value })
                }
              />
              <input
                placeholder="Transport details"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.transport || ''}
                onChange={(e) =>
                  setPrep({ ...prep, transport: e.target.value })
                }
              />
              <input
                placeholder="Best man"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.bestMan || ''}
                onChange={(e) => setPrep({ ...prep, bestMan: e.target.value })}
              />
              <input
                placeholder="Maid of honor"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.maidOfHonor || ''}
                onChange={(e) =>
                  setPrep({ ...prep, maidOfHonor: e.target.value })
                }
              />
              <input
                placeholder="Special moments (gift/note exchange)"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.specialMoments || ''}
                onChange={(e) =>
                  setPrep({ ...prep, specialMoments: e.target.value })
                }
              />
              <input
                placeholder="Outfit details"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={prep.outfits || ''}
                onChange={(e) => setPrep({ ...prep, outfits: e.target.value })}
              />
            </div>
          </section>

          {/* Ceremony */}
          <section className={sectionClasses}>
            <h3 className="text-lg font-semibold text-white mb-4">Ceremony</h3>
            <div className="space-y-3">
              <input
                placeholder="Indoor/Outdoor"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={ceremony.environment || ''}
                onChange={(e) =>
                  setCeremony({ ...ceremony, environment: e.target.value })
                }
              />
              <input
                placeholder="Time & Location"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={ceremony.timeLocation || ''}
                onChange={(e) =>
                  setCeremony({ ...ceremony, timeLocation: e.target.value })
                }
              />
              <input
                placeholder="Coordinator info"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={ceremony.coordinator || ''}
                onChange={(e) =>
                  setCeremony({ ...ceremony, coordinator: e.target.value })
                }
              />
              <input
                placeholder="Type of ceremony"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={ceremony.type || ''}
                onChange={(e) =>
                  setCeremony({ ...ceremony, type: e.target.value })
                }
              />
              <input
                placeholder="Processional details"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={ceremony.processional || ''}
                onChange={(e) =>
                  setCeremony({ ...ceremony, processional: e.target.value })
                }
              />
              <input
                placeholder="Officiant"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={ceremony.officiant || ''}
                onChange={(e) =>
                  setCeremony({ ...ceremony, officiant: e.target.value })
                }
              />
              <input
                placeholder="Kiss & Exit details"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={ceremony.kissExit || ''}
                onChange={(e) =>
                  setCeremony({ ...ceremony, kissExit: e.target.value })
                }
              />
              <input
                placeholder="Unique traditions"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={ceremony.traditions || ''}
                onChange={(e) =>
                  setCeremony({ ...ceremony, traditions: e.target.value })
                }
              />
            </div>
          </section>

          {/* Cocktail & Reception */}
          <section className={sectionClasses}>
            <h3 className="text-lg font-semibold text-white mb-4">
              Cocktail & Reception
            </h3>
            <div className="space-y-3">
              <input
                placeholder="Start & End times"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.times || ''}
                onChange={(e) =>
                  setReception({ ...reception, times: e.target.value })
                }
              />
              <input
                placeholder="Location"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.location || ''}
                onChange={(e) =>
                  setReception({ ...reception, location: e.target.value })
                }
              />
              <input
                placeholder="Guest count"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.guestCount || ''}
                onChange={(e) =>
                  setReception({ ...reception, guestCount: e.target.value })
                }
              />
              <input
                placeholder="Photo/Video time & locations"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.photoVideo || ''}
                onChange={(e) =>
                  setReception({ ...reception, photoVideo: e.target.value })
                }
              />
              <input
                placeholder="Vendor contacts"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.vendors || ''}
                onChange={(e) =>
                  setReception({ ...reception, vendors: e.target.value })
                }
              />
              <input
                placeholder="Speeches, dances, cake cutting, bouquet toss"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.events || ''}
                onChange={(e) =>
                  setReception({ ...reception, events: e.target.value })
                }
              />
              <input
                placeholder="Comfort in front of camera (1-10)"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.comfort || ''}
                onChange={(e) =>
                  setReception({ ...reception, comfort: e.target.value })
                }
              />
              <input
                placeholder="Sensitive family notes"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.familyNotes || ''}
                onChange={(e) =>
                  setReception({ ...reception, familyNotes: e.target.value })
                }
              />
              <input
                placeholder="Preferred video references (links)"
                className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white"
                value={reception.references || ''}
                onChange={(e) =>
                  setReception({ ...reception, references: e.target.value })
                }
              />
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-accent text-primary rounded hover:bg-accent/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Send to Admin'}
          </button>
          <button
            onClick={load}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </main>
    </div>
  )
}
