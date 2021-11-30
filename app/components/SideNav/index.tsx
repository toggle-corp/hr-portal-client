import React from 'react';
import { _cs } from '@togglecorp/fujs';

import SmartNavLink from '#base/components/SmartNavLink';
import routes from '#base/configs/routes';

import styles from './styles.css';

interface Props {
    className?: string;
}

function SideNav(props: Props) {
    const { className } = props;

    return (
        <div className={_cs(className, styles.sideNav)}>
            <div className={styles.logoContainer}>
                Togglecorp
            </div>
            <SmartNavLink
                exact
                route={routes.dashboard}
            />
            <SmartNavLink
                exact
                route={routes.myLeave}
            />
        </div>
    );
}

export default SideNav;
