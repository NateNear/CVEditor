'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import DraggableSection from '@/components/DraggableSection'
import SectionForm from '@/components/SectionForm'
import ResumePreview from '@/components/ResumePreview'
import { ArrowLeft, Save, Download, Eye, EyeOff, RotateCcw, RotateCw } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { resumeActions } from '@/store/slices/resumeSlice'
import { designActions } from '@/store/slices/designSlice'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import TemplateGallery from '@/components/templates/TemplateGallery'

export default function EditorPage({ params }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [resolvedParams, setResolvedParams] = useState(null)
  const [dbResume, setDbResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const resumeState = useSelector((state) => state.resume.present)
  const design = useSelector((state) => state.design)
  const personalInfo = resumeState.personalInfo
  const sections = resumeState.sections

  const canUndo = useSelector((state) => state.resume.past.length > 0)
  const canRedo = useSelector((state) => state.resume.future.length > 0)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  // Fetch resume when params are resolved
  useEffect(() => {
    if (resolvedParams?.id) {
      fetchResume()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams?.id])

  useEffect(() => {
    if (dbResume?.data) {
      dispatch(resumeActions.initFromDb(dbResume.data))
    }
  }, [dbResume, dispatch])

  // Autosave functionality
  useEffect(() => {
    if (!dbResume || !resolvedParams?.id) return
    const timeoutId = setTimeout(() => {
      saveResume()
    }, 1200)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalInfo, sections, resolvedParams?.id])

  const fetchResume = async () => {
    if (!resolvedParams?.id) return
    
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      setDbResume(data)
    } catch (error) {
      console.error('Error fetching resume:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const saveResume = async () => {
    if (!dbResume || !resolvedParams?.id) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ data: { personalInfo, sections } })
        .eq('id', resolvedParams.id)

      if (error) throw error
    } catch (error) {
      console.error('Error saving resume:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePersonalInfoChange = (field, value) => {
    dispatch(resumeActions.setPersonalInfo({ [field]: value }))
  }

  const handleSectionUpdate = (sectionId, updatedSection) => {
    // Ensure the section ID is preserved
    const sectionWithId = { ...updatedSection, id: sectionId }
    dispatch(resumeActions.updateSection(sectionWithId))
  }

  const handleSectionDelete = (sectionId) => {
    dispatch(resumeActions.deleteSection(sectionId))
  }

  const handleAddItem = (sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return
    const newItem = {
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false
    }
    handleSectionUpdate(sectionId, { ...section, items: [...section.items, newItem] })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const items = sections
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const reordered = arrayMove(items, oldIndex, newIndex)
      dispatch(resumeActions.reorderSections(reordered))
    }
  }

  const handleAddSection = () => {
    const newSection = { id: Date.now().toString(), title: 'New Section', type: 'custom', items: [] }
    dispatch(resumeActions.addSection(newSection))
  }

  const handleExportPDF = () => {
    window.print()
  }

  // Show loading while resolving params
  if (!resolvedParams || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (!dbResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Resume not found</h1>
          <p className="mt-2 text-gray-600">The resume you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {dbResume.title}
              </h1>
              {saving && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <div className="flex items-center">
                <button
                  onClick={() => dispatch(UndoActionCreators.undo())}
                  disabled={!canUndo}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 mr-2"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />Undo
                </button>
                <button
                  onClick={() => dispatch(UndoActionCreators.redo())}
                  disabled={!canRedo}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  <RotateCw className="w-4 h-4 mr-2" />Redo
                </button>
              </div>
              <button
                onClick={saveResume}
                disabled={saving}
                className="flex items-center px-3 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Design Panel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Design</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <input type="color" value={design.primaryColor} onChange={(e)=>dispatch(designActions.setPrimaryColor(e.target.value))} className="w-16 h-10 p-0 border-0 bg-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                  <select value={design.fontFamily} onChange={(e)=>dispatch(designActions.setFontFamily(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value={design.fontFamily}>System Sans</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, Times, serif">Times New Roman</option>
                    <option value="Arial, Helvetica, sans-serif">Arial</option>
                    <option value="Inter, ui-sans-serif, system-ui">Inter/System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Font Size</label>
                  <input type="number" min="12" max="20" value={design.fontSize} onChange={(e)=>dispatch(designActions.setFontSize(Number(e.target.value)))} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <select value={design.template} onChange={(e)=>dispatch(designActions.setTemplate(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                  </select>
                </div>
              </div>
              <TemplateGallery
                personalInfo={personalInfo}
                sections={sections}
                design={design}
                onSelect={(tpl)=>dispatch(designActions.setTemplate(tpl))}
              />
            </div>
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Summary
                  </label>
                  <textarea
                    value={personalInfo.summary}
                    onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Brief summary of your professional background and goals"
                  />
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Add Section
                </button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={sections.map(section => section.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section) => (
                    <DraggableSection
                      key={section.id}
                      section={section}
                      onUpdate={handleSectionUpdate}
                      onDelete={handleSectionDelete}
                      onAddItem={handleAddItem}
                    >
                      <SectionForm
                        section={section}
                        onUpdate={handleSectionUpdate}
                        onClose={() => {}}
                      />
                    </DraggableSection>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:sticky lg:top-6 lg:h-fit">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="max-h-screen overflow-y-auto">
                  <ResumePreview data={{ personalInfo, sections }} design={design} editable={true} onEditPersonal={(field, value)=>handlePersonalInfoChange(field, value)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}