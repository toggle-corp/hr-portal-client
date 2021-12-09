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
    removeNull,
    useForm,
} from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';
import { gql, useMutation, useQuery } from '@apollo/client';

import {
    DayLeaveTypeQuery,
    LeaveTypeQuery,
    LeaveApplyInputType,
    LeaveApplyMutation,
    LeaveApplyMutationVariables,
    LeaveDayInputType,
} from '#generated/types';

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
        }
    }
`;

interface Option {
    name: string,
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
type FormType = LeaveApplyInputType;
type FormSchema = ObjectSchema<PartialForm<FormType>>
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        type: [],
        numOfDays: [],
        leaveDays: [],
        additionalInformation: [],
    }),
};

const defaultFormValues: PartialForm<LeaveApplyInputType> = {
    type: 'SICK',
    leaveDays: [],
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

    const [
        submit,
    ] = useMutation<LeaveApplyMutation, LeaveApplyMutationVariables>(
        SUBMIT,
        {
            onCompleted: (response) => {
                const { login: loginRes } = response;
                if (!loginRes) {
                    return;
                }
                const {
                    errors,
                    ok,
                } = loginRes;

                if (errors) {
                    setError(errors[0].messages);
                } else if (ok) {
                    // NOTE: there can be case where errors is empty but it still errored
                    // FIXME: highestRole is sent as string from the server
                    // setUser(removeNull(result));
                }
            },
            onError: () => {
                setError(undefined);
            },
        },
    );

    const handleSubmit = useCallback(
        (finalValues: FormType) => {
            const completeValue = finalValues as FormType;
            console.log({ completeValue });
            submit({
                variables: {
                    input: completeValue,
                },
            });
        }, [submit],
    );

    const selectedDays: Array<LeaveDayInputType> = value?.leaveDays;
    const handleRadio = useCallback(
        async (e: string | number, el: string) => {
            const obj: { type: string | number | undefined, date: string | undefined } = {
                type: undefined,
                date: undefined,
            };
            const hasDate = value && value?.leaveDays.some((x) => x?.date === el);
            if (hasDate) {
                const updatedData = selectedDays.map(
                    (x: LeaveDayInputType) => (x.date === el ? { ...x, type: e } : x),
                );
                const diffData = [...new Set(
                    updatedData.map(JSON.stringify))].map(JSON.parse);
                setValue({ ...value, leaveDays: diffData });
            } else {
                obj.date = el;
                obj.type = e;
                selectedDays.push(obj);
                setValue({ ...value, leaveDays: selectedDays });
            }
        },
        [setValue, dateLists, selectedDays],
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

    const convertArrayToObject = (data: string[]) => {
        const arrayObject: Array<LeaveDayInputType> = [];
        data.map((item) => {
            const obj: LeaveDayInputType = {
                date: item,
                type: 'FULL',

            };
            return arrayObject.push(obj);
        });
        setValue({ ...value, leaveDays: arrayObject });
    };

    const handleDateChange = useCallback(
        async (e) => {
            setDateRange(e);
            const dayList = await getDaysArray(new Date(e.startDate), new Date(e.endDate));
            const formattedDate = await dayList.map((v: Date) => v.toISOString().split('T')[0]);
            // convertArrayToObject(formattedDate);
            setDateLists(formattedDate);
        },
        [getDaysArray],
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
                    // error={error?.dateRange}
                    onChange={handleDateChange}
                />
                {dateLists && dateLists.map((el) => (
                    <RadioInput
                        key={el}
                        label={el}
                        name={el}
                        value={value?.leaveDays?.find((item) => item.date === el)?.type}
                        onChange={handleRadio}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        options={dayLeaveOptions?.leaveDayTypeChoices?.enumValues ?? undefined}
                    />
                ))}

                <TextInput
                    disabled
                    label="Number of Day/s"
                    name="numOfDays"
                    value={value.numOfDays}
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
            </form>
        </Modal>
    );
}
export default LeaveModal;
