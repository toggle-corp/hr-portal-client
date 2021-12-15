import React, { useCallback, useState } from 'react';
import {
    Button,
    createStringColumn,
    TableView,
} from '@the-deep/deep-ui';
import { _cs } from '@togglecorp/fujs';
import { gql, useQuery } from '@apollo/client';
import { IoCalendarOutline } from 'react-icons/io5';

import LeaveModal from '#components/LeaveModal';
import { LeaveListQuery, LeaveType } from '#generated/types';
import { EnumFix } from '#base/types/enumFix';

import styles from './styles.css';

export const GET_LEAVE_LIST = gql`
    query LeaveList {
        leaves {
            results {
                additionalInformation
                endDate
                id
                numOfDays
                requestDayType
                startDate
                status
                typeDisplay
                deniedReason
            }
        }
    }
`;

interface Props {
    className?: string;
}

type Program = NonNullable<EnumFix<LeaveType, 'type' | 'status'>>;
const tableKeySelector = ((p: Program) => (p?.id));

function Leave(props: Props) {
    const { className } = props;
    const [showModal, setShowModal] = useState(false);
    const {
        data: result,
    } = useQuery<LeaveListQuery>(GET_LEAVE_LIST, {});

    const columns = [
        createStringColumn<Program, string>(
            'sn',
            'S.No.',
            (item) => item.id,
            {
                sortable: true,
                orderable: true,
            },
        ),
        createStringColumn<Program, string>(
            'requestDayType',
            'Request Type',
            (item) => item?.requestDayType,
            {
                sortable: true,
                orderable: true,
            },
        ),
        createStringColumn<Program, string>(
            'startDate',
            'Dated',
            (item) => `${item?.startDate} to ${item?.endDate}`,
            {
                sortable: true,
                orderable: true,
                columnWidth: 250,
            },
        ),
        createStringColumn<Program, string>(
            'duration',
            'Duration',
            (item) => (item?.numOfDays).toString(),
            {
                sortable: true,
                orderable: true,
            },
        ),
        createStringColumn<Program, string>(
            'typeDisplay',
            'Leave Type',
            (item) => item?.typeDisplay,
            {
                sortable: true,
                orderable: true,
                columnWidth: 250,
            },
        ),
        createStringColumn<Program, string>(
            'deniedReason',
            'Remarks',
            (item) => item?.deniedReason,
            {
                sortable: true,
                orderable: true,
            },
        ),
        createStringColumn<Program, string>(
            'status',
            'Status',
            (item) => item?.status,
            {
                sortable: true,
                orderable: true,
            },
        ),
    ];

    const handleModalChange = useCallback(() => setShowModal(!showModal), [showModal]);

    return (
        <div className={_cs(className, styles.leave)}>
            <div className={styles.btnContainer}>
                <div className={styles.title}>My Leaves</div>
                <Button
                    onClick={handleModalChange}
                    name="applyLeave"
                    icons={<IoCalendarOutline />}
                >
                    Apply Leave
                </Button>
            </div>
            <div>
                <TableView
                    keySelector={tableKeySelector}
                    columns={columns}
                    data={result?.leaves?.results}
                />
            </div>
            <LeaveModal
                modalShown={showModal}
                handleModalClose={handleModalChange}
            />
        </div>
    );
}

export default Leave;
