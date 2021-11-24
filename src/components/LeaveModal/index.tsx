import React, { useCallback } from 'react';
import { Button, DateTimeInput, Modal, SelectInput, TextArea, TextInput } from '@togglecorp/toggle-ui';
import { createSubmitHandler, ObjectSchema, PartialForm, PurgeNull, requiredStringCondition, useForm } from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';

import NonFieldError from '#components/NonFieldError';

import styles from './styles.css';

interface Props {
    className?: string;
    modalShown?: boolean;
    handleModalClose: any;
}
interface LeaveDataType {
    leaveType: string,
    date: string,
    numberOfDay: string;
    additionalInformation: string;
}
interface Option {
    key: string;
    label: string;
    parentKey: string,
    parentLabel: string,
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
        label: 'Bereavement Leave',
        parentKey: '5',
        parentLabel: '',
    },
];

type LoginFormFields = LeaveDataType;
type FormType = PurgeNull<PartialForm<LoginFormFields>>;
type FormSchema = ObjectSchema<FormType>
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        leaveType: [requiredStringCondition],
        date: [requiredStringCondition],
        numberOfDay: [requiredStringCondition],
        additionalInformation: [requiredStringCondition],
    }),
};
const initialLoginFormFields: FormType = {};
const keySelector = ((d: any) => d.label);
const labelSelector = ((d: any) => d.label);

function LeaveModal(props: Props) {
    const {
        className,
        modalShown,
        handleModalClose,
    } = props;

    const {
        value,
        error,
        onValueChange,
        onErrorSet,
        validate,
        onValueSet,
    } = useForm(initialLoginFormFields, schema);

    const handleSubmit = useCallback(
        (finalValues: PartialForm<FormType>) => {
            onValueSet(finalValues);
        }, [onValueSet],
    );

    return (
        <>
            {modalShown && (
                <Modal
                    className={_cs(className, styles.leaveModal)}
                    heading={<h2>Request Leave</h2>}
                    footer={(
                        <Button
                            className={styles.btnSubmit}
                            type="submit"
                            name={undefined}
                            variant="primary"
                        >
                            Submit
                        </Button>
                    )}
                    onClose={handleModalClose}
                >
                    <form
                        onSubmit={createSubmitHandler(validate, onErrorSet, handleSubmit)}
                    >
                        <NonFieldError error={error?.nonFieldErrors} />
                        <SelectInput
                            label="Leave Type"
                            name="leaveType"
                            value={value.leaveType}
                            options={options}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            onChange={onValueChange}
                            error={error?.fields?.additionalInformation}
                            nonClearable
                        />
                        <DateTimeInput
                            label="Date"
                            name="date"
                            value={value.date}
                            onChange={onValueChange}
                            error={error?.fields?.additionalInformation}
                        />
                        <TextInput
                            label="Number of Day/s"
                            name="numberOfDay"
                            value={value.numberOfDay}
                            error={error?.fields?.numberOfDay}
                            disabled
                        />
                        <TextArea
                            label="Additional Information"
                            name="additionalInformation"
                            value={value.additionalInformation}
                            onChange={onValueChange}
                            error={error?.fields?.additionalInformation}
                        />
                    </form>
                </Modal>
            )}
        </>
    );
}
export default LeaveModal;
