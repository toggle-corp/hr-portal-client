import React, { useCallback, useContext } from 'react';
import { Button } from '@togglecorp/toggle-ui';
import { _cs } from '@togglecorp/fujs';

import { useLazyRequest } from '#utils/request';
import DomainContext from '#components/DomainContext';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Home(props: Props) {
    const { className } = props;
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
        <div className={_cs(className, styles.navbar)}>
            <div className={styles.brand}>
                Mera
            </div>
            <div className={styles.rightContainer}>
                <Button
                    variant="primary"
                    name={undefined}
                    onClick={handleLogoutClick}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default Home;
