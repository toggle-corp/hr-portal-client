import React, { useCallback, useState } from 'react';
import {
    Button,
    DateRangeInput,
    Modal,
    RadioInput,
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
import { gql, useQuery } from '@apollo/client';

import { DayLeaveTypeQuery, LeaveTypeQuery } from '#generated/types';

import styles from './styles.css';

const GET_LEAVE_TYPE = gql`
    query leaveType{
        leaveTypeChoices: __type(name: "LeaveTypeEnum") {
            name
            enumValues {
            name
            description
            }
        }
    }
`;
const GET_LEAVE_DAY_TYPE = gql`
    query dayLeaveType{
        leaveDayTypeChoices: __type(name: "LeaveDayTypeEnum") {
            name
            enumValues {
            name
            description
            }
        }
    }
`;

interface Option {
    name?: string,
    description?: string,
}
interface Props {
    className?: string;
    modalShown?: boolean;
    handleModalClose: () => void;
}
interface ArrayProps {
    type?: string,
    date?: string,

}
type FormType = {
    type: string;
    numOfDay: string;
    leaveDays: ArrayProps,
    additionalInformation: string;
};
type FormSchema = ObjectSchema<PartialForm<FormType>>
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        type: [],
        numOfDay: [],
        leaveDays: [],
        additionalInformation: [],
    }),
};

const defaultFormValues: PartialForm<FormType> = {
    type: 'SICK',
    leaveDays: {
        type: '',
        date: '',
    },
};

const labelSelector = ((d: Option) => d.description);
const keySelector = ((d: Option) => d.name);

function LeaveModal(props: Props) {
    const [dateRange, setDateRange] = useState<null>();
    const [dateLists, setDateLists] = useState<string[]>();
    const {
        data: result,
    } = useQuery<LeaveTypeQuery>(GET_LEAVE_TYPE, {});
    const {
        data: dayLeaveOptions,
    } = useQuery<DayLeaveTypeQuery>(GET_LEAVE_DAY_TYPE, {});

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

    let leaveDays: ArrayProps[] = [];
    const handleRadio = useCallback(
        (e: string, el: string) => {
            const obj: { type: string | undefined, date: string | undefined } = {
                type: undefined,
                date: undefined,
            };
            const hasDate: boolean = leaveDays.some((x) => x?.date === el);
            if (!hasDate) {
                obj.date = el;
                obj.type = e;
                leaveDays.push(obj);
                setValue({ ...value, leaveDays });
            } else {
                const updatedData = leaveDays.map(
                    (x: ArrayProps) => (x.date === el ? { ...x, type: e } : x),
                );
                leaveDays = [...new Set(updatedData.map(JSON.stringify))].map(JSON.parse);
                setValue({ ...value, leaveDays });
            }
        },
        [setValue],
    );
    const getDaysArray = useCallback(
        (start: Date, end: Date) => {
            const arr = [];
            for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
                if (new Date(dt).getDay() !== 0 && new Date(dt).getDay() !== 6) {
                    arr.push(new Date(dt));
                }
            }
            return arr;
        },
        [],
    );
    const handleDateChange = useCallback(
        (e) => {
            setDateRange(e);
            const dayList = getDaysArray(new Date(e.startDate), new Date(e.endDate));
            const formattedDate = dayList.map((v: Date) => v.toISOString().split('T')[0]);
            setDateLists(formattedDate);
        },
        [getDaysArray],
    );

    const error = getErrorObject(riskyError);

    if (!modalShown) {
        return null;
    }

    console.log({ value });
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
                    name="type"
                    value={value.type}
                    options={result
                        && result?.leaveTypeChoices?.enumValues}
                    labelSelector={labelSelector}
                    keySelector={keySelector}
                    onChange={setFieldValue}
                    error={error?.type}
                />
                <DateRangeInput
                    variant="form"
                    label="Date"
                    name="dateRange"
                    value={dateRange}
                    error={error?.dateRange}
                    onChange={handleDateChange}
                />
                {dateLists && dateLists.map((el, i) => (
                    <div style={{ display: 'flex', alignItems: 'center' }} key={el}>
                        <div>{el}</div>
                        <div style={{ fontSize: '0.8rem' }}>
                            <RadioInput
                                label=""
                                name="leaveDays"
                                value={value?.leaveDays[i]?.date === el
                                    ? value?.leaveDays[i]?.type : value?.leaveDays?.type}
                                error={error?.leaveDays?.type}
                                onChange={(e) => handleRadio(e, el)}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                options={dayLeaveOptions
                                    && dayLeaveOptions?.leaveDayTypeChoices?.enumValues}
                            />
                        </div>
                    </div>
                ))}

                <TextInput
                    disabled
                    label="Number of Day/s"
                    name="numOfDay"
                    value={value.numOfDay}
                    onChange={setFieldValue}
                    error={error?.numOfDay}
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
