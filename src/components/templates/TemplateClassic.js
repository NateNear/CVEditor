'use client'

export default function TemplateClassic({ personalInfo, sections, design, editable, onEditPersonal, renderItem }) {
  const color = design?.primaryColor || '#4f46e5'
  const fontFamily = design?.fontFamily
  const fontSize = design?.fontSize || 14
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto print:shadow-none print:p-0" style={{ fontFamily, fontSize }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <span
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e)=> editable && onEditPersonal && onEditPersonal('name', e.currentTarget.textContent || '')}
          >
            {personalInfo.name || 'Your Name'}
          </span>
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('email', e.currentTarget.textContent || '')}>
            {personalInfo.email || (editable ? 'email@example.com' : '')}
          </span>
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('phone', e.currentTarget.textContent || '')}>
            {personalInfo.phone || (editable ? '(555) 123-4567' : '')}
          </span>
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('location', e.currentTarget.textContent || '')}>
            {personalInfo.location || (editable ? 'City, Country' : '')}
          </span>
        </div>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto" contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('summary', e.currentTarget.textContent || '')}>
          {personalInfo.summary || (editable ? 'Write a brief summary here...' : '')}
        </p>
      </div>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: color }}>
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


