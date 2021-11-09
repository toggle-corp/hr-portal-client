import React, { Suspense, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';
import { PendingMessage } from '@togglecorp/toggle-ui';

import DomainContext from '#components/DomainContext';

import { User } from '#types';

import routeSettings, { lostRoute } from '#config/routes';
import { useRequest } from '#utils/request';
import Navbar from '#components/Navbar';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Multiplexer(props: Props) {
    const {
        className,
    } = props;

    // TODO: need to sync authentication status between tabs
    const [user, setUser] = useState<User | undefined>();
    const [, setError] = useState<unknown>();
    const [waiting, setWaiting] = useState(true);
    const [navbarVisibility, setNavbarVisibility] = useState(false);

    const authenticated = !!user;

    useRequest<User>({
        url: '/users/me/',
        onSuccess: (response) => {
            setUser(response);
            setWaiting(false);
        },
        onFailure: (response) => {
            setError(response);
            setWaiting(false);
        },
    });

    /*
    if (error) {
        return (
            <div className={_cs(className, styles.multiplexer)}>
                <PendingMessage message="Some error occurred!" />
            </div>
        );
    }
    */

    if (waiting) {
        return (
            <div className={_cs(className, styles.multiplexer)}>
                <PendingMessage message="Checking user session..." />
            </div>
        );
    }

    const domainContextValue: DomainContext = {
        authenticated,
        user,
        setUser,
        navbarVisibility,
        setNavbarVisibility,
    };

    return (
        <DomainContext.Provider value={domainContextValue}>
            <div className={_cs(className, styles.multiplexer)}>
                {navbarVisibility && authenticated && (
                    <Navbar className={styles.navbar} />
                )}
                <div className={styles.content}>
                    <Suspense
                        fallback={(
                            <PendingMessage message="Loading page..." />
                        )}
                    >
                        <Switch>
                            <Route
                                exact
                                path={routeSettings.home.path}
                                render={routeSettings.home.load}
                            />
                            <Route
                                exact
                                path={routeSettings.login.path}
                                render={routeSettings.login.load}
                            />
                            <Route
                                exact
                                path={lostRoute.path}
                                render={lostRoute.load}
                            />
                        </Switch>
                    </Suspense>
                </div>
            </div>
        </DomainContext.Provider>
    );
}
export default Multiplexer;
