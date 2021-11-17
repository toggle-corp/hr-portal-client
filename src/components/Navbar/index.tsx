import React, { useCallback, useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';

import { Link } from 'react-router-dom';
import { Avatar } from '@togglecorp/toggle-ui';
import { useLazyRequest } from '#utils/request';
import DomainContext from '#components/DomainContext';
import SidebarData from '#components/SidebarData';

import styles from './styles.css';

interface Props {
    className?: string;
    children?: any,
}

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
                        <li className={styles.navText}>
                            <Link to={item.path}>
                                <span>{item.title}</span>
                            </Link>
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
