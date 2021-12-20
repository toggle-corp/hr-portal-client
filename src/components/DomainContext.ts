import { createContext } from 'react';
import { User } from '#types';

interface DomainContext {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    navbarVisibility: boolean;
    setNavbarVisibility: (visibility: boolean) => void;
    authenticated: boolean,
}

const DomainContext = createContext<DomainContext>({
    user: undefined,
    setUser: (user: unknown) => {
        console.warn('Trying to set to ', user);
    },
    navbarVisibility: false,
    setNavbarVisibility: (visibility: boolean) => {
        console.warn('Trying to set navbar visibility to ', visibility);
    },
    authenticated: false,
});

export default DomainContext;
