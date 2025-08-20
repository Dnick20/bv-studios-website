'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminWeddingQuestionnairesPage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/wedding-questionnaires')
      const data = await res.json().catch(() => ({ data: [] }))
      setItems(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Wedding Questionnaires</h1>
          <Link
            href="/admin/dashboard"
            className="px-3 py-2 bg-gray-700 rounded"
          >
            Back
          </Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-400">No questionnaires yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((q) => (
              <div
                key={q.id}
                className="p-4 bg-black/20 border border-gray-800 rounded"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="text-white font-medium">
                      {q.user?.name || q.user?.email || 'User'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Wedding Date:{' '}
                      {q.weddingDate
                        ? new Date(q.weddingDate).toLocaleDateString()
                        : '—'}{' '}
                      | Tag: {q.tag || '—'}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Updated {new Date(q.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
