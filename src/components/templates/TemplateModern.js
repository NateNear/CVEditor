'use client'

export default function TemplateModern({ personalInfo, sections, design, editable, onEditPersonal, renderItem }) {
  const color = design?.primaryColor || '#10b981'
  const fontFamily = design?.fontFamily
  const fontSize = design?.fontSize || 14
  return (
    <div className="bg-white shadow-lg rounded-lg p-0 max-w-4xl mx-auto print:shadow-none print:p-0" style={{ fontFamily, fontSize }}>
      <div className="px-8 py-6" style={{ backgroundColor: color + '22' }}>
        <h1 className="text-3xl font-bold text-gray-900">
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal && onEditPersonal('name', e.currentTarget.textContent || '')}>
            {personalInfo.name || 'Your Name'}
          </span>
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-2">
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
      </div>
      <div className="px-8 py-6">
        <p className="text-gray-700" contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('summary', e.currentTarget.textContent || '')}>
          {personalInfo.summary || (editable ? 'Write a brief summary here...' : '')}
        </p>
        <div className="mt-6 space-y-6">
          {sections.map((section) => (
            <div key={section.id}>
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
      </div>
    </div>
  )
}


