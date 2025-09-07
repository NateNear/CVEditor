'use client'

import TemplateClassic from './TemplateClassic'
import TemplateModern from './TemplateModern'

export default function TemplateRenderer({ personalInfo, sections, design, editable, onEditPersonal, renderItem }) {
  const template = design?.template || 'classic'
  const commonProps = { personalInfo, sections, design, editable, onEditPersonal, renderItem }
  if (template === 'modern') return <TemplateModern {...commonProps} />
  return <TemplateClassic {...commonProps} />
}


