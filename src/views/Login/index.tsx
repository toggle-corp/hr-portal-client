import React, { useContext } from 'react';
import {
    TextInput,
    PasswordInput,
    Button,
    PendingMessage,
} from '@togglecorp/toggle-ui';
import {
    PartialForm,
    PurgeNull,
    useForm,
    ObjectSchema,
    createSubmitHandler,
    requiredStringCondition,
    lengthGreaterThanCondition,
} from '@togglecorp/toggle-form';

import { useLazyRequest } from '#utils/request';
import DomainContext from '#components/DomainContext';
import NonFieldError from '#components/NonFieldError';
import { User } from '#types';

import styles from './styles.css';

interface LoginInputType {
    username?: string;
    password?: string;
}

type LoginFormFields = LoginInputType;
type FormType = PurgeNull<PartialForm<LoginFormFields>>;
type FormSchema = ObjectSchema<FormType>
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        username: [requiredStringCondition],
        password: [requiredStringCondition, lengthGreaterThanCondition(5)],
    }),
};

const initialLoginFormFields: FormType = {};

function Login() {
    const { setUser } = useContext(DomainContext);

    const {
        value,
        error,
        onValueChange,
        onErrorSet,
        validate,
    } = useForm(initialLoginFormFields, schema);

    // FIXME: Use graphql query instead of restrequest
    const {
        pending: loading,
        trigger: login,
    } = useLazyRequest<User, LoginFormFields>({
        method: 'POST',
        url: '/users/login/',
        body: (ctx) => ctx,
        onSuccess: (response) => {
            setUser(response);
        },
        onFailure: ({ value: errorValue }) => {
            onErrorSet(errorValue.formErrors);
        },
    });
    const handleSubmit = (finalValue: FormType) => {
        const completeValue = finalValue as LoginFormFields;
        login(completeValue);
    };

    return (
        <div className={styles.signIn}>
            <div className={styles.signInFormContainer}>
                <form
                    className={styles.signInForm}
                    onSubmit={createSubmitHandler(validate, onErrorSet, handleSubmit)}
                >
                    {loading && <PendingMessage />}
                    <NonFieldError error={error?.nonFieldErrors} />
                    <TextInput
                        label="Username *"
                        name="username"
                        value={value.username}
                        onChange={onValueChange}
                        error={error?.fields?.username}
                        disabled={loading}
                    />
                    <PasswordInput
                        label="Password *"
                        name="password"
                        value={value.password}
                        onChange={onValueChange}
                        error={error?.fields?.password}
                        disabled={loading}
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
                        <Button
                            variant="primary"
                            type="submit"
                            name={undefined}
                            disabled={loading}
                        >
                            Sign In
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
