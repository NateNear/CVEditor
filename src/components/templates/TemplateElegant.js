'use client'

export default function TemplateElegant({ personalInfo, sections, design, editable, onEditPersonal, renderItem }) {
  const color = design?.primaryColor || '#d97706'
  const fontFamily = design?.fontFamily || 'Helvetica, sans-serif'
  const fontSize = design?.fontSize || 14

  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto p-10 print:shadow-none" style={{ fontFamily, fontSize }}>
      {/* Header */}
      <div className="text-center border-b pb-4 mb-6" style={{ borderColor: color }}>
        <h1 className="text-3xl font-extrabold text-gray-900">
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('name', e.currentTarget.textContent || '')}>
            {personalInfo.name || 'Your Name'}
          </span>
        </h1>
        <div className="flex justify-center gap-6 text-sm text-gray-600 mt-2">
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
        <p className="mt-4 text-gray-700 text-sm" contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('summary', e.currentTarget.textContent || '')}>
          {personalInfo.summary || (editable ? 'Short professional summary here...' : '')}
        </p>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide mb-2" style={{ color }}>
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
  )
}
