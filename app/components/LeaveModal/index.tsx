import React, { useCallback } from 'react';
import {
    Button,
    DateRangeInput,
    Modal,
    SelectInput,
    TextArea,
    TextInput,
} from '@the-deep/deep-ui';
import {
    createSubmitHandler,
    getErrorObject,
    internal,
    ObjectSchema,
    PartialForm,
    useForm,
} from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.css';

interface Props {
    className?: string;
    modalShown?: boolean;
    handleModalClose: () => void;
}
interface Option {
    key: string;
    label: string;
    parentKey: string,
    parentLabel: string,
}
type FormType = {
    leaveType: string;
    numberOfDay: string;
    date: null | undefined;
    additionalInformation: string;
};
type FormSchema = ObjectSchema<PartialForm<FormType>>
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        leaveType: [],
        numberOfDay: [],
        date: [],
        additionalInformation: [],
    }),
};

const defaultFormValues: PartialForm<FormType> = {
    leaveType: '1',
};

const labelSelector = ((d: Option) => d.label);
const keySelector = ((d: Option) => d.key);

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

function LeaveModal(props: Props) {
    const {
        className,
        modalShown,
        handleModalClose,
    } = props;

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
        setValue,
    } = useForm(schema, defaultFormValues);

    const handleSubmit = useCallback(
        (finalValues: PartialForm<FormType>) => {
            setValue(finalValues);
        }, [setValue],
    );

    const error = getErrorObject(riskyError);

    if (!modalShown) {
        return null;
    }

    return (
        <Modal
            className={_cs(className, styles.leaveModal)}
            heading={<h2>Request Leave</h2>}
            footer={(
                <Button
                    className={styles.btnSubmit}
                    type="submit"
                    name={undefined}
                    variant="tertiary"
                    disabled={pristine}
                >
                    Submit
                </Button>
            )}
            onCloseButtonClick={handleModalClose}
        >
            <form
                onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
            >
                <p>
                    {error?.[internal]}
                </p>
                <SelectInput
                    label="Leave Type"
                    name="leaveType"
                    value={value.leaveType}
                    options={options}
                    labelSelector={labelSelector}
                    keySelector={keySelector}
                    onChange={setFieldValue}
                    error={error?.leaveType}
                />
                <TextInput
                    disabled
                    label="Number of Day/s"
                    name="numberOfDay"
                    value={value.numberOfDay}
                    onChange={setFieldValue}
                    error={error?.numberOfDay}
                />
                <DateRangeInput
                    label="Date"
                    name="date"
                    value={value.date}
                    error={error?.date}
                />
                <TextArea
                    label="Additional Information"
                    name="additionalInformation"
                    value={value.additionalInformation}
                    onChange={setFieldValue}
                    error={error?.additionalInformation}
                />
            </form>
        </Modal>
    );
}
export default LeaveModal;
