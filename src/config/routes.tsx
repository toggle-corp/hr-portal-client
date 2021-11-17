import React, { lazy } from 'react';
import View, { ViewProps } from '#components/View';

export function wrap<T extends string, K extends { className?: string }>(
    props: ViewProps<K> & { path: T },
) {
    console.log(props);
    const {
        path,
        component,
        componentProps,
        ...otherProps
    } = props;

    return {
        ...otherProps,
        path,
        load: () => (
            <View
                component={component}
                componentProps={componentProps}
                {...otherProps}
            />
        ),
    };
}

const routeSettings = {
    home: wrap({
        path: '/home',
        title: 'Leave Tracker',
        component: lazy(() => import('../components/Navbar')),
        componentProps: {},
        visibility: 'is-not-authenticated',
        navbarVisibility: false,
    }),
    login: wrap({
        path: '/',
        title: 'Login',
        component: lazy(() => import('../views/Login')),
        componentProps: {},
        visibility: 'is-authenticated',
        navbarVisibility: true,
    }),
};

export const lostRoute = {
    path: undefined,
    title: '404',
    load: () => (
        <View
            title="404"
            component={lazy(() => import('../views/FourHundredFour'))}
            componentProps={{}}
            visibility="is-anything"
            navbarVisibility
        />
    ),
};

export const dashboardRouteSetting = {
    dashboard: wrap({
        path: '/',
        title: 'Dashboard',
        component: lazy(() => import('#views/Dashboard')),
        componentProps: {},
        visibility: 'is-not-authenticated',
        navbarVisibility: false,
    }),
    leave: wrap({
        path: '/leave',
        title: 'Leave',
        component: lazy(() => import('#views/Leave')),
        componentProps: {},
        visibility: 'is-not-authenticated',
        navbarVisibility: false,
    }),
};

export default routeSettings;
