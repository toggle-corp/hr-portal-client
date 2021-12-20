import { mapToMap } from '@togglecorp/fujs';

import { ContextInterface } from './context';

export interface Error {
    reason: string;
    // exception: any;
    value: {
        formErrors: {
            [key: string]: string | undefined;
        },
        messageForNotification: string,
    };
    errorCode: number | undefined;
}

export interface ErrorFromServer {
    errorCode?: number;
    errors: {
        // NOTE: it is most probably only string[]
        [key: string]: string[] | string;
    };
}

export function getCookie(name: string) {
    let cookieValue;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === `${name}=`) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function alterResponse(errors: ErrorFromServer['errors']): Error['value']['formErrors'] {
    const otherErrors = mapToMap(
        errors,
        (item) => item,
        (item) => (Array.isArray(item) ? item.join(' ') : item),
    );
    return otherErrors;
}

// NOTE: Any other special options sent to request should be added here
export interface OptionBase {
}

export type MeraContextInterface = ContextInterface<
    // eslint-disable-next-line @typescript-eslint/ban-types
    object,
    ErrorFromServer,
    Error,
    OptionBase
>;

const endPoint = !process.env.REACT_APP_API_ENDPOINT
    ? 'http://localhost:8010'
    : process.env.REACT_APP_API_ENDPOINT;

export const processUrls: MeraContextInterface['transformUrl'] = (url: string) => (
    `${endPoint}${url}`
);

export function processOptions(
    url: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: Omit<RequestInit, 'body'> & { body?: RequestInit['body'] | object | undefined },
): RequestInit {
    const {
        body,
        headers,
        method,
        ...otherOptions
    } = options;
    const csrftoken = getCookie('mera-csrftoken');

    let basicCredentials;
    if (url === '/users/login/' && method === 'POST' && body && typeof body === 'object') {
        const loginBody = body as { username: string; password: string };
        basicCredentials = url === '/users/login/'
            ? btoa(`${loginBody?.username}:${loginBody?.password}`)
            : undefined;
    }

    return {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-CSRFToken': csrftoken ?? '',
            Authorization: basicCredentials ? `Basic ${basicCredentials}` : '',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        method,
        ...otherOptions,
    };
}

export const processResponse: MeraContextInterface['transformResponse'] = async (
    res,
) => {
    const resText = await res.text();
    if (resText.length > 0) {
        const json = JSON.parse(resText);

        return json;
    }
    return undefined;
};

export const processError: MeraContextInterface['transformError'] = (
    res,
) => {
    let error: Error;
    if (res === 'network') {
        error = {
            reason: 'network',
            // exception: e,
            value: {
                messageForNotification: 'Network error',
                formErrors: {
                    $internal: 'Network error',
                },
            },
            errorCode: undefined,
        };
    } else if (res === 'parse') {
        error = {
            reason: 'parse',
            // exception: e,
            value: {
                messageForNotification: 'Response parse error',
                formErrors: {
                    $internal: 'Response parse error',
                },
            },
            errorCode: undefined,
        };
    } else {
        const formErrors = alterResponse(res.errors);

        const messageForNotification = (
            formErrors?.$internal
            ?? 'Some error occurred while performing this action.'
        );

        const requestError = {
            formErrors,
            messageForNotification,
        };

        error = {
            reason: 'server',
            value: requestError,
            errorCode: res.errorCode,
        };
    }

    return error;
};
