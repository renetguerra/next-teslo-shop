import { createContext } from 'react';

interface ContextProps {
    isMenuOpen: boolean;
    // query: string;

    // Methods
    toggleSideMenu: () => void;
    // setQueryFilter: (querySring: string) => string;
}


export const UIContext = createContext({} as ContextProps);