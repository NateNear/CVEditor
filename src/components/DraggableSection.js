'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Plus } from 'lucide-react'

export default function DraggableSection({ 
  section, 
  onUpdate, 
  onDelete, 
  onAddItem,
  children 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border-2 border-gray-200 p-4 ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'
      } transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddItem(section.id)}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
            title="Add item"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {children}
    </div>
  )
}
