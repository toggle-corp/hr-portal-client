import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Avatar } from '@togglecorp/toggle-ui';
import { NavLink } from 'react-router-dom';
import {
    IoNotifications,
    IoMenu,
    IoChevronDown,
} from 'react-icons/io5';

import styles from './styles.css';

interface Props {
    className?: string;
    children?: React.ReactNode;
}
interface Program {
    id: number;
    title: string,
    path: string,
}

const sidebarData: Program[] = [
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
        title: 'Time sheet',
        path: '/timesheet',
    },
    {
        id: 5,
        title: 'Payroll',
        path: '/payroll',
    },
];

function Navbar(props: Props) {
    const {
        className,
        children,
    } = props;

    return (
        <div className={_cs(className, styles.layout)}>
            <div className={_cs(className, styles.home)}>
                <div className={styles.sideNav}>
                    <div className={styles.logoContainer}>
                        Togglecorp
                    </div>
                    {sidebarData.map((item) => (
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
                <div className={styles.topNav}>
                    <div className={styles.brand}>
                        <IoMenu />
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.iconBell}>
                            <IoNotifications />
                        </div>
                        <div className={styles.avatarContainer}>
                            <Avatar
                                alt=""
                                className={styles.avatar}
                                src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg"
                            />
                        </div>
                        <div className={styles.userInfoContainer}>
                            <p className={styles.userName}>John Doe</p>
                            <p className={styles.userPosition}>Developer</p>
                        </div>
                        <div className={styles.iconDown}>
                            <IoChevronDown />
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
            <div className={styles.bottom}>
                Copyright &copy; 2021 Togglecorp. All rights reserved.
            </div>
        </div>
    );
}
export default Navbar;
