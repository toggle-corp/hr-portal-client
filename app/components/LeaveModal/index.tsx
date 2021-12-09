import React, { useCallback, useContext, useState } from 'react';
import {
    AlertContext,
    Button,
    DateRangeInput,
    Modal,
    NumberInput,
    RadioInput,
    SelectInput,
    TextArea,
} from '@the-deep/deep-ui';
import {
    createSubmitHandler,
    ObjectSchema,
    PartialForm,
    requiredCondition,
    useForm,
    getErrorObject,
    getErrorString,
} from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';

import {
    DayLeaveTypeQuery,
    LeaveTypeQuery,
    LeaveApplyInputType,
    LeaveApplyMutation,
    LeaveApplyMutationVariables,
    LeaveDayInputType,
} from '#generated/types';

import styles from './styles.css';
import { GET_LEAVE_LIST } from '#views/Leave';

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
const SUBMIT = gql`
    mutation LeaveApply($input: LeaveApplyInputType!) {
        leaveApply(data: $input) {
            ok
            errors
            result {
                status
            }
        }
    }
`;
type Check<T> = T extends string[] ? string[] : T extends string ? string : undefined;
// eslint-disable-next-line @typescript-eslint/ban-types
export type EnumFix<T, F> = T extends object[] ? (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends any[] ? EnumFix<T[number], F>[] : T
) : ({
    [K in keyof T]: K extends F ? Check<T[K]> : EnumFix<T[K], F>;
})

interface Props {
    className?: string;
    modalShown?: boolean;
    handleModalClose: () => void;
}

type FormType = NonNullable<EnumFix<LeaveApplyInputType, 'type' | 'status'>>;
type FormSchema = ObjectSchema<PartialForm<FormType>>
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        type: [],
        numOfDays: [],
        leaveDays: [requiredCondition],
        additionalInformation: [],
    }),
};

const defaultFormValues: PartialForm<FormType> = {
    type: 'SICK',
    leaveDays: [],
};
export interface EnumEntity<T> {
    name: T;
    description?: string | null;
}
function enumKeySelector<T>(d: EnumEntity<T>) {
    return d.name;
}

function enumLabelSelector<T>(d: EnumEntity<T>) {
    return d.description ?? `${d.name}`;
}

function LeaveModal(props: Props) {
    const { addAlert } = useContext(AlertContext);
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

    const [dateRange, setDateRange] = useState<null>();
    const [dateLists, setDateLists] = useState<string[]>();

    const [getLeaveList] = useLazyQuery(GET_LEAVE_LIST);
    const {
        data: result,
    } = useQuery<LeaveTypeQuery>(GET_LEAVE_TYPE, {});

    const {
        data: dayLeaveOptions,
    } = useQuery<DayLeaveTypeQuery>(GET_LEAVE_DAY_TYPE, {});

    const [
        leaveApply,
    ] = useMutation<LeaveApplyMutation, LeaveApplyMutationVariables>(
        SUBMIT,
        {
            onCompleted: (response) => {
                const { leaveApply: leaveApplyRes } = response;
                if (!leaveApplyRes) {
                    return;
                }
                const {
                    errors,
                    ok,
                } = leaveApplyRes;
                if (errors) {
                    setError({
                        $internal: errors[0]?.messages,
                    });
                    addAlert({
                        children: errors[0]?.messages,
                        name: '',
                        duration: 3000,
                        variant: 'error',
                    });
                } else if (ok) {
                    addAlert({
                        children: 'Leave requested successfully',
                        name: '',
                        duration: 3000,
                        variant: 'success',
                    });
                    handleModalClose();
                    getLeaveList({});
                    setValue({
                        ...value,
                        numOfDays: null,
                        additionalInformation: '',
                    });
                    setDateRange(null);
                    setDateLists([]);
                }
            },
            onError: (errors) => {
                setError({
                    $internal: errors.message,
                });
            },
        },
    );

    const handleSubmit = useCallback(
        (finalValues: FormType) => {
            const completeValue = finalValues as LeaveApplyInputType;
            const dataToSend = {
                type: completeValue.type,
                additionalInformation: completeValue.additionalInformation,
                leaveDays: completeValue.leaveDays,
            };
            leaveApply({
                variables: {
                    input: dataToSend,
                },
            });
        },
        [leaveApply],
    );

    const handleRadio = useCallback(
        async (e: string | number, el: string) => {
            const hasDate = value ?? value?.leaveDays.some((x) => x?.date === el);
            if (hasDate) {
                const updatedData = value?.leaveDays.map(
                    (x) => (x.date === el ? { ...x, type: e } : x),
                );
                const diffData = [...new Set(
                    updatedData.map(JSON.stringify),
                )].map(JSON.parse);
                const filterNoLeave = updatedData.filter((word) => word?.type !== 'NO_LEAVE');
                const numberOfDays = filterNoLeave.length;
                setValue({ ...value, leaveDays: diffData, numOfDays: numberOfDays });
            }
        },
        [setValue, value],
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

    const convertArrayToObject = useCallback(
        (data: string[]) => {
            const arrayObject: Array<LeaveDayInputType> = [];
            data.map((item) => {
                const obj: LeaveDayInputType = {
                    date: item,
                    type: 'FULL',
                };
                return arrayObject.push(obj);
            });
            setValue({ ...value, leaveDays: arrayObject, numOfDays: arrayObject.length });
        },
        [setValue, value],
    );

    const handleDateChange = useCallback(
        async (e) => {
            setDateRange(e);
            const dayList = await getDaysArray(new Date(e.startDate), new Date(e.endDate));
            const formattedDate = await dayList.map((v: Date) => v.toISOString().split('T')[0]);
            convertArrayToObject(formattedDate);
            setDateLists(formattedDate);
        },
        [getDaysArray, convertArrayToObject],
    );

    if (!modalShown) {
        return null;
    }
    const error = getErrorObject(riskyError);

    return (
        <Modal
            className={_cs(className, styles.leaveModal)}
            heading={<h2>Request Leave</h2>}
            footer={null}
            onCloseButtonClick={handleModalClose}
        >
            <form
                onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
            >
                <div className={styles.errorText}>
                    {error?.$internal}
                </div>

                <SelectInput
                    label="Leave Type"
                    name="type"
                    value={value?.type}
                    options={result?.leaveTypeChoices?.enumValues}
                    keySelector={enumKeySelector}
                    labelSelector={enumLabelSelector}
                    onChange={setFieldValue}
                    error={error?.type}
                />
                <DateRangeInput
                    variant="form"
                    label="Date"
                    name="dateRange"
                    value={dateRange}
                    onChange={handleDateChange}
                />
                {dateLists && dateLists.map((el) => (
                    <RadioInput
                        key={el}
                        label={el}
                        name={el}
                        value={value?.leaveDays?.find((item) => item.date === el)?.type}
                        onChange={handleRadio}
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={dayLeaveOptions?.leaveDayTypeChoices?.enumValues ?? undefined}
                        error={getErrorString(error?.leaveDays)}
                    />
                ))}
                <NumberInput
                    disabled
                    label="Number of Day/s"
                    name="numOfDays"
                    value={value?.numOfDays}
                    onChange={setFieldValue}
                    error={error?.numOfDays}
                />
                <TextArea
                    label="Additional Information"
                    name="additionalInformation"
                    value={value.additionalInformation}
                    onChange={setFieldValue}
                    error={error?.additionalInformation}
                />
                <Button
                    className={styles.btnSubmit}
                    type="submit"
                    name={undefined}
                    variant="tertiary"
                    disabled={pristine}
                >
                    Submit
                </Button>
            </form>
        </Modal>
    );
}
export default LeaveModal;
