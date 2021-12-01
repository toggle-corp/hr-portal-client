import React from 'react';
import {
    PartialForm,
    PurgeNull,
    useForm,
    ObjectSchema,
    createSubmitHandler,
    internal,
    getErrorObject,
} from '@togglecorp/toggle-form';

import { Button, PasswordInput, TextInput } from '@the-deep/deep-ui';
import styles from './styles.css';

interface LoginInputType {
    username?: string;
    password?: string;
}

type LoginFormFields = LoginInputType;
type FormType = PurgeNull<PartialForm<LoginFormFields>>;
type FormSchema = ObjectSchema<PartialForm<FormType>>
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        username: [],
        password: [],
    }),
};
const defaultFormValues: PartialForm<FormType> = {};

function Login() {
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, defaultFormValues);
    /*
        const handleSubmit = useCallback(
            (finalValues: PartialForm<FormType>) => {
                setValue(finalValues);
            }, [setValue],
        );
    */
    const error = getErrorObject(riskyError);
    const handleSubmit = (finalValue: FormType) => {
        const completeValue = finalValue as LoginFormFields;
        /*
        login(completeValue);
        */
    };

    return (
        <div className={styles.signIn}>
            <div className={styles.signInFormContainer}>
                <form
                    onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
                >
                    <p>
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
