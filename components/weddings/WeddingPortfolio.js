'use client'

import React, { useState } from 'react'
import { PlayIcon } from '@heroicons/react/24/outline'

const weddingVideos = [
  {
    id: 1,
    title: 'Sarah & David',
    description: 'A beautiful spring wedding at the Kentucky Horse Park',
    thumbnail: '/images/optimized/weddings/sarah-david.webp',
    videoUrl: 'https://www.youtube.com/embed/SRBc8SJ3jLk',
    duration: '5:32'
  },
  {
    id: 2,
    title: 'Christian & Hailee',
    description: 'Intimate ceremony at Keeneland with stunning sunset',
    thumbnail: '/images/optimized/weddings/christian-hailee.webp',
    videoUrl: 'https://www.youtube.com/embed/SRBc8SJ3jLk',
    duration: '6:15'
  },
  {
    id: 3,
    title: 'Kaitlin & Andy',
    description: 'Elegant reception at the Lexington Opera House',
    thumbnail: '/images/optimized/weddings/kaitlin-andy.webp',
    videoUrl: 'https://www.youtube.com/embed/SRBc8SJ3jLk',
    duration: '4:48'
  },
  {
    id: 4,
    title: 'Niki & Matt',
    description: 'Rustic barn wedding with country charm',
    thumbnail: '/images/optimized/weddings/niki-matt.webp',
    videoUrl: 'https://www.youtube.com/embed/SRBc8SJ3jLk',
    duration: '7:22'
  }
]

export default function WeddingPortfolio() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weddingVideos.map((video) => (
          <div
            key={video.id}
            className="group relative bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-accent/50 transition-colors cursor-pointer"
            onClick={() => openVideo(video)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-accent/90 rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                  <PlayIcon className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
              <p className="text-gray-300 text-sm">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white hover:text-accent transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">{selectedVideo.title}</h3>
              <p className="text-gray-300">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 