import React, { useCallback, useContext, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { Button } from '@the-deep/deep-ui';
import { IoCalendarOutline, IoHomeSharp } from 'react-icons/io5';
import { gql, useQuery } from '@apollo/client';

import LeaveModal from '#components/LeaveModal';
import UserContext from '#base/context/UserContext';

import styles from './styles.css';
import { TodayOnLeaveQuery } from '#generated/types';

interface Props {
    className?: string;
}
const TodayLeave = gql`
    query TodayOnLeave {
        todayOnLeave {
            typeDisplay
            user
            additionalInformation
        }
    }
`;

function Dashboard(props: Props) {
    const { data } = useQuery<TodayOnLeaveQuery>(TodayLeave, {});
    const { user } = useContext(UserContext);
    const { className } = props;
    const [showModal, setShowModal] = useState(false);
    const handleModalChange = useCallback(() => setShowModal(!showModal), [showModal]);

    return (
        <div className={_cs(className, styles.dashboard)}>
            <div className={styles.cardContainer}>
                <div className={styles.cardLeave}>
                    <div className={styles.leaveText}>
                        <p>
                            {user?.remainingLeave}
                        </p>
                        <p>Remaining</p>
                    </div>
                    <hr />
                    <div className={styles.leaveText}>
                        <p>
                            {user?.totalLeavesDays}
                        </p>
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
                    {data?.todayOnLeave?.map((item) => (
                        <div
                            key={item?.user}
                            className={styles.todayLeaveUser}
                        >
                            <div><IoHomeSharp /></div>
                            <div>
                                {`${item?.user}  ${item?.additionalInformation}`}
                            </div>
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
