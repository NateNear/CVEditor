'use client'

import TemplateClassic from './TemplateClassic'
import TemplateModern from './TemplateModern'
import TemplateClassic2 from './TemplateClassic2'
import TemplateSidebar from './TemplateSidebar'
import TemplateElegant from './TemplateElegant'

export default function TemplateRenderer({ personalInfo, sections, design, editable, onEditPersonal, renderItem }) {
  const template = design?.template || 'classic'
  const commonProps = { personalInfo, sections, design, editable, onEditPersonal, renderItem }
  if (template === 'modern') return <TemplateModern {...commonProps} />
  if (template === 'classic2') return <TemplateClassic2 {...commonProps} />
  if (template === 'sidebar') return <TemplateSidebar {...commonProps} />
  if (template === 'elegant') return <TemplateElegant {...commonProps} />
  return <TemplateClassic {...commonProps} />
}


