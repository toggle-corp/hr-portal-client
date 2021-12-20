import React, { useCallback, useContext } from 'react';
import {
    PartialForm,
    PurgeNull,
    useForm,
    ObjectSchema,
    createSubmitHandler,
    internal,
    getErrorObject,
    removeNull,
    requiredStringCondition,
    lengthGreaterThanCondition,
} from '@togglecorp/toggle-form';
import {
    Button,
    PasswordInput,
    TextInput,
} from '@the-deep/deep-ui';
import {
    gql,
    useMutation,
} from '@apollo/client';

import {
    LoginInputType,
    LoginMutation,
    LoginMutationVariables,
} from '#generated/types';
import UserContext from '#base/context/UserContext';

import styles from './styles.css';

const LOGIN = gql`
    mutation Login($input: LoginInputType!) {
        login(data: $input) {
        result {
            id
            firstName
            lastName
        }
        ok
        errors
        }
    }
`;

type LoginFormFields = LoginInputType;
type FormType = PurgeNull<PartialForm<LoginFormFields>>;
type FormSchema = ObjectSchema<PartialForm<FormType>>
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        username: [requiredStringCondition],
        password: [requiredStringCondition, lengthGreaterThanCondition(5)],
    }),
};
const defaultFormValues: PartialForm<FormType> = {};

function Login() {
    const { setUser } = useContext(UserContext);
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, defaultFormValues);

    const [
        login,
    ] = useMutation<LoginMutation, LoginMutationVariables>(
        LOGIN,
        {
            onCompleted: (response) => {
                const { login: loginRes } = response;
                if (!loginRes) {
                    return;
                }
                const {
                    errors,
                    result,
                    ok,
                } = loginRes;

                if (errors) {
                    setError({
                        [internal]: 'Invalid username or password',
                    });
                } else if (ok) {
                    // NOTE: there can be case where errors is empty but it still errored
                    // FIXME: highestRole is sent as string from the server
                    setUser(removeNull(result));
                }
            },
            onError: (errors) => {
                setError(errors?.message);
            },
        },
    );

    const handleSubmit = useCallback((finalValue: FormType) => {
        const completeValue = finalValue as LoginFormFields;
        login({
            variables: {
                input: completeValue,
            },
        });
    }, [login]);

    const error = getErrorObject(riskyError);

    return (
        <div className={styles.signIn}>
            <div className={styles.signInFormContainer}>
                <form
                    onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
                >
                    <p className={styles.inActive}>
                        {error?.[internal]}
                    </p>
                    <TextInput
                        label="Username"
                        name="username"
                        value={value.username}
                        onChange={setFieldValue}
                        error={error?.username}
                    />
                    <PasswordInput
                        label="Password"
                        name="password"
                        value={value.password}
                        onChange={setFieldValue}
                        error={error?.password}
                    />
                    <div className={styles.actionButtons}>
                        <a
                            className={styles.forgotPasswordLink}
                            rel="noreferrer"
                            target="_blank"
                            href="/#"
                        >
                            Forgot password?
                        </a>
                    </div>
                    <Button
                        type="submit"
                        name={undefined}
                        variant="primary"
                        disabled={pristine}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;
