'use client'

import TemplateRenderer from '@/components/templates/TemplateRenderer'

export default function ResumePreview({ data, design, editable = false, onEditPersonal }) {
  const { personalInfo, sections } = data

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const renderItem = (item, type) => {
    if (type === 'skills') {
      return (
        <div key={item.id} className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded mr-2 mb-1">
            {item.title}
          </span>
        </div>
      )
    }

    return (
      <div key={item.id} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900">{item.title}</h4>
            {item.subtitle && (
              <p className="text-sm text-gray-600">{item.subtitle}</p>
            )}
          </div>
          {(item.startDate || item.endDate) && (
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate) || 'Present'}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-700 mt-1">{item.description}</p>
        )}
      </div>
    )
  }

  return (
    <TemplateRenderer
      personalInfo={personalInfo}
      sections={sections}
      design={design}
      editable={editable}
      onEditPersonal={onEditPersonal}
      renderItem={renderItem}
    />
  )
}
