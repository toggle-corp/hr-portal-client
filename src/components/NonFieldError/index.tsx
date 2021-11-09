import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.css';

interface Props {
    className?: string;
    error?: string | string[];
}

function NonFieldError(props: Props) {
    const {
        error,
        className,
    } = props;

    if (!error) {
        return null;
    }

    const children: React.ReactNode = Array.isArray(error)
        ? error.join(', ')
        : error;

    return (
        <div className={_cs(styles.nonFieldError, className)}>
            { children }
        </div>
    );
}

export default NonFieldError;
