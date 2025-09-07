'use client'

import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { thunk } from 'redux-thunk'
import undoable, { includeAction } from 'redux-undo'
import { resumeReducer, ResumeActionTypes } from './slices/resumeSlice'
import { designReducer } from './slices/designSlice'

const rootReducer = combineReducers({
  resume: undoable(resumeReducer, {
    limit: 50,
    filter: includeAction([
      ResumeActionTypes.SET_PERSONAL_INFO,
      ResumeActionTypes.SET_SECTIONS,
      ResumeActionTypes.UPDATE_SECTION,
      ResumeActionTypes.DELETE_SECTION,
      ResumeActionTypes.ADD_SECTION,
      ResumeActionTypes.REORDER_SECTIONS,
    ]),
  }),
  design: designReducer,
})

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))


