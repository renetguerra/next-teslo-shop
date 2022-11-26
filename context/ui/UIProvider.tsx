import React, { FC, useReducer } from 'react'
import { UIContext, uiReducer } from './';

export interface UIState {
    isMenuOpen: boolean;
    // query: string;
    children?: any;
 }

const UI_INITIAL_STATE: UIState = {
    isMenuOpen: false    
 }



export const UIProvider:FC<UIState> = ({ children }) => {

  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: 'UI - ToggleMenu'})
  }

  // const setQueryFilter = (querySring: string) => {
  //   dispatch({ type: 'UI - SetQueryFilter'})
  // }

  return (
    <UIContext.Provider value={{ 
      ...state,

      // Methods
      toggleSideMenu,
      // setQueryFilter(querySring)
    
    }}>
      { children }
    </UIContext.Provider>
  )
};