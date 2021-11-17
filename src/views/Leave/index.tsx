import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { createDateColumn, createDateTimeColumn, createNumberColumn, createStringColumn, createYesNoColumn, Table } from '@togglecorp/toggle-ui';
import styles from './styles.css';

interface Props {
    className?: string;
}

function Leave(props: Props) {
    const { className } = props;

    interface Program {
        requestType: string;
        duration: string;
        dated: string;
        leaveType: string;
        remarks?: string;
        status: string;
    }
    const data: Program[] = [
        {
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
            <Table
                keySelector={tableKeySelector}
                columns={columns}
                data={data}
            />
        </div>
    );
}

export default Leave;
