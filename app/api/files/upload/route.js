import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const projectId = formData.get('projectId')

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // For now, return a mock response since we don't have file storage implemented
    // In production, you would upload to a service like AWS S3, Backblaze, etc.
    const mockFile = {
      id: `file_${Date.now()}`,
      name: file.name,
      type: file.type || 'unknown',
      size: file.size || 0,
      projectId: projectId || null,
      uploadedAt: new Date().toISOString(),
      url: `/api/files/${Date.now()}/view` // Mock URL
    }

    return NextResponse.json({
      success: true,
      file: mockFile,
      message: 'File uploaded successfully (mock response)'
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
