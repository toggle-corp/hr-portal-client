import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Button, createDateTimeColumn, createStringColumn, Table } from '@togglecorp/toggle-ui';
import * as FaIcons from 'react-icons/fa';

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

function Leave(props: Props) {
    const { className } = props;
    const data: Program[] = [
        {
            id: 1,
            requestType: 'One Day',
            dated: '2012-10-12T12:00:00',
            duration: '1 Day',
            leaveType: 'Sick',
            remarks: '',
            status: 'Pending',
        },
        {
            id: 2,
            requestType: 'One Day',
            dated: '2012-10-12T12:00:00',
            duration: '1 Day',
            leaveType: 'Sick',
            remarks: '',
            status: 'Pending',
        },
        {
            id: 3,
            requestType: 'One Day',
            dated: '2012-10-12T12:00:00',
            duration: '1 Day',
            leaveType: 'Sick',
            remarks: '',
            status: 'Pending',
        },
        {
            id: 3,
            requestType: 'One Day',
            dated: '2012-10-12T12:00:00',
            duration: '1 Day',
            leaveType: 'Sick',
            remarks: '',
            status: 'Pending',
        },
        {
            id: 4,
            requestType: 'One Day',
            dated: '2012-10-12T12:00:00',
            duration: '1 Day',
            leaveType: 'Sick',
            remarks: '',
            status: 'Pending',
        },
        {
            id: 5,
            requestType: 'One Day',
            dated: '2012-10-12T12:00:00',
            duration: '1 Day',
            leaveType: 'Sick',
            remarks: '',
            status: 'Pending',
        },
        {
            id: 6,
            requestType: 'One Day',
            dated: '2012-10-12T12:00:00',
            duration: '1 Day',
            leaveType: 'Sick',
            remarks: '',
            status: 'Pending',
        },
        {
            id: 7,
            requestType: 'One Day',
            dated: '2012-10-12T12:00:00',
            duration: '1 Day',
            leaveType: 'Sick',
            remarks: '',
            status: 'Pending',
        },

    ];

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
        createDateTimeColumn<Program, number>(
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
            'Stauts',
            (item) => item.status,
            {
                sortable: true,
                orderable: true,
                columnWidth: 200,
            },
        ),
    ];
    const tableKeySelector = (p: Program) => p.id;
    return (
        <div className={_cs(className, styles.leave)}>
            <div className={styles.btnContainer}>
                <p>My Leaves</p>
                <Button name="applyLeave" icons={<FaIcons.FaRegCalendarAlt />}>
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
        </div>
    );
}

export default Leave;
