import React, { useCallback, useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';

import { NavLink } from 'react-router-dom';
import { Avatar } from '@togglecorp/toggle-ui';
import { useLazyRequest } from '#utils/request';
import DomainContext from '#components/DomainContext';

import styles from './styles.css';

interface Props {
    className?: string;
    children?: React.ReactNode;
}
const SidebarData = [
    {
        id: 1,
        title: 'Dashboard',
        path: '/',
    },
    {
        id: 2,
        title: 'My Leave',
        path: '/leave',
    },
    {
        id: 3,
        title: 'Attendance',
        path: '/attendance',
    },
    {
        id: 4,
        title: 'Timesheet',
        path: '/timesheet',
    },
    {
        id: 5,
        title: 'Payroll',
        path: '/payrool',
    },
];
function Navbar(props: Props) {
    const { className, children } = props;
    const { setUser } = useContext(DomainContext);

    const {
        trigger: logout,
    } = useLazyRequest<null, null>({
        method: 'POST',
        body: () => '',
        url: '/users/logout/',
        onSuccess: () => {
            setUser(undefined);
        },
    });

    const handleLogoutClick = useCallback(() => {
        logout(null);
    }, [logout]);

    return (
        <div className={_cs(className, styles.layout)}>
            <div className={_cs(className, styles.home)}>
                <div className={styles.sidenav}>
                    <div className={styles.logoContainer}>
                        ToggleCorp
                    </div>
                    {SidebarData.map((item) => (
                        <li key={item.id} className={styles.navText}>
                            <NavLink
                                exact
                                to={item.path}
                                style={(isActive) => ({
                                    color: isActive ? 'var(--color-foreground)' : 'var(--color-text)',
                                    backgroundColor: isActive ? 'var(--color-primary)' : '',
                                })}
                            >
                                <span>{item.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </div>
                <div className={styles.topnav}>
                    <div className={styles.brand}>
                        <GiIcons.GiHamburgerMenu />
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.iconBell}>
                            <FaIcons.FaBell />
                        </div>
                        <div className={styles.avatarContainer}>
                            <Avatar
                                alt="Ram Bahadur"
                                className={styles.avatar}
                                src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg"
                            />
                        </div>
                        <div className={styles.userInfoContainer}>
                            <p className={styles.userName}>Jhon Doe</p>
                            <p className={styles.userPosition}>Developer</p>
                        </div>
                        <div className={styles.iconDown}>
                            <FaIcons.FaAngleDown />
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
            <div className={styles.footer}>
                Copyright &copy; 2021 ToggleCorp. All rights reserved.
            </div>
        </div>
    );
}

export default Navbar;
