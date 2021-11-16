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
        path: '/',
        title: 'Home',
        component: lazy(() => import('../components/Navbar')),
        componentProps: {},
        visibility: 'is-not-authenticated',
        navbarVisibility: true,
    }),
    login: wrap({
        path: '/login/',
        title: 'Login',
        component: lazy(() => import('../views/Login')),
        componentProps: {},
        visibility: 'is-not-authenticated',
        navbarVisibility: false,
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

export const DashboardRouteSetting = {
    dashboard: wrap({
        path: '/dashboard',
        title: 'Dashboard',
        component: lazy(() => import('#views/Home')),
        componentProps: {},
        visibility: 'is-not-authenticated',
        navbarVisibility: false,
    }),
};

export default routeSettings;
