'use client'

export default function TemplateTwoColumn({ personalInfo, sections, design, editable, onEditPersonal, renderItem }) {
  const color = design?.primaryColor || '#1f2937'
  const fontFamily = design?.fontFamily || 'Arial, sans-serif'
  const fontSize = design?.fontSize || 14

  return (
    <div className="bg-white max-w-5xl mx-auto shadow-lg grid grid-cols-3 print:shadow-none" style={{ fontFamily, fontSize }}>
      {/* LEFT SIDEBAR */}
      <div className="col-span-1 bg-gray-800 text-white p-6 flex flex-col items-center">
        {/* Avatar */}
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-28 h-28 rounded-full mb-4 object-cover" />
        )}
        {/* Name + Title */}
        <h1 className="text-xl font-bold text-center">
          <span contentEditable={editable} suppressContentEditableWarning
            onBlur={(e)=> editable && onEditPersonal('name', e.currentTarget.textContent || '')}>
            {personalInfo.name || 'Your Name'}
          </span>
        </h1>
        <p className="text-sm text-gray-300 text-center mb-6" contentEditable={editable} suppressContentEditableWarning
          onBlur={(e)=> editable && onEditPersonal('title', e.currentTarget.textContent || '')}>
          {personalInfo.title || (editable ? 'Your Title' : '')}
        </p>

        {/* Contact Info */}
        <div className="w-full text-sm space-y-2 mb-6">
          <p><span contentEditable={editable} suppressContentEditableWarning
            onBlur={(e)=> editable && onEditPersonal('email', e.currentTarget.textContent || '')}>
            {personalInfo.email || (editable ? 'email@example.com' : '')}
          </span></p>
          <p><span contentEditable={editable} suppressContentEditableWarning
            onBlur={(e)=> editable && onEditPersonal('phone', e.currentTarget.textContent || '')}>
            {personalInfo.phone || (editable ? '(555) 123-4567' : '')}
          </span></p>
          <p><span contentEditable={editable} suppressContentEditableWarning
            onBlur={(e)=> editable && onEditPersonal('location', e.currentTarget.textContent || '')}>
            {personalInfo.location || (editable ? 'City, Country' : '')}
          </span></p>
          <p><span contentEditable={editable} suppressContentEditableWarning
            onBlur={(e)=> editable && onEditPersonal('website', e.currentTarget.textContent || '')}>
            {personalInfo.website || (editable ? 'yourwebsite.com' : '')}
          </span></p>
        </div>

        {/* Profile / Summary */}
        <div className="mb-6 w-full">
          <h2 className="font-semibold text-sm uppercase border-b border-gray-500 mb-2">Profile</h2>
          <p className="text-gray-300 text-xs" contentEditable={editable} suppressContentEditableWarning
            onBlur={(e)=> editable && onEditPersonal('summary', e.currentTarget.textContent || '')}>
            {personalInfo.summary || (editable ? 'Write a short professional bio here...' : '')}
          </p>
        </div>

        {/* Extra Sidebar Sections (Languages, Awards, etc.) */}
        {sections.filter(s => ['languages', 'awards'].includes(s.type)).map((section) => (
          <div key={section.id} className="mb-6 w-full">
            <h2 className="font-semibold text-sm uppercase border-b border-gray-500 mb-2">{section.title}</h2>
            <div className="text-xs space-y-1">
              {section.items.length === 0 ? (
                <p className="italic text-gray-400">No {section.type} added yet</p>
              ) : (
                section.items.map((item) => renderItem(item, section.type))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="col-span-2 p-8">
        {sections.filter(s => !['languages', 'awards'].includes(s.type)).map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wide mb-4 flex items-center" style={{ color }}>
              {section.title}
            </h2>
            <div className="space-y-3">
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
