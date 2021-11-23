import React, { FormEvent, useCallback, useState } from 'react';
import { Button, DateTimeInput, Modal, SelectInput, TextArea, TextInput } from '@togglecorp/toggle-ui';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.css';

interface Props {
    className?: string;
    modalShown?: boolean;
    handleModalClose: any;
}
interface Option {
    key: string;
    label: string;
    parentKey: string;
    parentLabel: string;
}

const options: Option[] = [
    {
        key: '1',
        label: 'Sick and Casual Leave',
        parentKey: '1',
        parentLabel: '',
    },
    {
        key: '2',
        label: 'Replacement Leave',
        parentKey: '2',
        parentLabel: '',
    },
    {
        key: '3',
        label: 'Maternity Leave',
        parentKey: '3',
        parentLabel: '',
    },
    {
        key: '4',
        label: 'Paternity Leave',
        parentKey: '4',
        parentLabel: '',
    },
    {
        key: '5',
        label: 'Bereaevment Leave',
        parentKey: '5',
        parentLabel: '',
    },
];

function LeaveModal(props: Props) {
    const {
        className,
        modalShown,
        handleModalClose,
    } = props;

    const [data, setData] = useState({
        leaveType: '',
        date: '',
        numberOfDays: '',
        additionalInformation: '',
    });

    const handleChange = useCallback((value: string, name: string) => {
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, [],
    );

    const handleChangeAdditional = useCallback(
        (value: string | undefined, name: string, e: FormEvent) => {
            setData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }, [],
    );
    const keySelector = useCallback((d: any) => d.label, []);
    const labelSelector = useCallback((d: any) => d.label, []);

    return (
        <>
            {modalShown && (
                <Modal
                    className={_cs(className, styles.leaveModal)}
                    heading={<h2>Request Leave</h2>}
                    footer={(
                        <Button
                            name="submit"
                            variant="primary"
                        >
                            Submit
                        </Button>
                    )}
                    onClose={handleModalClose}
                >
                    <SelectInput
                        label="Leave Type"
                        name="leaveType"
                        value={data.leaveType}
                        options={options}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        onChange={handleChange}
                        nonClearable
                    />
                    <DateTimeInput
                        label="Date"
                        name="date"
                        value={data.date}
                        onChange={() => ('')}
                    />
                    <TextInput
                        label="Number of Day"
                        name="numberOfDays"
                        value={data.numberOfDays}
                        disabled
                    />
                    <TextArea
                        label="Additional Information"
                        name="additionalInformation"
                        value={data.additionalInformation}
                        onChange={handleChangeAdditional}
                    />
                </Modal>
            )}
        </>
    );
}
export default LeaveModal;
