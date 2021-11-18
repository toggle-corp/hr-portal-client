import React, { useState } from 'react';
import { DateTimeInput, Modal, SelectInput, TextArea, TextInput } from '@togglecorp/toggle-ui';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.css';

interface Props {
    className?: string;
    showModal?: boolean;
    handleModalClose: any;
}

interface Option {
    key: string;
    label: string;
    parentKey: string;
    parentLabel: string;
}
const options: Option[] = [
    { key: '1', label: 'Apple Apple Apple Apple Apple ', parentKey: '1', parentLabel: 'Red' },
    { key: '2', label: 'Banana', parentKey: '2', parentLabel: 'Yellow Yellow Yellow Yellow Yellow ' },
    { key: '3', label: 'Grapes', parentKey: '3', parentLabel: 'Green' },
    { key: '4', label: 'Avocado', parentKey: '3', parentLabel: 'Green' },
    { key: '5', label: 'Pear', parentKey: '3', parentLabel: 'Green' },
];

function LeaveModal(props: Props) {
    const { className, showModal, handleModalClose } = props;
    const [value, setValue] = useState<any>('');
    const [date, setDate] = useState<string>('');
    const [numberOfDays, setNumberOfDays] = useState<string>('');
    const [additionalInformation, setAdditionalInformation] = useState<string>('');
    // const [{ value }, updateArgs] = useArgs();

    const hanldeSelect = (e: string | undefined) => {
        setValue(e);
    };
    const handleDateChange = (e: string | undefined) => {
        setDate(e);
    };
    const handleAdditionalInfoChange = (e: string | undefined) => {
        setAdditionalInformation(e);
    };

    return (
        <div className={_cs(className, styles.leaveModal)}>
            {showModal && (
                <Modal
                    heading={<h2>Request Leave</h2>}
                    onClose={() => handleModalClose()}
                >
                    <SelectInput
                        label="Leave Type"
                        value={value}
                        options={options}
                        keySelector={(d) => d.key}
                        labelSelector={(d) => d.label}
                        onChange={hanldeSelect}
                        nonClearable
                    />
                    <DateTimeInput
                        label="Date"
                        name="date"
                        value={value}
                        onChange={(e) => handleDateChange(e)}
                    />
                    <TextInput
                        label="Number of Day"
                        name="numberOfDays"
                        value={numberOfDays}
                        disabled
                    />
                    <TextArea
                        label="Additional Information"
                        name="additionalInformation"
                        value={additionalInformation}
                        onChange={(e) => handleAdditionalInfoChange(e)}
                    />
                </Modal>
            )}

        </div>
    );
}

export default LeaveModal;
