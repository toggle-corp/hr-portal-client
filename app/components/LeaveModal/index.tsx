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
    removeNull,
    internal,
} from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';
import {
    gql,
    useLazyQuery,
    useMutation,
    useQuery,
} from '@apollo/client';

import {
    DayLeaveTypeQuery,
    LeaveTypeQuery,
    LeaveApplyInputType,
    LeaveApplyMutation,
    LeaveApplyMutationVariables,
    LeaveDayInputType,
} from '#generated/types';
import { GET_LEAVE_LIST } from '#views/Leave';
import { EnumFix } from '#base/types/enumFix';
import {
    ObjectError,
    transformToFormError,
} from '#base/utils/errorTransform';

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

interface Props {
    className?: string;
    modalShown?: boolean;
    handleModalClose: () => void;
}
type ExtraFormField = {
    additionalInformation?: string | undefined | null;
    type: string | undefined;
    leaveDays: LeaveDayInputType[];
    numOfDays?: number | undefined;
    startDate?: number | undefined;
}

type FormType = PartialForm<NonNullable<EnumFix<ExtraFormField, 'type' | 'status'>>>;
type FormSchema = ObjectSchema<FormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        type: [requiredCondition],
        leaveDays: [requiredCondition],
        additionalInformation: [],
    }),
};

const defaultFormValues: FormType = {
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
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError({
                        ...formError,
                        [internal]: formError as unknown as string,
                    });
                    addAlert({
                        children: 'Cannot apply leave',
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
                    setFieldValue(undefined, 'numOfDays');
                    setFieldValue(null, 'additionalInformation');
                    setDateRange(null);
                    setDateLists([]);
                }
            },
            onError: (errors) => {
                addAlert({
                    name: 'Leave apply',
                    children: errors?.message,
                    duration: 1000,
                    variant: 'error',
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
        (e: string | undefined, el: string) => {
            const updatedData = value?.leaveDays?.map(
                (x) => (x.date === el ? { ...x, type: e } : x),
            );
            const distinctData = [...new Map(updatedData?.map(
                (item) => [item?.date, item],
            )).values()];
            const filterNoLeave = updatedData?.filter((word) => word?.type !== 'NO_LEAVE');
            const numberOfDays = filterNoLeave?.length;
            setFieldValue(distinctData, 'leaveDays');
            setFieldValue(numberOfDays, 'numOfDays');
        },
        [setFieldValue, value],
    );

    const getDaysArray = useCallback(
        (start: Date, end: Date) => {
            const arr: string[] = [];
            for (let dt = new Date(start); dt <= end;) {
                dt.setDate(dt.getDate() + 1);
                if (new Date(dt).getDay() !== 0 && new Date(dt).getDay() !== 6) {
                    arr.push(new Date(dt).toISOString().split('T')[0]);
                }
            }
            return arr;
        },
        [],
    );

    const defaultLeaveDays = useCallback(
        (data: string[]) => {
            const arrayObject: EnumFix<Array<LeaveDayInputType>, 'type'> = [];
            data.map((item) => {
                const obj: EnumFix<LeaveDayInputType, 'type'> = {
                    date: item,
                    type: 'FULL',
                };
                return arrayObject.push(obj);
            });
            setFieldValue(arrayObject, 'leaveDays');
            setFieldValue(arrayObject.length, 'numOfDays');
        },
        [setFieldValue],
    );

    const handleDateChange = useCallback(
        (e) => {
            setDateRange(e);
            const dayList = getDaysArray(new Date(e.startDate), new Date(e.endDate));
            defaultLeaveDays(dayList);
            setDateLists(dayList);
        },
        [getDaysArray, defaultLeaveDays],
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
                    name="startDate"
                    value={dateRange}
                    onChange={handleDateChange}
                    error={error?.startDate}
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
                    value={value?.additionalInformation}
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
