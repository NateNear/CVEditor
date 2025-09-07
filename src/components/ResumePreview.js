'use client'

export default function ResumePreview({ data }) {
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
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto print:shadow-none print:p-0">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}
        </div>
        {personalInfo.summary && (
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            {personalInfo.summary}
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.items.length === 0 ? (
                <p className="text-gray-500 italic">No {section.type} added yet</p>
              ) : (
                section.items.map((item) => renderItem(item, section.type))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
