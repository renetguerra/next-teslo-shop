import { UIState } from './';

type UIActionType = | { type: 'UI - ToggleMenu' }
                    // | { type: 'UI - SetQueryFilter' }


export const uiReducer = ( state: UIState, action: UIActionType ): UIState => {

    switch (action.type) {
       case 'UI - ToggleMenu':
           return {
               ...state,
               isMenuOpen: !state.isMenuOpen
           }
        
        // case 'UI - SetQueryFilter':
        // return {
        //     ...state,
        //     query: state.query
        // }

       default:
           return state;
   }
}