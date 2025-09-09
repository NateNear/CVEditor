'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Save } from 'lucide-react'

const sectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
})

const itemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
})

export default function SectionForm({ section, onUpdate, onClose }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  
  const {
    register: registerSection,
    handleSubmit: handleSectionSubmit,
    formState: { errors: sectionErrors },
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: { title: section.title }
  })

  const {
    register: registerItem,
    handleSubmit: handleItemSubmit,
    reset: resetItem,
    formState: { errors: itemErrors },
  } = useForm({
    resolver: zodResolver(itemSchema),
  })

  const onSectionSubmit = (data, e) => {
    e?.preventDefault()
    console.log('Section update:', { ...section, title: data.title })
    onUpdate(section.id, { ...section, title: data.title })
    setIsEditing(false)
  }

  const onItemSubmit = (data, e) => {
    e?.preventDefault()
    console.log('Item update:', data)
    console.log('Current editingItem:', editingItem)
    console.log('Current section.items:', section.items)
    
    const newItem = {
      id: editingItem?.id || Date.now().toString(),
      ...data
    }
    
    const updatedItems = editingItem?.id 
      ? section.items.map(item => item.id === editingItem.id ? newItem : item)
      : [...section.items, newItem]
    
    console.log('New item:', newItem)
    console.log('Updated items:', updatedItems)
    console.log('Updated section:', { ...section, items: updatedItems })
    
    onUpdate(section.id, { ...section, items: updatedItems })
    setEditingItem(null)
    resetItem()
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    resetItem(item)
  }

  const handleDeleteItem = (itemId) => {
    const updatedItems = section.items.filter(item => item.id !== itemId)
    onUpdate(section.id, { ...section, items: updatedItems })
  }

  const renderItemForm = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        {editingItem ? 'Edit Item' : 'Add New Item'}
      </h4>
      <form onSubmit={handleItemSubmit(onItemSubmit)} className="space-y-3">
        <div>
          <input
            {...registerItem('title')}
            placeholder="Title (e.g., Job Title, Degree, Skill)"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {itemErrors.title && (
            <p className="mt-1 text-sm text-red-600">{itemErrors.title.message}</p>
          )}
        </div>
        
        <div>
          <input
            {...registerItem('subtitle')}
            placeholder="Subtitle (e.g., Company, School, Category)"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <textarea
            {...registerItem('description')}
            placeholder="Description"
            rows={3}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        {(section.type === 'experience' || section.type === 'education') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                {...registerItem('startDate')}
                type="month"
                placeholder="Start Date"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                {...registerItem('endDate')}
                type="month"
                placeholder="End Date"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
        
        {(section.type === 'experience' || section.type === 'education') && (
          <div className="flex items-center">
            <input
              {...registerItem('current')}
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label className="ml-2 text-sm text-gray-700">Currently active</label>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null)
              resetItem()
            }}
            className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-1 inline" />
            {editingItem ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  )

  const renderItem = (item) => (
    <div key={item.id} className="bg-white p-3 rounded border mb-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h5 className="font-medium text-gray-900">{item.title}</h5>
          {item.subtitle && (
            <p className="text-sm text-gray-600">{item.subtitle}</p>
          )}
          {item.description && (
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          )}
          {(item.startDate || item.endDate) && (
            <p className="text-xs text-gray-400 mt-1">
              {item.startDate} - {item.current ? 'Present' : item.endDate || 'Present'}
            </p>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => handleEditItem(item)}
            className="p-1 text-gray-400 hover:text-indigo-600"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDeleteItem(item.id)}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <form onSubmit={handleSectionSubmit(onSectionSubmit)} className="flex-1 flex items-center space-x-2">
            <input
              {...registerSection('title')}
              className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Edit Title
            </button>
          </>
        )}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {section.items.map(renderItem)}
      </div>

      {editingItem !== null ? renderItemForm() : (
        <button
          type="button"
          onClick={() => setEditingItem({})}
          className="w-full mt-2 p-2 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded hover:border-indigo-400 hover:text-indigo-600"
        >
          + Add {section.type === 'skills' ? 'skill' : 'item'}
        </button>
      )}
    </div>
  )
}