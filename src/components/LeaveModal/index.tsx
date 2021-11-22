import React, { useState } from 'react';
import { Button, DateTimeInput, Modal, SelectInput, TextArea, TextInput } from '@togglecorp/toggle-ui';
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

    const hanldeSelect = () => {
        setValue('');
    };
    const handleDateChange = () => {
        setDate('');
    };
    const handleAdditionalInfoChange = () => {
        setAdditionalInformation('');
    };

    return (
        <div>
            {showModal && (
                <Modal
                    className={_cs(className, styles.leaveModal)}
                    heading={<h2>Request Leave</h2>}
                    onClose={() => handleModalClose()}
                >
                    <SelectInput
                        label="Leave Type"
                        name="leaveType"
                        value={value}
                        options={options}
                        keySelector={(d) => d.key}
                        labelSelector={(d) => d.label}
                        onChange={() => hanldeSelect()}
                        nonClearable
                    />
                    <DateTimeInput
                        label="Date"
                        name="date"
                        value={value}
                        onChange={() => handleDateChange()}
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
                        onChange={() => handleAdditionalInfoChange()}
                    />
                    <div className={styles.btnSubmit}>
                        <Button name="submit" variant="primary">
                            Submit
                        </Button>
                    </div>

                </Modal>
            )}

        </div>
    );
}

export default LeaveModal;
