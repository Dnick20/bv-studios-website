'use client'

import React, { useState } from 'react'
import { PlayIcon } from '@heroicons/react/24/outline'
import { weddingVideos } from '@/lib/weddings/portfolioData'

export default function WeddingPortfolio() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toYouTubeEmbedUrl = (url) => {
    if (!url) return ''
    try {
      // Extract ID from various YouTube URL formats
      // Examples:
      // https://www.youtube.com/watch?v=VIDEOID
      // https://youtu.be/VIDEOID
      // https://www.youtube.com/embed/VIDEOID
      const patterns = [
        /[?&]v=([a-zA-Z0-9_-]{6,})/, // watch?v=
        /youtu\.be\/([a-zA-Z0-9_-]{6,})/, // youtu.be/
        /\/embed\/([a-zA-Z0-9_-]{6,})/, // /embed/
      ]
      let videoId = ''
      for (const p of patterns) {
        const m = url.match(p)
        if (m && m[1]) {
          videoId = m[1]
          break
        }
      }
      // If no match and input looks like an ID already
      if (!videoId && /^[a-zA-Z0-9_-]{6,}$/.test(url)) videoId = url
      if (!videoId) return url
      // Use privacy-enhanced domain and sane params
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
    } catch {
      return url
    }
  }

  const openVideo = (video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeVideo = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  return (
    <div className="space-y-8">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {weddingVideos.map((video) => (
          <div
            key={video.id}
            className="group relative bg-wedding-overlay backdrop-blur-sm rounded-xl overflow-hidden border border-wedding-accent/30 hover:border-wedding-accent/50 transition-colors cursor-pointer shadow-glow"
            onClick={() => openVideo(video)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-wedding-dark/40 group-hover:bg-wedding-dark/20 transition-colors" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-wedding-accent/90 rounded-full flex items-center justify-center group-hover:bg-wedding-accent transition-colors">
                  <PlayIcon className="w-8 h-8 text-wedding-dark" />
                </div>
              </div>

              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-wedding-dark/70 text-wedding-primary text-sm px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-wedding-dark mb-1">{video.title}</h3>
              <p className="text-wedding-muted mb-2">{video.description}</p>
              {(video.venueName || video.venueUrl || video.venueEmail) && (
                <div className="text-sm text-wedding-muted">
                  {video.venueName && (
                    <span className="font-medium text-wedding-dark">{video.venueName}</span>
                  )}
                  {video.venueUrl && (
                    <>
                      {' '}
                      ·{' '}
                      <a
                        href={video.venueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-wedding-accent"
                      >
                        Venue site
                      </a>
                    </>
                  )}
                  {video.venueEmail && (
                    <>
                      {' '}
                      ·{' '}
                      <a
                        href={`mailto:${video.venueEmail}`}
                        className="underline hover:text-wedding-accent"
                      >
                        {video.venueEmail}
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-wedding-dark/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-wedding-primary hover:text-wedding-accent transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="relative aspect-video bg-wedding-dark rounded-lg overflow-hidden">
              <iframe
                src={toYouTubeEmbedUrl(selectedVideo.videoUrl)}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-semibold text-wedding-primary mb-2">{selectedVideo.title}</h3>
              <p className="text-wedding-muted">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 