import React, { lazy, useCallback, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { Button } from '@togglecorp/toggle-ui';
import { IoCalendarOutline, IoHomeSharp } from 'react-icons/io5';

import styles from './styles.css';

const LeaveModal = lazy(() => import('#components/LeaveModal'));

interface Props {
    className?: string;
}

const todayLeave = [
    {
        id: 1,
        description: 'Richard is off sick today.',
    },
    {
        id: 2,
        description: 'Richard is off sick today.',
    },
];

function Dashboard(props: Props) {
    const { className } = props;
    const [showModal, setShowModal] = useState(false);

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
                <p className={styles.title}>Today</p>
                <div className={styles.leaveLists}>
                    {todayLeave.map((item) => (
                        <p key={item.id}>
                            <IoHomeSharp />
                            {item.description}
                        </p>
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
