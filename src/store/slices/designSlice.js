'use client'

const DesignActionTypes = {
  SET_PRIMARY_COLOR: 'design/SET_PRIMARY_COLOR',
  SET_FONT_FAMILY: 'design/SET_FONT_FAMILY',
  SET_FONT_SIZE: 'design/SET_FONT_SIZE',
  SET_TEMPLATE: 'design/SET_TEMPLATE',
}

const initialState = {
  primaryColor: '#4f46e5',
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  fontSize: 14,
  template: 'classic',
}

export function designReducer(state = initialState, action) {
  switch (action.type) {
    case DesignActionTypes.SET_PRIMARY_COLOR:
      return { ...state, primaryColor: action.payload }
    case DesignActionTypes.SET_FONT_FAMILY:
      return { ...state, fontFamily: action.payload }
    case DesignActionTypes.SET_FONT_SIZE:
      return { ...state, fontSize: action.payload }
    case DesignActionTypes.SET_TEMPLATE:
      return { ...state, template: action.payload }
    default:
      return state
  }
}

export const designActions = {
  setPrimaryColor: (color) => ({ type: DesignActionTypes.SET_PRIMARY_COLOR, payload: color }),
  setFontFamily: (font) => ({ type: DesignActionTypes.SET_FONT_FAMILY, payload: font }),
  setFontSize: (size) => ({ type: DesignActionTypes.SET_FONT_SIZE, payload: size }),
  setTemplate: (tpl) => ({ type: DesignActionTypes.SET_TEMPLATE, payload: tpl }),
}


