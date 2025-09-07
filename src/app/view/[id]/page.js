'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ResumePreview from '@/components/ResumePreview'
import { Download, ArrowLeft } from 'lucide-react'

export default function PublicViewPage({ params }) {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchResume()
  }, [params.id])

  const fetchResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', params.id)
        .eq('is_public', true)
        .single()

      if (error) throw error
      setResume(data)
    } catch (error) {
      console.error('Error fetching resume:', error)
      setError('Resume not found or not public')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Resume Not Found</h1>
          <p className="mt-2 text-gray-600">
            This resume is either private or doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 flex items-center mx-auto px-4 py-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {resume.title}
              </h1>
            </div>
            
            <button
              onClick={handleExportPDF}
              className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Resume Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ResumePreview data={resume.data} design={undefined} editable={false} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 no-print">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>Created with Resume Editor</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
