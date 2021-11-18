import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import DomainContext from '#components/DomainContext';

import styles from './styles.css';

export interface DocumentTitleProps {
    value: string;
}

function DocumentTitle({ value }: DocumentTitleProps) {
    React.useEffect(
        () => {
            document.title = value;
        },
        [value],
    );
    return null;
}

type Visibility = 'is-authenticated' | 'is-not-authenticated' | 'is-anything';

export interface ViewProps<T extends { className?: string }> {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.LazyExoticComponent<(props: T) => React.ReactElement<any, any> | null>;
    componentProps: React.PropsWithRef<T>;
    visibility: Visibility,
    navbarVisibility: boolean,
}

function View<T extends { className?: string }>(props: ViewProps<T>) {
    const {
        component: Comp,
        componentProps,
        title,
        visibility,
        navbarVisibility,
        // onlyAdminAccess,
    } = props;

    const {
        authenticated,
        setNavbarVisibility,
    } = useContext(DomainContext);

    const redirectToSignIn = visibility === 'is-authenticated' && !authenticated;
    const redirectToHome = visibility === 'is-not-authenticated' && authenticated;

    const redirect = redirectToSignIn || redirectToHome;

    useEffect(
        () => {
            // NOTE: should not set visibility for redirection
            // or, navbar will flash
            if (!redirect) {
                setNavbarVisibility(navbarVisibility);
            }
        },
        // NOTE: setNavbarVisibility will not change, navbarVisibility will not change
        [setNavbarVisibility, navbarVisibility, redirect],
    );

    if (redirectToSignIn) {
        console.warn('Redirecting to sign-in');
        return (
            <Redirect to="/login/" />
        );
    }

    if (redirectToHome) {
        console.warn('Redirecting to home');
        return (
            <Redirect to="/" />
        );
    }

    return (
        <>
            <DocumentTitle value={`Mera | ${title}`} />
            <Comp
                className={styles.view}
                {...componentProps}
            />
        </>
    );
}

export default View;
