import React, { lazy, useState } from 'react';
import { _cs } from '@togglecorp/fujs';

import { Button } from '@togglecorp/toggle-ui';
import * as AiIcons from 'react-icons/Ai';
import * as FaIcons from 'react-icons/fa';
import styles from './styles.css';

const LeaveModal = lazy(() => import('#components/LeaveModal'));

interface Props {
    className?: string;
}
const TodayLeave = [
    {
        description: 'Richard is off sick today.',
    },
    {
        description: 'Richard is off sick today.',
    },
];

function Dashboard(props: Props) {
    const { className } = props;
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleModalChange = () => {
        setShowModal(!showModal);
    };

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
                    icons={<FaIcons.FaRegCalendarAlt />}
                >
                    Apply Leave
                </Button>
            </div>

            <div className={styles.todayLeaveContainer}>
                <p className={styles.title}>Today</p>
                <div className={styles.leaveLists}>
                    {TodayLeave.map((item) => (
                        <p>
                            <AiIcons.AiFillHome />
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
