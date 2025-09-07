'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Trash2, Edit, Eye, Share, Copy } from 'lucide-react'

export default function ResumeCard({ resume, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id)
      
      if (error) throw error
      onDelete(resume.id)
    } catch (error) {
      console.error('Error deleting resume:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTogglePublic = async () => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ is_public: !resume.is_public })
        .eq('id', resume.id)
      
      if (error) throw error
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error('Error updating resume:', error)
    }
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/view/${resume.id}`
    navigator.clipboard.writeText(shareUrl)
    setShowShareModal(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{resume.title}</h3>
          <div className="flex items-center space-x-2">
            {resume.is_public && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Public
              </span>
            )}
            <span className="text-sm text-gray-500">
              {new Date(resume.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/editor/${resume.id}`)}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          
          <button
            onClick={() => router.push(`/view/${resume.id}`)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
          
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <Share className="w-4 h-4 mr-1" />
            Share
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={resume.is_public}
              onChange={handleTogglePublic}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Make this resume public</span>
          </label>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Share Resume</h3>
              <p className="text-sm text-gray-500 mb-4">
                {resume.is_public 
                  ? 'Your resume is public and can be viewed by anyone with the link.'
                  : 'Make your resume public to share it with others.'
                }
              </p>
              
              {resume.is_public ? (
                <div className="space-y-3">
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/view/${resume.id}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={copyShareLink}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleTogglePublic}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Make Public & Get Link
                </button>
              )}
              
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
