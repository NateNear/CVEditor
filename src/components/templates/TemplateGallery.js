'use client'

import { useMemo } from 'react'
import TemplateRenderer from './TemplateRenderer'

export default function TemplateGallery({ personalInfo, sections, design, onSelect }) {
  const templates = useMemo(() => ([
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
  ]), [])

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.id)}
            className={`text-left rounded-lg border ${design?.template === tpl.id ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'} bg-white hover:shadow`}
          >
            <div className="w-full overflow-hidden bg-gray-50 rounded-t-lg">
              <div className="origin-top-left scale-[0.5] md:scale-[0.6] lg:scale-[0.7] -m-12 pointer-events-none select-none">
                <TemplateRenderer
                  personalInfo={personalInfo}
                  sections={sections}
                  design={{ ...design, template: tpl.id }}
                  editable={false}
                  renderItem={(item, type) => {
                    return (
                      <div key={item.id} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                            {item.subtitle && <p className="text-xs text-gray-600">{item.subtitle}</p>}
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
              </div>
            </div>
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900">{tpl.name}</p>
              <p className="text-xs text-gray-500">Click to use this template</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}


