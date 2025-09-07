'use client'

export const ResumeActionTypes = {
  INIT_FROM_DB: 'resume/INIT_FROM_DB',
  SET_PERSONAL_INFO: 'resume/SET_PERSONAL_INFO',
  SET_SECTIONS: 'resume/SET_SECTIONS',
  UPDATE_SECTION: 'resume/UPDATE_SECTION',
  DELETE_SECTION: 'resume/DELETE_SECTION',
  ADD_SECTION: 'resume/ADD_SECTION',
  REORDER_SECTIONS: 'resume/REORDER_SECTIONS',
}

const initialState = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  sections: [],
}

export function resumeReducer(state = initialState, action) {
  switch (action.type) {
    case ResumeActionTypes.INIT_FROM_DB:
      return { ...state, ...action.payload }
    case ResumeActionTypes.SET_PERSONAL_INFO:
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } }
    case ResumeActionTypes.SET_SECTIONS:
      return { ...state, sections: action.payload }
    case ResumeActionTypes.UPDATE_SECTION:
      return {
        ...state,
        sections: state.sections.map(s => s.id === action.payload.id ? action.payload : s),
      }
    case ResumeActionTypes.DELETE_SECTION:
      return { ...state, sections: state.sections.filter(s => s.id !== action.payload) }
    case ResumeActionTypes.ADD_SECTION:
      return { ...state, sections: [...state.sections, action.payload] }
    case ResumeActionTypes.REORDER_SECTIONS: {
      return { ...state, sections: action.payload }
    }
    default:
      return state
  }
}

export const resumeActions = {
  initFromDb: (data) => ({ type: ResumeActionTypes.INIT_FROM_DB, payload: data }),
  setPersonalInfo: (partial) => ({ type: ResumeActionTypes.SET_PERSONAL_INFO, payload: partial }),
  setSections: (sections) => ({ type: ResumeActionTypes.SET_SECTIONS, payload: sections }),
  updateSection: (section) => ({ type: ResumeActionTypes.UPDATE_SECTION, payload: section }),
  deleteSection: (id) => ({ type: ResumeActionTypes.DELETE_SECTION, payload: id }),
  addSection: (section) => ({ type: ResumeActionTypes.ADD_SECTION, payload: section }),
  reorderSections: (sections) => ({ type: ResumeActionTypes.REORDER_SECTIONS, payload: sections }),
}


