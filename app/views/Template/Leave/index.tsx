import React, { useCallback, useState } from 'react';
import {
    Button,
    createStringColumn,
    Table,
} from '@the-deep/deep-ui';
import { _cs } from '@togglecorp/fujs';
import { IoCalendarOutline } from 'react-icons/io5';

import LeaveModal from '#components/LeaveModal';

import styles from './styles.css';

interface Props {
    className?: string;
}
interface Program {
    id: number;
    requestType: string;
    duration: string;
    dated: string;
    leaveType: string;
    remarks?: string;
    status: string;
}

const data: Program[] = [
    {
        id: 1,
        requestType: 'Multiple Days',
        dated: '2012-10-12',
        duration: '5 Day',
        leaveType: 'Sick and Casual Leave',
        remarks: '',
        status: 'Pending',
    },
    {
        id: 2,
        requestType: 'One Day',
        dated: '2012-10-12',
        duration: '1 Day',
        leaveType: 'Sick and Casual Leave',
        remarks: '',
        status: 'Pending',
    },
    {
        id: 3,
        requestType: 'One Day',
        dated: '2012-10-12',
        duration: '1 Day',
        leaveType: 'Sick and Casual Leave',
        remarks: '',
        status: 'Pending',
    },
    {
        id: 4,
        requestType: 'One Day',
        dated: '2012-10-12',
        duration: '1 Day',
        leaveType: 'Sick and Casual Leave',
        remarks: '',
        status: 'Pending',
    },
    {
        id: 5,
        requestType: 'One Day',
        dated: '2012-10-12',
        duration: '1 Day',
        leaveType: 'Sick and Casual Leave',
        remarks: '',
        status: 'Pending',
    },
    {
        id: 6,
        requestType: 'One Day',
        dated: '2012-10-12',
        duration: '1 Day',
        leaveType: 'Sick and Casual Leave',
        remarks: '',
        status: 'Approved',
    },
    {
        id: 7,
        requestType: 'One Day',
        dated: '2012-10-28 to 2012-11-01',
        duration: '1 Day',
        leaveType: 'Sick and Casual Leave',
        remarks: '',
        status: 'Approved',
    },
    {
        id: 8,
        requestType: 'One Day',
        dated: '2012-10-12 to 2012-11-15',
        duration: '1 Day',
        leaveType: 'Sick and Casual Leave',
        remarks: '',
        status: 'Approved',
    },
];

const tableKeySelector = ((p: Program) => (p.id));

function Leave(props: Props) {
    const { className } = props;
    const [showModal, setShowModal] = useState(false);

    const columns = [
        createStringColumn<Program, number>(
            'requestType',
            'Request Type',
            (item) => item.requestType,
            {
                sortable: true,
                orderable: true,
                columnWidth: 220,
            },
        ),
        createStringColumn<Program, number>(
            'dated',
            'Dated',
            (item) => item.dated,
            {
                sortable: true,
                orderable: true,
                columnWidth: 400,
            },
        ),
        createStringColumn<Program, number>(
            'duration',
            'Duration',
            (item) => item.duration,
            {
                sortable: true,
                orderable: true,
                columnWidth: 200,
            },
        ),
        createStringColumn<Program, number>(
            'leaveType',
            'Leave Type',
            (item) => item.leaveType,
            {
                sortable: true,
                orderable: true,
                columnWidth: 260,
            },
        ),
        createStringColumn<Program, number>(
            'remarks',
            'Remarks',
            (item) => item.remarks,
            {
                sortable: true,
                orderable: true,
                columnWidth: 200,
            },
        ),
        createStringColumn<Program, number>(
            'status',
            'Status',
            (item) => item.status,
            {
                sortable: true,
                orderable: true,
                columnWidth: 200,
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
                <Table
                    keySelector={tableKeySelector}
                    columns={columns}
                    data={data}
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
