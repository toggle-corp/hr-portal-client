import React, { lazy, useCallback, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { Button } from '@togglecorp/toggle-ui';
import { IoCalendarOutline, IoHomeSharp } from 'react-icons/io5';

import styles from './styles.css';

const LeaveModal = lazy(() => import('#components/LeaveModal'));

interface Props {
    className?: string;
}

function Dashboard(props: Props) {
    const { className } = props;
    const [showModal, setShowModal] = useState(false);

    const todayLeave = useMemo(() => [
        {
            id: 1,
            description: 'Richard is off sick today.',
        },
        {
            id: 2,
            description: 'Richard is off sick today.',
        },
    ], []);

    const handleModalChange = useCallback(() => setShowModal(!showModal), [showModal]);

    return (
        <div className={_cs(className, styles.dashboard)}>
            <div className={styles.cardContainer}>
                <div className={styles.cardLeave}>
                    <div className={styles.leaveText}>
                        <p>7</p>
                        <p>Remaining</p>
                    </div>
                    <hr />
                    <div className={styles.leaveText}>
                        <p>24</p>
                        <p>Total</p>
                    </div>
                </div>
                <Button
                    onClick={handleModalChange}
                    name="applyLeave"
                    icons={<IoCalendarOutline />}
                >
                    Apply Leave
                </Button>
            </div>
            <div className={styles.todayLeaveContainer}>
                <div className={styles.title}>Today</div>
                <div className={styles.leaveLists}>
                    {todayLeave.map((item) => (
                        <div key={item.id} className={styles.todayLeaveUser}>
                            <div><IoHomeSharp /></div>
                            <div>{item.description}</div>
                        </div>
                    ))}
                </div>
            </div>
            <LeaveModal
                modalShown={showModal}
                handleModalClose={handleModalChange}
            />
        </div>
    );
}
export default Dashboard;
