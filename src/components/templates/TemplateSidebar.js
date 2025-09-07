'use client'

export default function TemplateSidebar({ personalInfo, sections, design, editable, onEditPersonal, renderItem }) {
  const color = design?.primaryColor || '#2563eb'
  const fontFamily = design?.fontFamily || 'Arial, sans-serif'
  const fontSize = design?.fontSize || 14

  return (
    <div className="bg-white max-w-5xl mx-auto grid grid-cols-3 shadow-lg print:shadow-none" style={{ fontFamily, fontSize }}>
      {/* Sidebar */}
      <div className="col-span-1 bg-gray-100 p-6" style={{ backgroundColor: color + '11' }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('name', e.currentTarget.textContent || '')}>
            {personalInfo.name || 'Your Name'}
          </span>
        </h1>
        <p className="text-sm text-gray-700 space-y-1">
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('email', e.currentTarget.textContent || '')}>
            {personalInfo.email || (editable ? 'email@example.com' : '')}
          </span><br />
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('phone', e.currentTarget.textContent || '')}>
            {personalInfo.phone || (editable ? '(555) 123-4567' : '')}
          </span><br />
          <span contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('location', e.currentTarget.textContent || '')}>
            {personalInfo.location || (editable ? 'City, Country' : '')}
          </span>
        </p>

        <p className="mt-4 text-gray-700 text-sm" contentEditable={editable} suppressContentEditableWarning onBlur={(e)=> editable && onEditPersonal('summary', e.currentTarget.textContent || '')}>
          {personalInfo.summary || (editable ? 'Brief summary here...' : '')}
        </p>
      </div>

      {/* Main content */}
      <div className="col-span-2 p-6">
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide mb-2 border-b pb-1" style={{ borderColor: color, color }}>
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
